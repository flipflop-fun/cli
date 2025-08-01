import { Connection, PublicKey } from '@solana/web3.js';
import { PROGRAM_ID } from './config';
import { getMetadataByMint, parseConfigData } from './utils';
import { CONFIG_DATA_SEED } from './constants';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';
import idl from './idl/fair_mint_token.json';
import { FairMintToken } from './types/fair_mint_token';

// Display mint command handler
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

  try {
    // Get token metadata
    const metadataData = await getMetadataByMint(rpc, mintAccount);
    if (!metadataData.success) {
      console.error(`❌ Failed to get token metadata: ${metadataData.message}`);
      return;
    }

    // Get config account details
    const [configAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from(CONFIG_DATA_SEED), new PublicKey(mintAccount).toBuffer()],
      PROGRAM_ID,
    );

    const configAccountInfo = await parseConfigData(program, configAccount);
    if (!configAccountInfo) {
      console.error('❌ Failed to get config account data');
      return;
    }

    // Display formatted token information
    console.log('\n📊 Token Information');
    console.log('━'.repeat(50));
    
    // Clean and display metadata
    const cleanName = metadataData.data.name.replace(/\x00/g, '').trim();
    const cleanSymbol = metadataData.data.symbol.replace(/\x00/g, '').trim();
    const cleanUri = metadataData.data.uri.replace(/\x00/g, '').trim();
    
    console.log(`Name: ${cleanName}`);
    console.log(`Symbol: ${cleanSymbol}`);
    console.log(`Mint Address: ${metadataData.mint}`);
    console.log(`Metadata URI: ${cleanUri}`);
    console.log(`Mutable: ${metadataData.isMutable ? 'Yes' : 'No'}`);
    
    console.log('\n⚙️  Configuration Details');
    console.log('━'.repeat(50));
    console.log(`Config Account: ${configAccount.toBase58()}`);
    console.log(`Admin: ${configAccountInfo.admin}`);
    console.log(`Fee Rate: ${(configAccountInfo.feeRate * 100).toFixed(2)}%`);
    console.log(`Max Supply: ${configAccountInfo.maxSupply.toLocaleString()}`);
    console.log(`Current Supply: ${configAccountInfo.supply.toLocaleString()}`);
    console.log(`Token Vault: ${configAccountInfo.tokenVault}`);
    
    console.log('\n📈 Mining Status');
    console.log('━'.repeat(50));
    console.log(`Current Era: ${configAccountInfo.currentEra}`);
    console.log(`Current Epoch: ${configAccountInfo.currentEpoch}`);
    console.log(`Mint Size (Current Epoch): ${configAccountInfo.mintSizeEpoch.toLocaleString()}`);
    console.log(`Minted (Current Epoch): ${configAccountInfo.quantityMintedEpoch.toLocaleString()}`);
    console.log(`Target Mint Size (Epoch): ${configAccountInfo.targetMintSizeEpoch.toLocaleString()}`);
    console.log(`Difficulty Coefficient: ${configAccountInfo.difficultyCoefficient}`);
    
    const progress = (configAccountInfo.supply / configAccountInfo.maxSupply * 100).toFixed(2);
    console.log(`\n📊 Overall Progress: ${progress}% (${configAccountInfo.supply.toLocaleString()}/${configAccountInfo.maxSupply.toLocaleString()})`);
    
  } catch (error) {
    console.error('❌ Error displaying mint information:', error instanceof Error ? error.message : 'Unknown error');
  }
}