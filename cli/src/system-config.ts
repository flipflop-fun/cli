import { Connection, PublicKey } from '@solana/web3.js';
import { initProviderNoSigner, parseConfigData } from './utils';
import { SYSTEM_CONFIG_SEEDS } from './constants';
import { CONFIGS, getNetworkType } from './config';

interface SystemConfigOptions {
  rpc: string;
}
// Display mint command handler
export async function systemConfigCommand(options: SystemConfigOptions) {
  const rpcUrl = options.rpc;
  const rpc = new Connection(rpcUrl, 'confirmed');
  const config = CONFIGS[getNetworkType(options.rpc)];
  const { program, programId } = await initProviderNoSigner(rpc);

  try {
    const [systemConfigAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from(SYSTEM_CONFIG_SEEDS), new PublicKey(config.systemManagerAccount).toBuffer()],
      programId
    );
    const systemConfigAccountInfo = await program.account.systemConfigData.fetch(systemConfigAccount);
    if (!systemConfigAccountInfo) {
      console.error('❌ Failed to get system config account data');
      return;
    }

    // Display formatted token information
    console.log('\n📊 Flipflop system configs:');
    console.log('━'.repeat(50));
    console.log(`📋 System config account:     ${systemConfigAccount.toBase58()}`);
    console.log(`👤 System Admin:              ${systemConfigAccountInfo.admin.toBase58()}`);
    console.log(`🔢 Token Count:               ${systemConfigAccountInfo.count.toString()}`);
    console.log(`🎯 Referral Usage Max Count:  ${systemConfigAccountInfo.referralUsageMaxCount}`);
    // console.log(`💰 Protocol Fee Rate:         ${(systemConfigAccountInfo.protocolFeeRate * 100).toFixed(2)}%`);
    console.log(`🏦 Protocol Fee Account:      ${systemConfigAccountInfo.protocolFeeAccount.toBase58()}`);
    console.log(`💸 Refund Fee Rate:           ${(systemConfigAccountInfo.refundFeeRate * 100).toFixed(2)}%`);
    console.log(`⏰ Referrer Reset Interval:   ${systemConfigAccountInfo.referrerResetIntervalSeconds.toString()} seconds`);
    console.log(`🏷️  Update Metadata Fee:       ${(systemConfigAccountInfo.updateMetadataFee.toNumber() / 1e9).toFixed(2)} SOL`);
    console.log(`🚀 Customized Deploy Fee:     ${(systemConfigAccountInfo.customizedDeployFee.toNumber() / 1e9).toFixed(2)} SOL`);
    console.log(`💧 Init Pool WSOL Percent:    ${(systemConfigAccountInfo.initPoolWsolAmount.toNumber() / 1000).toFixed(2)}%`);
    console.log(`🎓 Graduate Fee Rate:         ${systemConfigAccountInfo.graduateFeeRate.toNumber().toFixed(2)}%`);
    console.log(`💎 Min Graduate Fee:          ${(systemConfigAccountInfo.minGraduateFee.toNumber() / 1e9).toFixed(2)} SOL`);
    console.log(`🌊 Raydium CPMM Create Fee:   ${(systemConfigAccountInfo.raydiumCpmmCreateFee.toNumber() / 1e9).toFixed(2)} SOL`);
    // console.log(`📊 Transfer Fee Basis Points: ${systemConfigAccountInfo.transferFeeBasisPoints}`);
    console.log(`⏸️  Is Paused:                ${systemConfigAccountInfo.isPause ? '✅ Yes' : '❌ No'}`);
    console.log('━'.repeat(50));
  } catch (error) {
    console.error('❌ Error displaying system config information:', error instanceof Error ? error.message : 'Unknown error');
  }
}