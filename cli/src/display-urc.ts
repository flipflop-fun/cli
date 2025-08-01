import { Connection, PublicKey } from '@solana/web3.js';
import { getURCDetails } from './utils';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';
import idl from './idl/fair_mint_token.json';
import { FairMintToken } from './types/fair_mint_token';

// Display URC command handler
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

  try {
    const urcDetails = await getURCDetails(rpc, program, urc);
    
    if (!urcDetails) {
      console.error('❌ Failed to get URC details');
      return;
    }

    // Display formatted URC information
    console.log('\n🔗 URC (User Referral Code) Details');
    console.log('━'.repeat(50));
    
    console.log(`URC Code: ${urc}`);
    console.log(`Code Hash: ${urcDetails.codeHash}`);
    console.log(`Mint address: ${urcDetails.mint}`);
    
    console.log('\n👤 Referrer Information');
    console.log('━'.repeat(50));
    console.log(`Referrer Address: ${urcDetails.referrerMain}`);
    console.log(`Referrer Token Account: ${urcDetails.referrerAta}`);
    
    console.log('\n📊 Usage Statistics');
    console.log('━'.repeat(50));
    console.log(`Usage Count: ${urcDetails.usageCount}`);
    
    // Format and display activation timestamp
    const activationDate = new Date(parseInt(urcDetails.activeTimestamp.toString()) * 1000);
    console.log(`Activated: ${activationDate.toLocaleString()}`);
    
    console.log('\n✅ URC is valid and ready for use');
    
  } catch (error) {
    console.error('❌ Error displaying URC details:', error instanceof Error ? error.message : 'Unknown error');
  }
}