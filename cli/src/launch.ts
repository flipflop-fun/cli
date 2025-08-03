import { loadKeypairFromBase58, loadKeypairFromFile } from './utils';
import { launchToken, TokenType } from '@flipflop-sdk/node';

interface LaunchOptions {
  tokenType?: string;
  name: string;
  symbol: string;
  uri?: string;
  rpc?: string;
  keypairBs58?: string;
  keypairFile?: string;
}

// Launch token command handler
export async function launchCommand(options: LaunchOptions) {
  const uri = options.uri || `https://example.com/metadata/${options.symbol.toLowerCase()}.json`;

  if (!options.rpc) {
    console.error('❌ Error: Missing --rpc parameter');
    return;
  }
  // Validate required parameters
  if (!options.keypairBs58 && !options.keypairFile) {
    console.error('❌ Error: Missing --keypair-bs58 or --keypair-file parameter');
    return;
  }

  if (!options.name || !options.symbol) {
    console.error('❌ Error: Missing --name or --symbol parameter');
    return;
  }

  if (!options.tokenType) {
    console.error('❌ Error: Missing --token-type parameter');
    return;
  }

  try {
    // Load keypair and create wallet (keypair-file takes priority)
    const creator = options.keypairFile 
      ? loadKeypairFromFile(options.keypairFile)
      : loadKeypairFromBase58(options.keypairBs58!);

    const result = await launchToken({
      rpc: options.rpc,
      name: options.name,
      symbol: options.symbol,
      tokenType: options.tokenType as TokenType,
      uri: uri,
      creator,
    })
    console.log('\n✅ Token Created Successfully!');
    console.log('━'.repeat(50));
    console.log(`Transaction Hash: ${result.transactionHash}`);
    console.log(`Mint Address: ${result.mintAddress.toBase58()}`);
    
    if (result.configuration) {
      console.log('\n⚙️  Token Configuration');
      console.log('━'.repeat(50));
      console.log(`Admin: ${result.configuration.admin}`);
      console.log(`Fee Rate: ${(result.configuration.feeRate * 1).toFixed(2)} SOL`);
      console.log(`Max Supply: ${result.configuration.maxSupply.toLocaleString()}`);
      console.log(`Initial Mint Size: ${result.configuration.initialMintSize.toLocaleString()}`);
      console.log(`Target Eras: ${result.configuration.targetEras}`);
      console.log(`Epochs Per Era: ${result.configuration.epochesPerEra}`);
      console.log(`Token Vault: ${result.configuration.tokenVault}`);
    }
    
  } catch (error) {
    console.error('❌ Error creating token:', error instanceof Error ? error.message : 'Unknown error');
  }
}
