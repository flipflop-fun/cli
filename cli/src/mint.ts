import { PublicKey } from '@solana/web3.js';
import { loadKeypairFromBase58, loadKeypairFromFile } from './utils';
import { mintToken } from '@flipflop-sdk/node';

interface MintOptions {
  rpc: string;
  keypairBs58?: string;
  keypairFile?: string;
  mint: string;
  urc: string;
  lut?: string;
  skipPreflight?: boolean;
}

export async function mintCommand(options: MintOptions) {
  try {
    if (!options.rpc) {
      console.error('❌ Error: Missing --rpc parameter');
      return;
    }

    if (!options.mint) {
      console.error('❌ Error: Missing --mint parameter');
      return;
    }

    if (!options.urc) {
      console.error('❌ Error: Missing --urc parameter');
      return;
    }

    if (!options.keypairBs58 && !options.keypairFile) {
      console.error('❌ Error: Missing --keypair-bs58 or --keypair-file parameter');
      return;
    }

    const mintAccount = new PublicKey(options.mint);
    const minter = options.keypairFile 
      ? loadKeypairFromFile(options.keypairFile)
      : loadKeypairFromBase58(options.keypairBs58!);

    const result = await mintToken({
      rpc: options.rpc,
      minter,
      mint: mintAccount,
      urc: options.urc,
      lookupTableAccount: options.lut ? new PublicKey(options.lut) : undefined,
      skipPreflight: options.skipPreflight || false,
    })

    if(!result?.success || !result?.data) {
      console.log("Minter: ", minter.publicKey.toBase58());
      console.error('❌ Error: Mint operation failed', result?.message);
      return;
    }
    
    console.log('Tokens minted successfully!');
    console.log('');
    console.log('Mint operation details:');
    console.log("=".repeat(40));
    console.log(`Mint: ${mintAccount}`);
    console.log(`URC: ${options.urc}`);
    console.log(`Owner: ${result.data?.owner.toBase58()}`)
    console.log(`Token Account: ${result.data?.tokenAccount.toBase58()}`)
    console.log(`Transaction Hash: ${result.data?.tx}`);
    console.log('')
    console.log(`Check your token balance by:\n> spl-token balance ${mintAccount} --owner ${minter.publicKey.toBase58()}`)
    console.log("=".repeat(40));
  } catch (error) {
    console.error('❌ Error: Mint operation failed -', error);
    process.exit(1);
  }
}
