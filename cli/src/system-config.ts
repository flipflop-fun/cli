import { getSystemConfig } from '@flipflop-sdk/node';

interface SystemConfigOptions {
  rpc: string;
}

// Display mint command handler
export async function systemConfigCommand(options: SystemConfigOptions) {
  try {
    const systemConfigAccountInfo = await getSystemConfig({ rpc: options.rpc });
    if (!systemConfigAccountInfo.success || !systemConfigAccountInfo.data) {
      console.log(systemConfigAccountInfo.message);
      return;
    }

    // Display formatted token information
    console.log('\n📊 Flipflop system configs:');
    console.log('━'.repeat(50));
    console.log(`👤 System Admin:              ${systemConfigAccountInfo.data.admin.toBase58()}`);
    console.log(`🔑 System Config Account:     ${systemConfigAccountInfo.data.systemConfigAccount.toBase58()}`);
    console.log(`🔑 Launch Rule Account:       ${systemConfigAccountInfo.data.launchRuleAccount.toBase58()}`);
    console.log(`🏦 Protocol Fee Account:      ${systemConfigAccountInfo.data.protocolFeeAccount.toBase58()}`);
    console.log(`🔢 Token Count:               ${systemConfigAccountInfo.data.count.toString()}`);
    console.log(`🎯 Referral Usage Max Count:  ${systemConfigAccountInfo.data.referralUsageMaxCount}`);
    // console.log(`💰 Protocol Fee Rate:         ${(systemConfigAccountInfo.data.protocolFeeRate * 100).toFixed(2)}%`);
    console.log(`💸 Refund Fee Rate:           ${(systemConfigAccountInfo.data.refundFeeRate * 100).toFixed(2)}%`);
    console.log(`⏰ Referrer Reset Interval:   ${systemConfigAccountInfo.data.referrerResetIntervalSeconds.toString()} seconds`);
    console.log(`🏷️  Update Metadata Fee:       ${(systemConfigAccountInfo.data.updateMetadataFee).toFixed(2)} SOL`);
    console.log(`🚀 Customized Deploy Fee:     ${(systemConfigAccountInfo.data.customizedDeployFee).toFixed(2)} SOL`);
    console.log(`💧 Init Pool WSOL Percent:    ${(systemConfigAccountInfo.data.initPoolWsolAmount * 100).toFixed(2)}%`);
    console.log(`🎓 Graduate Fee Rate:         ${(systemConfigAccountInfo.data.graduateFeeRate).toFixed(2)}%`);
    console.log(`💎 Min Graduate Fee:          ${(systemConfigAccountInfo.data.minGraduateFee).toFixed(2)} SOL`);
    console.log(`🌊 Raydium CPMM Create Fee:   ${(systemConfigAccountInfo.data.raydiumCpmmCreateFee).toFixed(2)} SOL`);
    // console.log(`📊 Transfer Fee Basis Points: ${systemConfigAccountInfo.transferFeeBasisPoints}`);
    console.log(`⏸️  Is Paused:                ${systemConfigAccountInfo.data.isPause ? '✅ Yes' : '❌ No'}`);
    console.log('━'.repeat(50));
  } catch (error) {
    console.error('❌ Error displaying system config information:', error instanceof Error ? error.message : 'Unknown error');
  }
}