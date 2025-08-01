import { AddressLookupTableAccount, AddressLookupTableProgram, Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { cpSwapConfigAddress, cpSwapProgram, createPoolFeeReceive, LOOKUP_TABLE_ACCOUNT, SYSTEM_MANAGER_ACCOUNT } from './config';
import { loadKeypairFromBase58, checkAccountExists } from './utils'; // Updated import
import { SYSTEM_CONFIG_SEEDS } from './constants';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { NATIVE_MINT, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { RENT_PROGRAM_ID, SYSTEM_PROGRAM_ID } from 'raydium-sdk-v2';
import { ASSOCIATED_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
import sleep from 'sleep-promise';
import * as anchor from '@coral-xyz/anchor';
import idl from './idl/fair_mint_token.json';
import { FairMintToken } from './types/fair_mint_token';

const createAddressLookupTable = async (
  connection: Connection,
  payer: Keypair,
  addresses: PublicKey[]
) => {
  const slot = await connection.getSlot("finalized"); // not "confirmed"
  console.log("slot", slot);
  // Create instruction for Address Lookup Table
  const [createIx, lutAddress] = AddressLookupTableProgram.createLookupTable({
    authority: payer.publicKey,
    payer: payer.publicKey,
    recentSlot: slot,
  });

  console.log("Create Address Lookup Table: ", lutAddress.toBase58());
  // Create instruction to extend Address Lookup Table
  const extendIx = AddressLookupTableProgram.extendLookupTable({
    payer: payer.publicKey,
    authority: payer.publicKey,
    lookupTable: lutAddress,
    addresses,
  });

  // Create and send transaction
  const tx = new Transaction()
    .add(createIx)
    .add(extendIx);

  tx.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
  tx.feePayer = payer.publicKey;
  
  await sendAndConfirmTransaction(connection, tx, [payer]);

  // Wait for confirmation and fetch the table
  await sleep(1000);
  const accountInfo = await connection.getAccountInfo(lutAddress);
  return new AddressLookupTableAccount({
    key: lutAddress,
    state: AddressLookupTableAccount.deserialize(accountInfo!.data),
  });
}

const createLookupTable = async (
  connection: Connection,
  payer: Keypair,
) => {
  const addresses: PublicKey[] = [
    TOKEN_PROGRAM_ID,
    TOKEN_2022_PROGRAM_ID,
    SYSTEM_PROGRAM_ID,
    RENT_PROGRAM_ID,
    ASSOCIATED_PROGRAM_ID,
    NATIVE_MINT,
    cpSwapProgram,
    cpSwapConfigAddress,
    createPoolFeeReceive,
  ];

  // 2. Create LUT
  const lookupTable = await createAddressLookupTable(connection, payer, addresses);
  
  // 3. Wait for LUT activation (must wait at least 1 slot)
  await sleep(1000);
  
  return lookupTable;
}


// Init command handler
export async function initCommand(options: any) {
  const rpcUrl = options.rpc;
  const rpc = new Connection(rpcUrl, 'confirmed');

  // Use keypair from command line argument
  if (!options.keypairBase58) {
    console.error('Missing --keypair-base58 parameter');
    return;
  }
  const systemManager = loadKeypairFromBase58(options.keypairBase58);
  const wallet = {
    publicKey: systemManager.publicKey,
    signTransaction: async (tx: Transaction) => {
      tx.sign(systemManager);
      return tx;
    },
    signAllTransactions: async (txs: Transaction[]) => {
      txs.forEach(tx => tx.sign(systemManager));
      return txs;
    }
  };
  const provider = new AnchorProvider(rpc, wallet as anchor.Wallet, {
    commitment: 'confirmed',
  });
  
  const program = new Program(idl, provider) as Program<FairMintToken>;

  let lookupTableAddress: PublicKey;
  try {
    lookupTableAddress = new PublicKey(LOOKUP_TABLE_ACCOUNT || '');
    const accountInfo = await provider.connection.getParsedAccountInfo(lookupTableAddress);
    if (!accountInfo.value) {
      console.log('LUT account does not exist, creating new LUT...');
      const lut = await createLookupTable(provider.connection, systemManager);
      lookupTableAddress = lut.key;
      console.log('New LUT address:', lookupTableAddress.toBase58());
      console.log('Please update LOOKUP_TABLE_ACCOUNT in config with this address, and reload the script');
      process.exit(0);
    } else {
      console.log('LUT already exists:', lookupTableAddress.toBase58());
    }
  } catch (error) {
    console.log('Invalid LUT address, creating new LUT...');
    const lut = await createLookupTable(provider.connection, systemManager);
    lookupTableAddress = lut.key;
    console.log('New LUT address:', lookupTableAddress.toBase58());
    console.log('Please update LOOKUP_TABLE_ACCOUNT in config with this address, and reload the script');
    process.exit(0);
  }

  // 计算 system config PDA
  const [systemConfigAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from(SYSTEM_CONFIG_SEEDS), SYSTEM_MANAGER_ACCOUNT.toBuffer()],
    program.programId
  );
  console.log("systemConfigAccount", systemConfigAccount.toBase58());
  // 检查 system config 是否存在
  if (await checkAccountExists(rpc, systemConfigAccount)) {
    console.log('System config already exists.');
    const infoData = await program.account.systemConfigData.fetch(systemConfigAccount);
    console.log("System config data", Object.fromEntries(
      Object.entries(infoData).map(([key, value]) => [key, value.toString()])
    ));
    return;
  }

  const context = {
    admin: systemManager.publicKey,
    systemConfigAccount: systemConfigAccount,
    systemProgram: SystemProgram.programId,
  };

  console.log("program id", program.programId.toBase58());
  const tx = await program.methods
    .initializeSystem()
    .accounts(context)
    .signers([systemManager])
    .rpc();

  await provider.connection.confirmTransaction(tx, "confirmed");
  console.log('System config initialized successfully. Transaction:', tx);
  console.log('System config account:', systemConfigAccount.toBase58());
}