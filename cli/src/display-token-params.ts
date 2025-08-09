import { BN } from '@coral-xyz/anchor';
import { displayTokenParams, TokenParams } from '@flipflop-sdk/node';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const displayTokenParamsCommand = async (options: {
  rpc: string;
  tokenType: "meme" | "standard";
}) => {
  const { rpc, tokenType } = options;
  
  try {
    const result = displayTokenParams({
      rpc,
      tokenType,
    }) as TokenParams;
    
    // Display formatted token parameters
    console.log('\n🎯 Token Parameters');
    console.log('━'.repeat(50));
    console.log(`Token Type: ${tokenType.toUpperCase()}`);
    console.log('');
    // Iterate through all properties of the result object
    console.log(`Target Eras:                             ${result.targetEras}`);
    console.log(`Fee Rate:                                ${result.feeRate.toNumber() / 1e9} SOL`);
    console.log(`Max Checkpoints per Milestone:           ${result.epochesPerEra}`);
    console.log(`Target Seconds per Checkpoint:           ${result.targetSecondsPerEpoch}`);
    console.log(`Reduce Ratio:                            ${100 - result.reduceRatio.toNumber()}%`);
    console.log(`Initial Mint Size:                       ${new BN(result.initialMintSize).div(new BN("1000000000")).toNumber()}`);
    console.log(`Initial Target Mint Size Per Checkpoint: ${new BN(result.initialTargetMintSizePerEpoch).div(new BN("1000000000")).toNumber()}`);
    console.log(`Liquidity Tokens Ratio:                  ${result.liquidityTokensRatio}`);
    
    console.log('\n✅ Token parameters displayed successfully');
    
  } catch (error) {
    console.error('❌ Error displaying token parameters:', error instanceof Error ? error.message : 'Unknown error');
  }
};