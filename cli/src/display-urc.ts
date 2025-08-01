import { Connection, PublicKey } from '@solana/web3.js';
import { getURCDetails } from './utils';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';
import idl from './idl/fair_mint_token.json';
import { FairMintToken } from './types/fair_mint_token';

// Init command handler
export async function displayUrcCommand(options: any) {
  const rpcUrl = options.rpc;
  const urc = options.urc;
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

  const urcDetails = await getURCDetails(rpc, program, urc);
  console.log("URC Details", Object.fromEntries(
    Object.entries(urcDetails).map(([key, value]) => [key, value.toString()])
  ));
}