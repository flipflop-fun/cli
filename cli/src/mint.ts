import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, web3, Wallet } from '@coral-xyz/anchor';
import { FairMintToken } from './types/fair_mint_token';
import idl from './idl/fair_mint_token.json';
import { LOOKUP_TABLE_ACCOUNT, SYSTEM_MANAGER_ACCOUNT } from './config';
import { CONFIG_DATA_SEED, REFERRAL_SEED, SYSTEM_CONFIG_SEEDS, REFERRAL_CODE_SEED } from './constants';
import { cleanTokenName, getMetadataByMint, getURCDetails, loadKeypairFromBase58, mintBy, parseConfigData } from './utils';

interface MintOptions {
  rpc: string;
  keypairBs58: string;
  mint: string;
  urc: string;
}

export async function mintCommand(options: MintOptions) {
  try {
    // Implementation will go here
    const rpc = new Connection(options.rpc || 'http://127.0.0.1:8899');
    const urc = options.urc;
    const mintAccount = new PublicKey(options.mint);

    // Validate required parameters
    if (!options.keypairBs58) {
      console.error('Missing --keypair-bs58 parameter');
      return;
    }
    
    if (!mintAccount) {
      console.error('Missing --mint parameter');
      return;
    }

    if (!urc) {
      console.error('Missing --urc parameter');
      return;
    }
    
    // Load keypair and create wallet
    const minter = loadKeypairFromBase58(options.keypairBs58);
    const wallet = {
      publicKey: minter.publicKey,
      signTransaction: async (tx: Transaction) => {
        tx.sign(minter);
        return tx;
      },
      signAllTransactions: async (txs: Transaction[]) => {
        txs.forEach(tx => tx.sign(minter));
        return txs;
      }
    };

    const provider = new AnchorProvider(rpc, wallet as Wallet, {
      commitment: 'confirmed',
    });

    const program = new Program(idl, provider) as Program<FairMintToken>;

    const referrerAccount = await getURCDetails(rpc, program, urc);
    const [referralAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from(REFERRAL_SEED), mintAccount.toBuffer(), referrerAccount.referrerMain.toBuffer()],
      program.programId,
    );

    const [systemConfigAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from(SYSTEM_CONFIG_SEEDS), SYSTEM_MANAGER_ACCOUNT.toBuffer()],
      program.programId
    );

    const systemConfigData = await program.account.systemConfigData.fetch(systemConfigAccount);
    const protocolFeeAccount = systemConfigData.protocolFeeAccount;

    const [configAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from(CONFIG_DATA_SEED), mintAccount.toBuffer()],
      program.programId,
    );

    const [codeHash] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from(REFERRAL_CODE_SEED), Buffer.from(urc)],
      program.programId,
    );

    const metadataData = await getMetadataByMint(rpc, mintAccount);
    if (!metadataData.success) {
      console.error("Get metadata failed", metadataData.message);
      return;
    }
    const _name = cleanTokenName(metadataData.data.name);
    const _symbol = cleanTokenName(metadataData.data.symbol);
    const configData = await parseConfigData(program, configAccount);

    const result = await mintBy(
      provider,
      program,
      mintAccount,
      configAccount,
      referralAccount,
      referrerAccount.referrerMain, // referrer
      {name: _name, symbol: _symbol},
      codeHash,
      minter, // minter
      systemConfigAccount,
      provider.connection,
      LOOKUP_TABLE_ACCOUNT,
      protocolFeeAccount
    );
    if(!result?.success) {
      console.error("Mint failed");
      return;
    }
    console.log("Mint success");
    console.log("URC Details", Object.fromEntries(
      Object.entries(result).map(([key, value]) => [key, value?.toString()])
    ));
  } catch (error) {
    console.error('Error in mint command:', error);
    process.exit(1);
  }
}
