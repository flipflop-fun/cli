import { loadKeypairFromBase58, loadKeypairFromFile } from './utils';
import { initializeSystemConfigAccount } from '@flipflop-sdk/node';

interface InitSystemConfigOptions {
  rpc: string;
  keypairBs58: string;
  keypairFile: string;
}

// Init command handler
export async function initCommand(options: InitSystemConfigOptions) {
  const rpcUrl = options.rpc;

  // Use keypair from command line argument
  if (!options.keypairBs58 && !options.keypairFile) {
    console.error('❌ Error: Missing --keypair-bs58 or --keypair-file parameter');
    console.log('💡 Usage: flipflop init --keypair-bs58 <your_bs58_keypair>');
    return;
  }
  
  const systemManager = options.keypairFile
      ? loadKeypairFromFile(options.keypairFile)
      : loadKeypairFromBase58(options.keypairBs58!);

  // await provider.connection.confirmTransaction(tx, "confirmed");
  const result = await initializeSystemConfigAccount({
    rpc: rpcUrl,
    systemManager,
  })
  if (!result.success) {
    console.log('❌ Error: System initialization failed');
    return;
  }
  console.log('\n🎉 System Initialization Completed Successfully!');
  console.log('=' .repeat(50));
  console.log(`📍 System Config Account: ${result.systemConfigAddress.toBase58()}`);
  console.log(`👤 System Manager: ${result.systemManager.toBase58()}`);
  console.log(`📍 Lookup Table Address: ${result.lookupTableAddress.toBase58()}`);
  console.log('\n✨ Your FlipFlop system is now ready for token operations!');
}