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
    if (!result.success) {
      console.error('❌ Error creating metadata:', result.error);
      return;
    }
    console.log("Image URI:", result.imageUrl);
    console.log('Metadata URI:', result.metadataUrl);
  } catch (error) {
    console.error('❌ Error creating metadata:', error instanceof Error ? error.message : 'Unknown error');
  }
}
