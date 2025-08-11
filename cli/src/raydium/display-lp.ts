import { loadKeypairFromBase58, loadKeypairFromFile } from '../utils';
import { displayLP } from '@flipflop-sdk/node';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

interface DisplayLPOptions {
  rpc?: string;
  mint: string;
  owner: string;
}

export async function displayLPCommand(options: DisplayLPOptions) {
  if (!options.rpc) {
    console.error('❌ Error: Missing --rpc parameter');
    return;
  }

  if (!options.mint) {
    console.error('❌ Error: Missing --mint parameter');
    return;
  }

  if (!options.owner) {
    console.error('❌ Error: Missing --owner parameter');
    return;
  }

  try {
    const owner = new PublicKey(options.owner);
    const mint = new PublicKey(options.mint);

    const result = await displayLP({
      rpc: options.rpc!,
      mint,
      owner,
    });

    if (!result) {
      console.log('❌ No LP token information found');
      return;
    }

    console.log('\n💰 LP Token Information');
    console.log('━'.repeat(50));
    console.log(`Pool ID: ${result.poolId.toBase58()}`);
    console.log(`LP Token Mint: ${result.lpTokenMint.toBase58()}`);
    console.log(`LP Token Balance: ${result.lpTokenBalance.toNumber() / LAMPORTS_PER_SOL}`);
    console.log(`Share of Pool: ${result.shareOfPool.toString()}%`);
    console.log(`Token A Amount: ${result.tokenAAmount.toNumber() / LAMPORTS_PER_SOL}`);
    console.log(`Token B Amount: ${result.tokenBAmount.toNumber() / LAMPORTS_PER_SOL}`);

  } catch (error) {
    console.error('❌ Error displaying LP:', error instanceof Error ? error.message : 'Unknown error');
  }
}