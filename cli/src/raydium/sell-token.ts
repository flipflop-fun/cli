import { PublicKey } from '@solana/web3.js';
import { loadKeypairFromBase58, loadKeypairFromFile } from '../utils';
import { sellToken } from '@flipflop-sdk/node';

interface SellTokenOptions {
  rpc?: string;
  mint: string;
  amount: string;
  slippage: string;
  keypairBs58?: string;
  keypairFile?: string;
  lut?: string;
}

export async function sellTokenCommand(options: SellTokenOptions) {
  if (!options.rpc) {
    console.error('❌ Error: Missing --rpc parameter');
    return;
  }

  if (!options.mint) {
    console.error('❌ Error: Missing --mint parameter');
    return;
  }

  if (!options.amount) {
    console.error('❌ Error: Missing --amount parameter');
    return;
  }

  if (!options.slippage) {
    options.slippage = '5';
  }

  if (!options.keypairBs58 && !options.keypairFile) {
    console.error('❌ Error: Missing --keypair-bs58 or --keypair-file parameter');
    return;
  }

  try {
    const seller = options.keypairFile
      ? loadKeypairFromFile(options.keypairFile)
      : loadKeypairFromBase58(options.keypairBs58!);

    const result = await sellToken({
      rpc: options.rpc!,
      mint: new PublicKey(options.mint),
      amount: parseFloat(options.amount),
      slippage: parseFloat(options.slippage),
      seller,
    });

    if (!result.success || !result.data) {
      console.error('❌ Error: ', result.message);
      return;
    }

    console.log('\n✅ Token Sale Successful!');
    console.log('━'.repeat(50));
    console.log(`Transaction Hash: ${result.data.txId}`);
    console.log(`Mint Address: ${result.data.mintAddress.toBase58()}`);
    console.log(`Tokens Sold: ${result.data.actualTokenAmount}`);
    console.log(`SOL Received: ${result.data.actualSolAmount}`);
    console.log(`Pool Address: ${result.data.poolAddress.toBase58()}`);

  } catch (error) {
    console.error('❌ Error: ', error instanceof Error ? error.message : 'Unknown error');
  }
}