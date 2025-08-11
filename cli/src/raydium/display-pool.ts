import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { displayPool } from '@flipflop-sdk/node';
import { BN } from '@coral-xyz/anchor';

interface DisplayPoolOptions {
  rpc?: string;
  mintA: string;
  mintB: string;
}

export async function displayPoolCommand(options: DisplayPoolOptions) {
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

  try {
    const connection = new Connection(options.rpc, 'confirmed');
    const result = await displayPool({
      connection,
      tokenAMint: new PublicKey(options.mintA),
      tokenBMint: new PublicKey(options.mintB),
      rpc: options.rpc,
    });

    if (!result) {
      console.log('❌ No pool found for the given token pair');
      return;
    }

    console.log('\n📊 Pool Information');
    console.log('━'.repeat(50));
    console.log(`Pool Address: ${result.poolAddress.toBase58()}`);
    console.log(`Config ID: ${result.configId.toBase58()}`);
    console.log(`Pool Creator: ${result.poolCreator.toBase58()}`);
    console.log(`Vault A: ${result.vaultA.toBase58()}`);
    console.log(`Vault B: ${result.vaultB.toBase58()}`);
    console.log(`LP Token Mint: ${result.mintLp.toBase58()}`);
    console.log(`Token A Mint: ${result.mintA.toBase58()}`);
    console.log(`Token B Mint: ${result.mintB.toBase58()}`);
    console.log(`LP Supply: ${result.lpAmount.toNumber() / LAMPORTS_PER_SOL}`);
    console.log(`Pool Price: ${(1 / result.poolPrice).toFixed(6)} Token/SOL`);
    console.log(`Base Reserve: ${(result.baseReserve.toNumber() / LAMPORTS_PER_SOL).toFixed(6)} SOL`);
    console.log(`Quote Reserve: ${(result.quoteReserve.toNumber() / LAMPORTS_PER_SOL).toFixed(6)} Token`);

  } catch (error) {
    console.error('❌ Error displaying pool:', error instanceof Error ? error.message : 'Unknown error');
  }
}