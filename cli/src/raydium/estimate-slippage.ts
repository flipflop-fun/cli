import { BN } from '@coral-xyz/anchor';
import { estimateSlippage } from '@flipflop-sdk/node';
import { ApiResponse, EstimateSlippageOptions, EstimateSlippageResponse } from '@flipflop-sdk/node/dist/raydium/types';
import { NATIVE_MINT } from '@solana/spl-token';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

export const estimateSlippageCommand = async (options: {
  rpc: string;
  mint: string;
  amount: string;
  action: 'buy' | 'sell';
}) => {
  const { rpc, mint, amount, action } = options;
  
  try {
    const result = await estimateSlippage({
      rpc,
      tokenAMint: new PublicKey(mint),
      tokenBMint: NATIVE_MINT,
      tokenAAmount: parseFloat(amount),
      action,
    } as EstimateSlippageOptions) as ApiResponse<EstimateSlippageResponse>;

    if (!result.success || !result.data) {
      console.error('❌ Error: ', result.message);
      return;
    }

    // Display formatted slippage estimation results
    console.log('\n🎯 Slippage Estimation Results');
    console.log('━'.repeat(50));
    
    // Basic information
    console.log(`Action Type:                             ${result.data.action || action}`);
    console.log(`Current Price:                           ${result.data.currentPrice}`);
    console.log(`Token Amount:                          ${result.data.tokenAAmount.div(new BN(LAMPORTS_PER_SOL)).toNumber()}`);
    console.log(`Slippage:                                ${(result.data.slippage).toFixed(4)}%`);
    
    // Reserve information
    console.log('\n📊 Pool Reserves');
    console.log('━'.repeat(30));
    console.log(`Base Reserve:                            ${result.data.baseReserve.div(new BN(LAMPORTS_PER_SOL)).toNumber()} SOL`);
    console.log(`Quote Reserve:                           ${result.data.quoteReserve.div(new BN(LAMPORTS_PER_SOL)).toNumber()} Tokens`);
    // console.log(`Constant Product (k):                    ${result.data.k.div(new BN("1000000000000000000")).toNumber()}`);
    
    // Optional fields
    if (result.data.requiredAmount) {
      const actionText = result.data.action === 'buy' ? 'Required SOL' : 'Expected Receive SOL';
      console.log(`\n💰 ${actionText}`);
      console.log('━'.repeat(30));
      console.log(`Amount:                                  ${(result.data.requiredAmount.toNumber() / LAMPORTS_PER_SOL)} SOL`);
    }
    
    if (result.data.actualPrice) {
      console.log('\n💱 Actual Trading Price');
      console.log('━'.repeat(30));
      console.log(`Price:                                   ${result.data.actualPrice}`);
      
      // Calculate price impact
      const priceImpact = ((result.data.actualPrice - result.data.currentPrice) / result.data.currentPrice) * 100;
      console.log(`Price Impact:                            ${Math.abs(priceImpact).toFixed(4)}%`);
    }
    
    console.log('\n✅ Slippage estimation completed successfully');
    
  } catch (error) {
    console.error('❌ Error: ', error instanceof Error ? error.message : 'Unknown error');
  }
};