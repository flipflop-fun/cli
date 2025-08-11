import { PublicKey } from '@solana/web3.js';
import { loadKeypairFromBase58, loadKeypairFromFile } from '../utils';
import { removeLiquidity } from '@flipflop-sdk/node';

interface RemoveLiquidityOptions {
  rpc?: string;
  mint: string;
  removePercentage: string;
  slippage?: string;
  keypairBs58?: string;
  keypairFile?: string;
}

export async function removeLiquidityCommand(options: RemoveLiquidityOptions) {
  if (!options.rpc) {
    console.error('❌ Error: Missing --rpc parameter');
    return;
  }

  if (!options.mint) {
    console.error('❌ Error: Missing --mint parameter');
    return;
  }

  if (!options.removePercentage) {
    console.error('❌ Error: Missing --remove-percentage parameter');
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

    const result = await removeLiquidity({
      rpc: options.rpc!,
      mint: new PublicKey(options.mint),
      removePercentage: parseFloat(options.removePercentage),
      payer,
      slippage: options.slippage ? parseFloat(options.slippage) : 1,
    });

    if (result.success && result.signature) {
      console.log('\n✅ Liquidity Removed Successfully!');
      console.log('━'.repeat(50));
      console.log(`Transaction Hash: ${result.signature}`);
      console.log(`Token A Received: ${result.tokenAAmount}`);
      console.log(`Token B Received: ${result.tokenBAmount}`);
    } else {
      console.log('\n❌ Failed to remove liquidity');
      console.log(`Error: ${result.error}`);
    }

  } catch (error) {
    console.error('❌ Error removing liquidity:', error instanceof Error ? error.message : 'Unknown error');
  }
}