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
      console.error('❌ No LP token information found');
      return;
    }

    if (!result.success || !result.data) {
      console.error('❌ Error: ', result.message);
      return;
    }

    console.log('\n💰 LP Token Information');
    console.log('━'.repeat(50));
    console.log(`Pool ID: ${result.data.poolId.toBase58()}`);
    console.log(`LP Token Mint: ${result.data.lpTokenMint.toBase58()}`);
    console.log(`LP Token Balance: ${result.data.lpTokenBalance.toNumber() / LAMPORTS_PER_SOL}`);
    console.log(`Share of Pool: ${result.data.shareOfPool.toString()}%`);
    console.log(`Token A Amount: ${result.data.tokenAAmount.toNumber() / LAMPORTS_PER_SOL}`);
    console.log(`Token B Amount: ${result.data.tokenBAmount.toNumber() / LAMPORTS_PER_SOL}`);
  } catch (error) {
    console.error('❌ Error: ', error instanceof Error ? error.message : 'Unknown error');
  }
}