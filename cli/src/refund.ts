import { PublicKey } from '@solana/web3.js';
import { loadKeypairFromBase58, loadKeypairFromFile } from './utils';
import { refundToken } from '@flipflop-sdk/node';

interface RefundOptions {
  rpc: string;
  keypairBs58?: string;
  keypairFile?: string;
  mint: string;
}

export async function refundCommand(options: RefundOptions) {
  try {
    if (!options.rpc) {
      console.error('❌ Error: Missing --rpc parameter');
      return;
    }

    if (!options.mint) {
      console.error('❌ Error: Missing --mint parameter');
      return;
    }

    if (!options.keypairBs58 && !options.keypairFile) {
      console.error('❌ Error: Missing --keypair-bs58 or --keypair-file parameter');
      return;
    }

    const mintAccount = new PublicKey(options.mint);
    const owner = options.keypairFile 
      ? loadKeypairFromFile(options.keypairFile)
      : loadKeypairFromBase58(options.keypairBs58!);

    const result = await refundToken({
      rpc: options.rpc,
      owner,
      mint: mintAccount,
    })

    if(!result?.success || !result?.data) {
      console.log("Owner: ", owner.publicKey.toBase58());
      console.error('❌ Error: Mint operation failed', result?.message);
      return;
    }
    
    console.log('Tokens refunded successfully!');
    console.log('');
    console.log("=".repeat(40));
    console.log(`Mint: ${mintAccount}`);
    console.log(`Owner: ${owner.publicKey.toBase58()}`)
    console.log(`Transaction Hash: ${result.data?.tx}`);
    console.log('')
    console.log(`Check your token balance by:\n> spl-token balance ${mintAccount} --owner ${owner.publicKey.toBase58()}`)
    console.log("=".repeat(40));
  } catch (error) {
    console.error('❌ Error: Refund operation failed -', error);
    process.exit(1);
  }
}
