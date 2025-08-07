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

    // Display formatted token information
    console.log('\n📊 Token Information');
    console.log('━'.repeat(50));

    console.log(`Mint Address: ${mintData.mint.toBase58()}`);
    console.log(`Name: ${mintData.name}`);
    console.log(`Symbol: ${mintData.symbol}`);
    console.log(`Metadata URI: ${mintData.uri}`);
    console.log(`Metadata Mutable: ${mintData.isMutable ? 'Yes' : 'No'}`);

    console.log('\n⚙️  Configuration Details');
    console.log('━'.repeat(50));
    console.log(`Config Account: ${mintData.configAccount.toBase58()}`);
    console.log(`Admin: ${mintData.admin.toBase58()}`);
    console.log(`Token Vault: ${mintData.tokenVault.toBase58()}`);
    console.log(`WSOL Vault: ${mintData.wsolVault.toBase58()}`);
    console.log('');
    console.log(`Fee Rate: ${(mintData.feeRate * 1).toFixed(2)} SOL`);
    console.log(`Target Eras: ${mintData.targetEras}`);
    console.log(`Initial Mint Size: ${mintData.initialMintSize.toLocaleString()}`);
    console.log(`Target Mint Size per Epoch: ${mintData.targetMintSizeEpoch.toLocaleString()}`);
    console.log(`Checkpoints per Milestone: ${mintData.epochesPerEra}`);
    console.log(`Target Seconds per Checkpoint: ${mintData.targetSecondsPerEpoch.toLocaleString()}`);
    console.log(`Reduce Ratio per Milestone: ${100 - mintData.reduceRatio * 100}%`);
    console.log(`Max Supply: ${mintData.maxSupply.toLocaleString()}`);
    console.log(`liquidity Tokens Ratio: ${mintData.liquidityTokensRatio}%`);
    
    console.log('\n📈 Mining Status');
    console.log('━'.repeat(50));
    console.log(`Current Supply: ${mintData.supply.toLocaleString()}`);
    console.log(`Liquidity Tokens Supply: `, (mintData.supply * mintData.liquidityTokensRatio / 100).toLocaleString());
    console.log(`Minter's Tokens Supply: `, (mintData.supply * (1 - mintData.liquidityTokensRatio / 100)).toLocaleString());
    console.log(`WSOL Vault Balance: `, mintData.wsolVaultBalance.toLocaleString() + " WSOL");
    console.log('')
    console.log(`Current Era: ${mintData.currentEra}`);
    console.log(`Current Epoch: ${mintData.currentEpoch}`);
    console.log(`Start Time of Current Checkpoint: ${new Date(mintData.startTimestampEpoch * 1000).toLocaleString()}`);
    console.log(`Last Difficulty Coefficient: ${mintData.lastDifficultyCoefficient}`);
    console.log(`Current Difficulty Coefficient: ${mintData.difficultyCoefficient}`);
    console.log(`Mint Size (Current Epoch): ${mintData.mintSizeEpoch.toLocaleString()}`);
    console.log(`Minted (Current Epoch): ${mintData.quantityMintedEpoch.toLocaleString()}`);
    console.log(`Target Mint Size (Epoch): ${mintData.targetMintSizeEpoch.toLocaleString()}`);
    
    const progress = (mintData.supply / mintData.maxSupply * 100).toFixed(2);
    console.log(`\n📊 Overall Progress: ${progress}% (${mintData.supply.toLocaleString()}/${mintData.maxSupply.toLocaleString()})`);
    
  } catch (error) {
    console.error('❌ Error displaying mint information:', error instanceof Error ? error.message : 'Unknown error');
  }
}