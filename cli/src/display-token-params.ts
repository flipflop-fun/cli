import { BN } from '@coral-xyz/anchor';
import { displayTokenParams } from '@flipflop-sdk/node';

export const displayTokenParamsCommand = async (options: {
  rpc: string;
  tokenType: "meme" | "standard";
}) => {
  const { rpc, tokenType } = options;
  
  try {
    const result = displayTokenParams({
      rpc,
      tokenType,
    });

    if (!result.success || !result.data) {
      console.error('❌ Error: ', result.message);
      return;
    }

    // Display formatted token parameters
    console.log('\n🎯 Token Parameters');
    console.log('━'.repeat(50));
    console.log(`Token Type: ${tokenType.toUpperCase()}`);
    console.log('');
    // Iterate through all properties of the result object
    console.log(`Target Eras:                             ${result.data.targetEras}`);
    console.log(`Fee Rate:                                ${result.data.feeRate.toNumber() / 1e9} SOL`);
    console.log(`Max Checkpoints per Milestone:           ${result.data.epochesPerEra}`);
    console.log(`Target Seconds per Checkpoint:           ${result.data.targetSecondsPerEpoch}`);
    console.log(`Reduce Ratio:                            ${100 - result.data.reduceRatio.toNumber()}%`);
    console.log(`Initial Mint Size:                       ${new BN(result.data.initialMintSize).div(new BN("1000000000")).toNumber()}`);
    console.log(`Initial Target Mint Size Per Checkpoint: ${new BN(result.data.initialTargetMintSizePerEpoch).div(new BN("1000000000")).toNumber()}`);
    console.log(`Liquidity Tokens Ratio:                  ${result.data.liquidityTokensRatio}`);
    
    console.log('\n✅ Token parameters displayed successfully');
    
  } catch (error) {
    console.error('❌ Error: ', error instanceof Error ? error.message : 'Unknown error');
  }
};