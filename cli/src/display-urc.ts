import { getUrcData } from '@flipflop-sdk/node';

// Display URC command handler
export async function displayUrcCommand(options: any) {
  const rpcUrl = options.rpc;
  const urc = options.urc;

  try {
    const urcDetails = await getUrcData({
      rpc: rpcUrl,
      urc,
    })
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