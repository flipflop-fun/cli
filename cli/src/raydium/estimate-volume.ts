import { BN } from '@coral-xyz/anchor';
import { estimateVolume } from '@flipflop-sdk/node';
import { ApiResponse, EstimateVolumeOptions, EstimateVolumeResponse } from '@flipflop-sdk/node/dist/raydium/types';
import { NATIVE_MINT } from '@solana/spl-token';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

export const estimateVolumeCommand = async (options: {
  rpc: string;
  mint: string;
  maxSlippage: string;
  action: 'buy' | 'sell';
}) => {
  const { rpc, mint, maxSlippage, action } = options;
  
  try {
    const result = await estimateVolume({
      rpc,
      tokenAMint: new PublicKey(mint),
      tokenBMint: NATIVE_MINT,
      maxSlippage: parseFloat(maxSlippage), // 0-100
      action,
    } as EstimateVolumeOptions) as ApiResponse<EstimateVolumeResponse>;

    if (!result.success || !result.data) {
      console.error('❌ Error: ', result.message);
      return;
    }

    // Display formatted volume estimation results
    console.log('\n📊 Volume Estimation Results');
    console.log('━'.repeat(50));
    
    // Basic information
    console.log(`Action Type:                             ${result.data.action || action}`);
    console.log(`Current Price:                           ${result.data.currentPrice}`);
    console.log(`Actual Slippage:                         ${(result.data.maxSlippage).toFixed(4)}%`);
    console.log(`Token Amount:                            ${result.data.tokenAAmount.div(new BN(LAMPORTS_PER_SOL)).toNumber()}`);
    
    // Reserve information
    console.log('\n📈 Pool Reserves');
    console.log('━'.repeat(30));
    console.log(`Base Reserve:                            ${(result.data.baseReserve.toNumber() / LAMPORTS_PER_SOL)} SOL`);
    console.log(`Quote Reserve:                           ${result.data.quoteReserve.div(new BN(LAMPORTS_PER_SOL)).toNumber()} Tokens`);
    // console.log(`Constant Product (k):                   ${result.data.k.toString()}`);
    
    // Optional fields
    if (result.data.requiredAmount) {
      const actionText = result.data.action === 'buy' ? 'Required SOL' : 'Expected Receive SOL';
      console.log(`\n💰 ${actionText}`);
      console.log('━'.repeat(30));
      console.log(`Amount:                                  ${result.data.requiredAmount.toNumber() / LAMPORTS_PER_SOL} SOL`);
    }
    
    if (result.data.actualPrice) {
      console.log('\n💱 Actual Trading Price');
      console.log('━'.repeat(30));
      console.log(`Price:                                   ${result.data.actualPrice}`);
      
      // Calculate price impact
      const priceImpact = ((result.data.actualPrice - result.data.currentPrice) / result.data.currentPrice) * 100;
      console.log(`Price Impact:                            ${Math.abs(priceImpact).toFixed(4)}%`);
    }
    
    console.log('\n✅ Volume estimation completed successfully');
    
  } catch (error) {
    console.error('❌ Error: ', error instanceof Error ? error.message : 'Unknown error');
  }
};