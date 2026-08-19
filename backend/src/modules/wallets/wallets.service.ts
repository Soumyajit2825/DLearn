import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Wallet } from '../../entities/wallet.entity';
import { User } from '../../entities/user.entity';
import { ConnectWalletDto } from './dto/connect-wallet.dto';
import { WithdrawDto } from './dto/withdraw.dto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletsRepository: Repository<Wallet>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  private getEncryptionKey(): Buffer {
    const secret = this.configService.get<string>('jwt.secret') || 'default-encryption-key-change-me';
    return crypto.scryptSync(secret, 'stellar-wallet-salt', 32);
  }

  private encrypt(plaintext: string): string {
    const key = this.getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${tag}:${encrypted}`;
  }

  private decrypt(ciphertext: string): string {
    const key = this.getEncryptionKey();
    const parts = ciphertext.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async connect(userId: string, dto: ConnectWalletDto): Promise<Wallet> {
    const encryptedSecret = this.encrypt(dto.stellarSecretKey);
    const existing = await this.walletsRepository.findOne({ where: { userId } });
    if (existing) {
      existing.stellarPublicKey = dto.stellarPublicKey;
      existing.stellarSecretKey = encryptedSecret;
      return this.walletsRepository.save(existing);
    }

    const wallet = this.walletsRepository.create({
      userId,
      stellarPublicKey: dto.stellarPublicKey,
      stellarSecretKey: encryptedSecret,
    });

    await this.usersRepository.update(userId, {
      stellarPublicKey: dto.stellarPublicKey,
      walletId: wallet.id,
    });

    return this.walletsRepository.save(wallet);
  }

  async getMyWallet(userId: string): Promise<Wallet> {
    const wallet = await this.walletsRepository.findOne({ where: { userId } });
    if (!wallet) {
      throw new NotFoundException('Wallet not found. Connect a wallet first.');
    }
    const decrypted = this.decrypt(wallet.stellarSecretKey);
    return { ...wallet, stellarSecretKey: decrypted };
  }

  async getBalance(userId: string): Promise<{ balance: number }> {
    const wallet = await this.getMyWallet(userId);
    return { balance: wallet.balance };
  }

  async withdraw(userId: string, dto: WithdrawDto): Promise<{ message: string; transactionId: string }> {
    const wallet = await this.getMyWallet(userId);

    if (wallet.balance < dto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    wallet.balance = Number(wallet.balance) - dto.amount;
    await this.walletsRepository.save(wallet);

    return {
      message: 'Withdrawal initiated',
      transactionId: `withdraw_${Date.now()}`,
    };
  }
}
