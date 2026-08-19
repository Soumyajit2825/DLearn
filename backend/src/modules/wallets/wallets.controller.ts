import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WalletsService } from './wallets.service';
import { ConnectWalletDto } from './dto/connect-wallet.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('Wallets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  @ApiOperation({ summary: 'Connect a Stellar wallet' })
  connect(@Req() req, @Body() dto: ConnectWalletDto) {
    return this.walletsService.connect(req.user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my wallet' })
  getMyWallet(@Req() req) {
    return this.walletsService.getMyWallet(req.user.id);
  }

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  getBalance(@Req() req) {
    return this.walletsService.getBalance(req.user.id);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Withdraw from wallet' })
  withdraw(@Req() req, @Body() dto: WithdrawDto) {
    return this.walletsService.withdraw(req.user.id, dto);
  }
}
