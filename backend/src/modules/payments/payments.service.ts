import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType, TransactionStatus } from '../../entities/transaction.entity';
import { Wallet } from '../../entities/wallet.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private walletsRepository: Repository<Wallet>,
  ) {}

  async createTransaction(userId: string, dto: CreateTransactionDto): Promise<Transaction> {
    const wallet = await this.walletsRepository.findOne({ where: { userId } });
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const transaction = this.transactionsRepository.create({
      walletId: wallet.id,
      userId,
      type: dto.type,
      amount: dto.amount,
      asset: dto.asset || 'XLM',
      reference: dto.reference,
      description: dto.description,
      status: TransactionStatus.PENDING,
    });

    if (dto.type === TransactionType.DEPOSIT && dto.amount > 0) {
      wallet.balance = Number(wallet.balance) + dto.amount;
      await this.walletsRepository.save(wallet);
    }

    return this.transactionsRepository.save(transaction);
  }

  async getHistory(userId: string, page = 1, limit = 10): Promise<{ data: Transaction[]; total: number }> {
    const [data, total] = await this.transactionsRepository.findAndCount({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { data, total };
  }

  async getById(id: string): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({ where: { id } });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  async processX402Payment(webhookData: any): Promise<{ status: string }> {
    const transaction = await this.transactionsRepository.findOne({
      where: { reference: webhookData.reference },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    transaction.status = webhookData.success ? TransactionStatus.COMPLETED : TransactionStatus.FAILED;
    transaction.stellarTxHash = webhookData.txHash;

    if (webhookData.success) {
      const wallet = await this.walletsRepository.findOne({ where: { id: transaction.walletId } });
      if (wallet) {
        wallet.balance = Number(wallet.balance) - Number(transaction.amount);
        await this.walletsRepository.save(wallet);
      }
    }

    await this.transactionsRepository.save(transaction);
    return { status: transaction.status };
  }
}
