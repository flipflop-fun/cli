import { PublicKey } from '@solana/web3.js';
import { loadKeypairFromBase58, loadKeypairFromFile } from '../utils';
import { burnLiquidity } from '@flipflop-sdk/node';

interface BurnLiquidityOptions {
  rpc?: string;
  mint: string;
  lpTokenAmount: string;
  keypairBs58?: string;
  keypairFile?: string;
}

export async function burnLiquidityCommand(options: BurnLiquidityOptions) {
  if (!options.rpc) {
    console.error('❌ Error: Missing --rpc parameter');
    return;
  }

  if (!options.mint) {
    console.error('❌ Error: Missing --mint parameter');
    return;
  }

  if (!options.lpTokenAmount) {
    console.error('❌ Error: Missing --lp-token-amount parameter');
    return;
  }

  if (!options.keypairBs58 && !options.keypairFile) {
    console.error('❌ Error: Missing --keypair-bs58 or --keypair-file parameter');
    return;
  }

  try {
    const burner = options.keypairFile
      ? loadKeypairFromFile(options.keypairFile)
      : loadKeypairFromBase58(options.keypairBs58!);

    const result = await burnLiquidity({
      rpc: options.rpc!,
      mint: new PublicKey(options.mint),
      lpTokenAmount: parseFloat(options.lpTokenAmount),
      burner,
    });

    console.log('\n✅ Liquidity Burned Successfully!');
    console.log('━'.repeat(50));
    console.log(`Transaction Hash: ${result.signature}`);
    console.log(`Mint Address: ${result.mintAddress}`);
    console.log(`LP Tokens Burned: ${result.burnedLpTokenAmount}`);
    console.log(`LP Token Mint: ${result.lpMintAddress}`);
    console.log(`Pool Address: ${result.poolAddress}`);

  } catch (error) {
    console.error('❌ Error burning liquidity:', error instanceof Error ? error.message : 'Unknown error');
  }
}