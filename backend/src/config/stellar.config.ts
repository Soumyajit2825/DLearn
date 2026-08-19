import { registerAs } from '@nestjs/config';
export default registerAs('stellar', () => ({
  network: process.env.STELLAR_NETWORK || 'testnet',
  horizonUrl: process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org',
  rpcUrl: process.env.STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org',
  networkPassphrase: process.env.STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  treasuryPublicKey: process.env.STELLAR_TREASURY_PUBLIC_KEY || '',
  treasurySecretKey: process.env.STELLAR_TREASURY_SECRET_KEY || '',
}));
