import { getSystemConfig } from '@flipflop-sdk/node';

interface SystemConfigOptions {
  rpc: string;
}

// Display mint command handler
export async function systemConfigCommand(options: SystemConfigOptions) {
  try {
    const systemConfigAccountInfo = await getSystemConfig({ rpc: options.rpc });

    // Display formatted token information
    console.log('\n📊 Flipflop system configs:');
    console.log('━'.repeat(50));
    console.log(`👤 System Admin:              ${systemConfigAccountInfo.admin.toBase58()}`);
    console.log(`🔑 System Config Account:     ${systemConfigAccountInfo.systemConfigAccount.toBase58()}`);
    console.log(`🔑 Launch Rule Account:       ${systemConfigAccountInfo.launchRuleAccount.toBase58()}`);
    console.log(`🏦 Protocol Fee Account:      ${systemConfigAccountInfo.protocolFeeAccount.toBase58()}`);
    console.log(`🔢 Token Count:               ${systemConfigAccountInfo.count.toString()}`);
    console.log(`🎯 Referral Usage Max Count:  ${systemConfigAccountInfo.referralUsageMaxCount}`);
    // console.log(`💰 Protocol Fee Rate:         ${(systemConfigAccountInfo.protocolFeeRate * 100).toFixed(2)}%`);
    console.log(`💸 Refund Fee Rate:           ${(systemConfigAccountInfo.refundFeeRate * 100).toFixed(2)}%`);
    console.log(`⏰ Referrer Reset Interval:   ${systemConfigAccountInfo.referrerResetIntervalSeconds.toString()} seconds`);
    console.log(`🏷️  Update Metadata Fee:       ${(systemConfigAccountInfo.updateMetadataFee).toFixed(2)} SOL`);
    console.log(`🚀 Customized Deploy Fee:     ${(systemConfigAccountInfo.customizedDeployFee).toFixed(2)} SOL`);
    console.log(`💧 Init Pool WSOL Percent:    ${(systemConfigAccountInfo.initPoolWsolAmount * 100).toFixed(2)}%`);
    console.log(`🎓 Graduate Fee Rate:         ${systemConfigAccountInfo.graduateFeeRate.toFixed(2)}%`);
    console.log(`💎 Min Graduate Fee:          ${(systemConfigAccountInfo.minGraduateFee).toFixed(2)} SOL`);
    console.log(`🌊 Raydium CPMM Create Fee:   ${(systemConfigAccountInfo.raydiumCpmmCreateFee).toFixed(2)} SOL`);
    // console.log(`📊 Transfer Fee Basis Points: ${systemConfigAccountInfo.transferFeeBasisPoints}`);
    console.log(`⏸️  Is Paused:                ${systemConfigAccountInfo.isPause ? '✅ Yes' : '❌ No'}`);
    console.log('━'.repeat(50));
  } catch (error) {
    console.error('❌ Error displaying system config information:', error instanceof Error ? error.message : 'Unknown error');
  }
}