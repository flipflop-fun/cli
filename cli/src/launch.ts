import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { 
  SYSTEM_MANAGER_ACCOUNT, 
  getNetworkType 
} from './config';
import { loadKeypairFromBase58, parseConfigData } from './utils';
import { MINT_SEED, CONFIG_DATA_SEED, SYSTEM_CONFIG_SEEDS, METADATA_SEED, TOKEN_METADATA_PROGRAM_ID, TOKEN_PARAMS } from './constants';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { getAssociatedTokenAddress, NATIVE_MINT, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@coral-xyz/anchor';
import idl from './idl/fair_mint_token.json';
import { FairMintToken } from './types/fair_mint_token';

import { program as cliProgram } from 'commander';

// Token metadata interface
interface TokenMetadata {
  name: string;
  symbol: string;
  uri: string;
  decimals: number;
}

interface LaunchOptions {
  tokenType?: string;
  name: string;
  symbol: string;
  uri?: string;
  rpc?: string;
  keypairBs58?: string;
}
// Launch token command handler
export async function launchCommand(options: LaunchOptions) {
  const rpcUrl = options.rpc || 'http://127.0.0.1:8899';
  const type = options.tokenType;
  const rpc = new Connection(rpcUrl, 'confirmed');

  // Validate required parameters
  if (!options.keypairBs58) {
    console.error('Missing --keypair-bs58 parameter');
    return;
  }

  if (!options.name || !options.symbol) {
    console.error('Missing --name or --symbol parameter');
    return;
  }

  // Load keypair and create wallet
  const creator = loadKeypairFromBase58(options.keypairBs58);
  const wallet = {
    publicKey: creator.publicKey,
    signTransaction: async (tx: Transaction) => {
      tx.sign(creator);
      return tx;
    },
    signAllTransactions: async (txs: Transaction[]) => {
      txs.forEach(tx => tx.sign(creator));
      return txs;
    }
  };

  const provider = new AnchorProvider(rpc, wallet as anchor.Wallet, {
    commitment: 'confirmed',
  });

  const program = new Program(idl, provider) as Program<FairMintToken>;

  console.log('Network:', getNetworkType(rpcUrl));
  console.log('Creator:', creator.publicKey.toBase58());
  console.log('Program ID:', program.programId.toBase58());

  // Token parameters
  const tokenName = options.name;
  const tokenSymbol = options.symbol;
  const tokenUri = options.uri || `https://example.com/metadata/${tokenSymbol.toLowerCase()}.json`;

  const initConfigData: any = TOKEN_PARAMS[type as keyof typeof TOKEN_PARAMS];

  // Token metadata
  const metadata: TokenMetadata = {
    name: tokenName,
    symbol: tokenSymbol,
    uri: tokenUri,
    decimals: 9,
  };

  const [systemConfigAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from(SYSTEM_CONFIG_SEEDS), SYSTEM_MANAGER_ACCOUNT.toBuffer()],
    program.programId
  );

  const systemConfigData = await program.account.systemConfigData.fetch(systemConfigAccount);
  const protocolFeeAccount = systemConfigData.protocolFeeAccount;
  const [mintAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from(MINT_SEED), Buffer.from(metadata.name), Buffer.from(metadata.symbol.toLowerCase())],
    program.programId
  );
  
  const [configAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from(CONFIG_DATA_SEED), mintAccount.toBuffer()],
    program.programId,
  );

  // Create medatata PDA
  const [metadataAccountPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from(METADATA_SEED),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mintAccount.toBuffer()
    ],
    TOKEN_METADATA_PROGRAM_ID,
  );

  const info = await provider.connection.getAccountInfo(mintAccount);
  if (info) {
    console.log("Mint account was created, mint account: " + mintAccount.toBase58());
    console.table(await parseConfigData(program, configAccount));
    return;
  }
  console.log("name: ", metadata.name, "symbol: ", metadata.symbol, "uri: ", metadata.uri);
  const mintTokenVaultAta = await getAssociatedTokenAddress(
    mintAccount, 
    mintAccount, 
    true, 
    TOKEN_PROGRAM_ID
  );

  const tokenVaultAta = await getAssociatedTokenAddress(
    mintAccount, 
    configAccount, 
    true, 
    TOKEN_PROGRAM_ID
  );

  const wsolVaultAta = await getAssociatedTokenAddress(
    NATIVE_MINT,
    configAccount,
    true,
    TOKEN_PROGRAM_ID
  );
  
  const contextInitializeToken = {                        // => context of instruction #3
    metadata: metadataAccountPda, // ->
    payer: creator.publicKey, // fee payer ->
    mint: mintAccount, // ->
    configAccount, // ->
    mintTokenVault: mintTokenVaultAta, // ->
    tokenVault: tokenVaultAta, // ->
    wsolMint: NATIVE_MINT,
    wsolVault: wsolVaultAta,
    systemConfigAccount: systemConfigAccount, // ->
    protocolFeeAccount: protocolFeeAccount, // ->
    tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID, // ->
  };
  // console.log("Config", Object.fromEntries(
  //   Object.entries(contextInitializeToken).map(([key, value]) => [key, value.toString()])
  // ));

  try {
    const instructionInitializeToken = await program.methods  // ==> instruction #1
    .initializeToken(metadata, initConfigData)
    .accounts(contextInitializeToken)
    .instruction();

    const transaction = new Transaction()
      .add(instructionInitializeToken)              // ===> add instruction #1, init token

    const tx = await provider.sendAndConfirm(transaction, [creator]);
    console.log('Token created successfully!');
    // console.log('Transaction:', tx);
    console.log('Mint Address:', mintAccount.toBase58());
    console.log('Config Address:', configAccount.toBase58());
    console.log("Initialize Token Success tx: ", tx);
    console.table(await parseConfigData(program, configAccount));
  } catch (error) {
    console.error('Error creating token:', error);
  }
}
