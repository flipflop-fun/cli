import { PublicKey } from '@solana/web3.js';
import { loadKeypairFromBase58, loadKeypairFromFile } from '../utils';
import { buyToken } from '@flipflop-sdk/node';

interface BuyTokenOptions {
  rpc?: string;
  mint: string;
  amount: string;
  keypairBs58?: string;
  keypairFile?: string;
  lut?: string;
}

export async function buyTokenCommand(options: BuyTokenOptions) {
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

  if (!options.keypairBs58 && !options.keypairFile) {
    console.error('❌ Error: Missing --keypair-bs58 or --keypair-file parameter');
    return;
  }

  try {
    const payer = options.keypairFile
      ? loadKeypairFromFile(options.keypairFile)
      : loadKeypairFromBase58(options.keypairBs58!);

    const result = await buyToken({
      rpc: options.rpc!,
      mint: new PublicKey(options.mint),
      amount: parseFloat(options.amount),
      payer,
    });

    console.log('\n✅ Token Purchase Successful!');
    console.log('━'.repeat(50));
    console.log(`Transaction Hash: ${result.txId}`);
    console.log(`Mint Address: ${result.mintAddress.toBase58()}`);
    console.log(`Tokens Purchased: ${result.tokenAmount}`);
    console.log(`SOL Spent: ${result.solAmount}`);
    console.log(`Pool Address: ${result.poolAddress.toBase58()}`);

  } catch (error) {
    console.error('❌ Error buying token:', error instanceof Error ? error.message : 'Unknown error');
  }
}