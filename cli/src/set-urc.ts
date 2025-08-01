import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Program, AnchorProvider, web3, Wallet } from '@coral-xyz/anchor';
import { FairMintToken } from './types/fair_mint_token';
import idl from './idl/fair_mint_token.json';
import { getNetworkType, SYSTEM_MANAGER_ACCOUNT } from './config';
import { cleanTokenName, getMetadataByMint, loadKeypairFromBase58 } from './utils';
import { CODE_ACCOUNT_SEED, CONFIG_DATA_SEED, REFERRAL_CODE_SEED, REFERRAL_SEED, SYSTEM_CONFIG_SEEDS } from './constants';
import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';

export async function setUrcCommand(options: any) {
  const rpcUrl = options.rpc;
  const rpc = new Connection(rpcUrl, 'confirmed');
  const urc = options.urc;
  const mintAccount = new PublicKey(options.mint);

  // Validate required parameters
  if (!options.keypairBs58) {
    console.error('Missing --keypair-bs58 parameter');
    return;
  }

  // Load keypair and create wallet
  const refAccount = loadKeypairFromBase58(options.keypairBs58);
  const wallet = {
    publicKey: refAccount.publicKey,
    signTransaction: async (tx: Transaction) => {
      tx.sign(refAccount);
      return tx;
    },
    signAllTransactions: async (txs: Transaction[]) => {
      txs.forEach(tx => tx.sign(refAccount));
      return txs;
    }
  };

  const provider = new AnchorProvider(rpc, wallet as Wallet, {
    commitment: 'confirmed',
  });

  const program = new Program(idl, provider) as Program<FairMintToken>;

  console.log('Network:', getNetworkType(rpcUrl));
  console.log('Referrer:', refAccount.publicKey.toBase58());
  console.log('Program ID:', program.programId.toBase58());

  const [referralAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from(REFERRAL_SEED), mintAccount.toBuffer(), refAccount.publicKey.toBuffer()],
    program.programId,
  );

  const [systemConfigAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from(SYSTEM_CONFIG_SEEDS), SYSTEM_MANAGER_ACCOUNT.toBuffer()],
    program.programId
  );

  const [codeHash] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from(REFERRAL_CODE_SEED), Buffer.from(urc)],
    program.programId,
  );

  const [codeAccount] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from(CODE_ACCOUNT_SEED), codeHash.toBuffer()],
    program.programId,
  );

  const [configAccount] = PublicKey.findProgramAddressSync(
    [Buffer.from(CONFIG_DATA_SEED), mintAccount.toBuffer()],
    program.programId,
  );

  const codeAccountInfo = await provider.connection.getAccountInfo(codeAccount);
  if(codeAccountInfo) {
    const codeAccountData = await program.account.codeAccountData.fetch(codeAccount);
    if (codeAccountData.referralAccount.toBase58() !== referralAccount.toBase58()) {
      console.log("The codeAccount is not for this referralAccount, codeAccount: ", codeAccount.toBase58(), "referralAccount: ", referralAccount.toBase58());
      return;
    }
  }

  const referrerAta = await getAssociatedTokenAddress(mintAccount, refAccount.publicKey, false, TOKEN_PROGRAM_ID);
  const referrerAtaInfo = await provider.connection.getAccountInfo(referrerAta);

  const context = {
    mint: mintAccount,
    referralAccount: referralAccount,
    configAccount,
    systemConfigAccount: systemConfigAccount,
    payer: refAccount.publicKey,
    referrerAta: referrerAta,
    codeAccount: codeAccount,
    systemProgram: web3.SystemProgram.programId,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  };
  // console.log("Set referrer accounts", Object.fromEntries(
  //   Object.entries(context).map(([key, value]) => [key, value.toString()])
  // ));

  const tokenMetadata = await getMetadataByMint(rpc, mintAccount);
  if (!tokenMetadata.success) {
    console.error("Get token metadata failed", tokenMetadata.message);
    return;
  }
  const _name = cleanTokenName(tokenMetadata.data.name);
  const _symbol = cleanTokenName(tokenMetadata.data.symbol);
  const instructionSetReferrerCode = await program.methods
    .setReferrerCode(_name, _symbol, codeHash.toBuffer())
    .accounts(context)
    .instruction();
  try {

  const transaction = new web3.Transaction();
  if(!referrerAtaInfo) {
      transaction.add(createAssociatedTokenAccountInstruction(
        refAccount.publicKey,
        referrerAta,
        refAccount.publicKey,
        mintAccount,
        TOKEN_PROGRAM_ID
      ));
    }
    transaction.add(instructionSetReferrerCode);
    const tx = await provider.sendAndConfirm(transaction, [refAccount]);
    console.log("Set referrer code success, tx: ", tx);
  } catch (e) {
    console.error("Set referrer code failed", e);
  }

  const data = await program.account.tokenReferralData.fetch(referralAccount);
  console.table({
    referrerAta: data.referrerAta.toBase58(),
    referrerMain: refAccount.publicKey.toBase58(),
    codeHash: data.codeHash.toBase58(),
    usageCount: data.usageCount,
    activeTimestamp: data.activeTimestamp.toString(),
  });

  if (data.codeHash.toBase58() !== codeHash.toBase58()) {
    console.error("Front end and chain codeHash not equal");
  }

  const codeAccountData = await program.account.codeAccountData.fetch(codeAccount);
  console.log("codeAccountData", codeAccountData.referralAccount.toBase58());
  if (codeAccountData.referralAccount.toBase58() !== referralAccount.toBase58()) {
    console.error("Front end and chain codeAccountData.referralAccount not equal");
  }
}

