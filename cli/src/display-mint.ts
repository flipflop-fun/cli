import { getMintData, GetMintDataOptions } from '@flipflop-sdk/node';
import { PublicKey } from '@solana/web3.js';

// Display mint command handler
export async function displayMintCommand(options: any) {
  const rpcUrl = options.rpc;
  const mintAccount = new PublicKey(options.mint);

  try {
    // Get token metadata
    const options: GetMintDataOptions = {
      rpc: rpcUrl,
      mint: mintAccount,
    }
    const mintData = await getMintData(options);
    if (!mintData.success || !mintData.data) {
      console.log(mintData.message);
      return;
    }

    // Display formatted token information
    console.log('\n📊 Token Information');
    console.log('━'.repeat(50));

    console.log(`Mint Address: ${mintData.data.mint.toBase58()}`);
    console.log(`Name: ${mintData.data.name}`);
    console.log(`Symbol: ${mintData.data.symbol}`);
    console.log(`Metadata URI: ${mintData.data.uri}`);
    console.log(`Metadata Mutable: ${mintData.data.isMutable ? 'Yes' : 'No'}`);

    console.log('\n⚙️  Configuration Details');
    console.log('━'.repeat(50));
    console.log(`Config Account: ${mintData.data.configAccount.toBase58()}`);
    console.log(`Admin: ${mintData.data.admin.toBase58()}`);
    console.log(`Token Vault: ${mintData.data.tokenVault.toBase58()}`);
    console.log(`WSOL Vault: ${mintData.data.wsolVault.toBase58()}`);
    console.log('');
    console.log(`Fee Rate: ${(mintData.data.feeRate * 1).toFixed(2)} SOL`);
    console.log(`Target Eras: ${mintData.data.targetEras}`);
    console.log(`Initial Mint Size: ${mintData.data.initialMintSize.toLocaleString()}`);
    console.log(`Initial Target Mint Size per Epoch: ${mintData.data.initialTargetMintSizePerEpoch.toLocaleString()}`);
    console.log(`Target Mint Size per Epoch: ${mintData.data.targetMintSizeEpoch.toLocaleString()}`);
    console.log(`Checkpoints per Milestone: ${mintData.data.epochesPerEra}`);
    console.log(`Target Seconds per Checkpoint: ${mintData.data.targetSecondsPerEpoch.toLocaleString()}`);
    console.log(`Reduce Ratio per Milestone: ${100 - mintData.data.reduceRatio * 100}%`);
    console.log(`Max Supply: ${mintData.data.maxSupply.toLocaleString()}`);
    console.log(`Liquidity Tokens Ratio: ${mintData.data.liquidityTokensRatio}%`);
    
    console.log('\n📈 Mining Status');
    console.log('━'.repeat(50));
    console.log(`Current Supply: ${mintData.data.supply.toLocaleString()}`);
    console.log(`Liquidity Tokens Supply: `, (mintData.data.supply * mintData.data.liquidityTokensRatio / 100).toLocaleString());
    console.log(`Minter's Tokens Supply: `, (mintData.data.supply * (1 - mintData.data.liquidityTokensRatio / 100)).toLocaleString());
    console.log(`WSOL Vault Balance: `, mintData.data.wsolVaultBalance.toLocaleString() + " WSOL");
    console.log('');
    console.log(`Current Era: ${mintData.data.currentEra}`);
    console.log(`Current Epoch: ${mintData.data.currentEpoch}`);
    console.log(`Start Time of Current Checkpoint: ${new Date(mintData.data.startTimestampEpoch * 1000).toLocaleString()}`);
    console.log(`Last Difficulty Coefficient: ${mintData.data.lastDifficultyCoefficient}`);
    console.log(`Current Difficulty Coefficient: ${mintData.data.difficultyCoefficient}`);
    console.log(`Mint Size (Current Epoch): ${mintData.data.mintSizeEpoch.toLocaleString()}`);
    console.log(`Minted (Current Epoch): ${mintData.data.quantityMintedEpoch.toLocaleString()}`);
    console.log(`Target Mint Size (Epoch): ${mintData.data.targetMintSizeEpoch.toLocaleString()}`);
    
    const progress = (mintData.data.supply / mintData.data.maxSupply * 100).toFixed(2);
    console.log(`\n📊 Overall Progress: ${progress}% (${mintData.data.supply.toLocaleString()}/${mintData.data.maxSupply.toLocaleString()})`);
    
  } catch (error) {
    console.error('❌ Error displaying mint information:', error instanceof Error ? error.message : 'Unknown error');
  }
}