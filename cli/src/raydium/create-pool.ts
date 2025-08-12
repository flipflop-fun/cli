import { PublicKey } from '@solana/web3.js';
import { loadKeypairFromBase58, loadKeypairFromFile } from '../utils';
import { createPool } from '@flipflop-sdk/node';

interface CreatePoolOptions {
  rpc?: string;
  mintA: string;
  mintB: string;
  amountA: string;
  amountB: string;
  keypairBs58?: string;
  keypairFile?: string;
}

export async function createPoolCommand(options: CreatePoolOptions) {
  if (!options.rpc) {
    console.error('❌ Error: Missing --rpc parameter');
    return;
  }

  if (!options.mintA) {
    console.error('❌ Error: Missing --mint-a parameter');
    return;
  }

  if (!options.mintB) {
    console.error('❌ Error: Missing --mint-b parameter');
    return;
  }

  if (!options.amountA) {
    console.error('❌ Error: Missing --amount-a parameter');
    return;
  }

  if (!options.amountB) {
    console.error('❌ Error: Missing --amount-b parameter');
    return;
  }

  if (!options.keypairBs58 && !options.keypairFile) {
    console.error('❌ Error: Missing --keypair-bs58 or --keypair-file parameter');
    return;
  }

  try {
    const creator = options.keypairFile
      ? loadKeypairFromFile(options.keypairFile)
      : loadKeypairFromBase58(options.keypairBs58!);

    const result = await createPool({
      rpc: options.rpc!,
      mintA: new PublicKey(options.mintA),
      mintB: new PublicKey(options.mintB),
      amountA: parseFloat(options.amountA),
      amountB: parseFloat(options.amountB),
      creator,
    });

    if (!result.success || !result.data) {
      console.error('❌ Error: ', result.message);
      return;
    }

    console.log('\n✅ Liquidity Pool Created Successfully!');
    console.log('━'.repeat(50));
    console.log(`Transaction Hash: ${result.data.signature}`);
    console.log(`Pool Address: ${result.data.poolAddress}`);
    console.log(`Token A Mint: ${result.data.mintA}`);
    console.log(`Token B Mint: ${result.data.mintB}`);
    console.log(`Token A Amount: ${result.data.amountA}`);
    console.log(`Token B Amount: ${result.data.amountB}`);
    console.log(`Creator: ${result.data.creator}`);

  } catch (error) {
    console.error('❌ Error: ', error instanceof Error ? error.message : 'Unknown error');
  }
}