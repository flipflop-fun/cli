import { getUrcData } from '@flipflop-sdk/node';

// Display URC command handler
export async function displayUrcCommand(options: any) {
  const rpcUrl = options.rpc;
  const urc = options.urc;

  try {
    const urcDetails = await getUrcData({
      rpc: rpcUrl,
      urc,
    });

    if (!urcDetails.success || !urcDetails.data) {
      console.log(urcDetails.message);
      return;
    }

    // Display formatted URC information
    console.log('\n🔗 URC (User Referral Code) Details');
    console.log('━'.repeat(50));
    
    console.log(`URC Code: ${urc}`);
    console.log(`Code Hash: ${urcDetails.data.codeHash}`);
    console.log(`Mint address: ${urcDetails.data.mint}`);
    
    console.log('\n👤 Referrer Information');
    console.log('━'.repeat(50));
    console.log(`Referrer Address: ${urcDetails.data.referrerMain}`);
    console.log(`Referrer Token Account: ${urcDetails.data.referrerAta}`);
    
    console.log('\n📊 Usage Statistics');
    console.log('━'.repeat(50));
    console.log(`Usage Count: ${urcDetails.data.usageCount}`);
    
    // Format and display activation timestamp
    const activationDate = new Date(parseInt(urcDetails.data.activeTimestamp.toString()) * 1000);
    console.log(`Activated: ${activationDate.toLocaleString()}`);
    
    console.log('\n✅ URC is valid and ready for use');
    
  } catch (error) {
    console.error('❌ Error displaying URC details:', error instanceof Error ? error.message : 'Unknown error');
  }
}