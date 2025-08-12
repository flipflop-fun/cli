import { PublicKey } from '@solana/web3.js';
import { loadKeypairFromBase58, loadKeypairFromFile } from './utils';
import { setUrc } from '@flipflop-sdk/node';

interface SetUrcOptions {
  rpc: string;
  urc: string;
  mint: string;
  keypairBs58: string;
  keypairFile: string;
}

export async function setUrcCommand(options: SetUrcOptions) {
  // Validate required parameters
  if (!options.keypairBs58 && !options.keypairFile) {
    console.error('❌ Error: Missing --keypair-bs58 or --keypair-file parameter');
    return;
  }

  try {
    // Load keypair and create wallet (keypair-file takes priority)
    const refAccount = options.keypairFile 
      ? loadKeypairFromFile(options.keypairFile)
      : loadKeypairFromBase58(options.keypairBs58!);

    const result = await setUrc({
      rpc: options.rpc,
      urc: options.urc,
      mint: new PublicKey(options.mint),
      refAccount,
    });

    if (!result.success || !result.data) {
      console.error('❌ Error: ', result.message);
      return;
    }

    console.log('\n📊 Referral Account Details');
    console.log('━'.repeat(50));
    console.log(`Referrer Address: ${refAccount.publicKey.toBase58()}`);
    console.log(`Referrer Token Account: ${result.data.referrerTokenAccount.toBase58()}`);
    console.log(`Code Hash: ${result.data.codeHash.toBase58()}`);
    console.log(`Usage Count: ${result.data.usageCount}`);
    const activationDate = new Date(result.data.activatedAt * 1000);
    console.log(`Activated: ${activationDate.toLocaleString()}`);
  } catch (error) {
    console.error('❌ Error: ', error instanceof Error ? error.message : 'Unknown error');
  }
}