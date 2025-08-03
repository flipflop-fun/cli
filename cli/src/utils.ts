import { Keypair } from '@solana/web3.js';
import fs from 'fs';
import bs58 from 'bs58';

// Load keypair from file (supports .pri or JSON format)
export const loadKeypairFromFile = (filePath: string): Keypair => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const secretKeyArray = JSON.parse(fileContent);
    
    if (!Array.isArray(secretKeyArray)) {
      throw new Error('Private key file must contain an array of numbers');
    }
    
    if (secretKeyArray.length !== 64) {
      throw new Error('Private key array must contain exactly 64 numbers');
    }
    
    const secretKey = new Uint8Array(secretKeyArray);
    return Keypair.fromSecretKey(secretKey);
  } catch (error: any) {
    throw new Error(`Failed to load keypair from file ${filePath}: ${error.message}`);
  }
};

// Utility to load single keypair from base58 string
export const loadKeypairFromBase58 = (base58Key: string): Keypair => {
  const secretKey = bs58.decode(base58Key.trim());
  return Keypair.fromSecretKey(secretKey);
}
