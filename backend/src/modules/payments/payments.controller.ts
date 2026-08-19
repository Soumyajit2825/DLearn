import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-transaction')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new transaction' })
  createTransaction(@Req() req, @Body() dto: CreateTransactionDto) {
    return this.paymentsService.createTransaction(req.user.id, dto);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transaction history' })
  getHistory(@Req() req, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.paymentsService.getHistory(req.user.id, page, limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transaction by ID' })
  getById(@Param('id') id: string) {
    return this.paymentsService.getById(id);
  }

  @Post('x402/webhook')
  @ApiOperation({ summary: 'X402 payment webhook' })
  processX402Payment(@Body() body: any) {
    return this.paymentsService.processX402Payment(body);
  }
}
