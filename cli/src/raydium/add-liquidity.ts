import { PublicKey } from '@solana/web3.js';
import { loadKeypairFromBase58, loadKeypairFromFile } from '../utils';
import { addLiquidity } from '@flipflop-sdk/node';

interface AddLiquidityOptions {
  rpc?: string;
  mint: string;
  tokenAmount: string;
  slippage: string;
  keypairBs58?: string;
  keypairFile?: string;
}

export async function addLiquidityCommand(options: AddLiquidityOptions) {
  if (!options.rpc) {
    console.error('❌ Error: Missing --rpc parameter');
    return;
  }

  if (!options.mint) {
    console.error('❌ Error: Missing --mint parameter');
    return;
  }

  if (!options.tokenAmount) {
    console.error('❌ Error: Missing --token-amount parameter');
    return;
  }

  if (!options.slippage) {
    console.error('❌ Error: Missing --slippage parameter');
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

    const result = await addLiquidity({
      rpc: options.rpc!,
      mint: new PublicKey(options.mint),
      tokenAmount: parseFloat(options.tokenAmount),
      slippage: parseFloat(options.slippage),
      payer,
    });

    console.log('\n✅ Liquidity Added Successfully!');
    console.log('━'.repeat(50));
    console.log(`Transaction Hash: ${result.signature}`);
    console.log(`Mint Address: ${result.mintAddress.toBase58()}`);
    console.log(`Tokens Added: ${result.tokenAmount.toString()}`);
    console.log(`SOL Added: ${result.solAmount.toString()}`);
    console.log(`LP Tokens Received: ${result.lpTokenAmount.toString()}`);
    console.log(`Pool Address: ${result.poolAddress.toBase58()}`);

  } catch (error) {
    console.error('❌ Error adding liquidity:', error instanceof Error ? error.message : 'Unknown error');
  }
}