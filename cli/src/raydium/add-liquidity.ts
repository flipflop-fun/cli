import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
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

    if (!result.success || !result.data) {
      console.error('❌ Error: ', result.message);
      return;
    }

    console.log('\n✅ Liquidity Added Successfully!');
    console.log('━'.repeat(50));
    console.log(`Transaction Hash: ${result.data.signature}`);
    console.log(`Mint Address: ${result.data.mintAddress.toBase58()}`);
    console.log(`Tokens Added: ${result.data.tokenAmount.toNumber() / LAMPORTS_PER_SOL}`);
    console.log(`SOL Added: ${result.data.solAmount.toNumber() / LAMPORTS_PER_SOL}`);
    console.log(`LP Tokens Received: ${result.data.lpTokenAmount.toNumber() / LAMPORTS_PER_SOL}`);
    console.log(`Pool Address: ${result.data.poolAddress.toBase58()}`);

  } catch (error) {
    console.error('❌ Error: ', error instanceof Error ? error.message : 'Unknown error');
  }
}