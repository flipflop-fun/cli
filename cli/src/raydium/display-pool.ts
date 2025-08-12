import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { displayPool } from '@flipflop-sdk/node';
import { BN } from '@coral-xyz/anchor';
import { NATIVE_MINT } from '@solana/spl-token';

interface DisplayPoolOptions {
  rpc?: string;
  mint: string;
}

export async function displayPoolCommand(options: DisplayPoolOptions) {
  if (!options.rpc) {
    console.error('❌ Error: Missing --rpc parameter');
    return;
  }

  if (!options.mint) {
    console.error('❌ Error: Missing --mint parameter');
    return;
  }

  try {
    const connection = new Connection(options.rpc, 'confirmed');
    const result = await displayPool({
      connection,
      tokenAMint: NATIVE_MINT,
      tokenBMint: new PublicKey(options.mint),
      rpc: options.rpc,
    });

    if (!result) {
      console.error('❌ No pool found for the given token pair');
      return;
    }

    if (!result.success || !result.data) {
      console.error('❌ Error: ', result.message);
      return;
    }

    console.log('\n📊 Pool Information');
    console.log('━'.repeat(50));
    console.log(`Pool Address: ${result.data.poolAddress.toBase58()}`);
    console.log(`Config ID: ${result.data.configId.toBase58()}`);
    console.log(`Pool Creator: ${result.data.poolCreator.toBase58()}`);
    console.log(`Vault A: ${result.data.vaultA.toBase58()}`);
    console.log(`Vault B: ${result.data.vaultB.toBase58()}`);
    console.log(`LP Token Mint: ${result.data.mintLp.toBase58()}`);
    console.log(`Token A Mint: ${result.data.mintA.toBase58()}`);
    console.log(`Token B Mint: ${result.data.mintB.toBase58()}`);
    console.log(`LP Supply: ${result.data.lpAmount.toNumber() / LAMPORTS_PER_SOL}`);
    console.log(`Pool Price: ${(1 / result.data.poolPrice).toFixed(6)} Token/SOL`);
    console.log(`Base Reserve: ${(result.data.baseReserve.toNumber() / LAMPORTS_PER_SOL).toFixed(6)} SOL`);
    console.log(`Quote Reserve: ${(result.data.quoteReserve.toNumber() / LAMPORTS_PER_SOL).toFixed(6)} Token`);

  } catch (error) {
    console.error('❌ Error: ', error instanceof Error ? error.message : 'Unknown error');
  }
}