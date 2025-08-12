import { generateMetadataUri } from '@flipflop-sdk/node';

interface MetadataOptions {
  name: string;
  symbol: string;
  description: string;
  imagePath: string;
  rpc: string;
}

// Launch token command handler
export async function metadataCommand(options: MetadataOptions) {
  if (!options.rpc) {
    console.error('❌ Error: Missing --rpc parameter');
    return;
  }

  if (!options.imagePath) {
    console.error('❌ Error: Missing --image-path parameter');
    return;
  }

  if (!options.name || !options.symbol) {
    console.error('❌ Error: Missing --name and --symbol parameter');
    return;
  }

  try {
    const opt = {
      rpc: options.rpc,
      name: options.name,
      symbol: options.symbol,
      description: options.description,
      imagePath: options.imagePath,
    }
    const result = await generateMetadataUri(opt);
    if (!result.success || !result.data) {
      console.error('❌ Error: ', result.message);
      return;
    }
    console.log("Image URI:", result.data.imageUrl);
    console.log('Metadata URI:', result.data.metadataUrl);
  } catch (error) {
    console.error('❌ Error: ', error instanceof Error ? error.message : 'Unknown error');
  }
}
