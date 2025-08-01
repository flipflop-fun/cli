import { Connection, PublicKey } from '@solana/web3.js';
import { PROGRAM_ID } from './config';
import { getMetadataByMint, parseConfigData } from './utils';
import { CONFIG_DATA_SEED } from './constants';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';
import idl from './idl/fair_mint_token.json';
import { FairMintToken } from './types/fair_mint_token';

// Init command handler
export async function displayMintCommand(options: any) {
  const rpcUrl = options.rpc;
  const mintAccount = new PublicKey(options.mint);
  const rpc = new Connection(rpcUrl, 'confirmed');

  const wallet = {
    publicKey: PublicKey.default,
    signTransaction: async (tx: any) => tx,
    signAllTransactions: async (txs: any[]) => txs,
  };

  const provider = new AnchorProvider(rpc, wallet as anchor.Wallet, {
    commitment: 'confirmed',
  });
  const program = new Program(idl, provider) as Program<FairMintToken>;

  const metadataData = await getMetadataByMint(rpc, mintAccount);
  if (!metadataData.success) {
    console.error("Get token metadata failed", metadataData.message);
    return;
  }
  console.log(metadataData);

  // Get config account details
  const [configAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from(CONFIG_DATA_SEED), new PublicKey(mintAccount).toBuffer()],
    PROGRAM_ID,
  );
  console.log("config account", configAccount.toBase58());

  const configAccountInfo = await parseConfigData(program, configAccount);
  console.log("config account data", configAccountInfo);
}