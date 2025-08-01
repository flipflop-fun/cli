import { PublicKey } from "@solana/web3.js";

export function getNetworkType(rpcUrl: string): 'local' | 'devnet' | 'mainnet' {
  if (rpcUrl.includes('localhost') || rpcUrl.includes('127.0.0.1')) return 'local';
  if (rpcUrl.includes('devnet')) return 'devnet';
  return 'mainnet';
}

export const DEFAULT_RPC = 'http://127.0.0.1:8899';
const network = getNetworkType(DEFAULT_RPC);

// Program IDs for different networks
const PROGRAM_IDS = {
  local: 'FLipzZfErPUtDQPj9YrC6wp4nRRiVxRkFm3jdFmiPHJV',
  devnet: '8GM2N7qQjzMyhqewu8jpDgzUh2BJbtBxSY1WzSFeFm6U',
  mainnet: 'FLipzZfErPUtDQPj9YrC6wp4nRRiVxRkFm3jdFmiPHJV'
};

export const PROGRAM_ID = new PublicKey(PROGRAM_IDS[network]);

const CONFIGS = {
  local: {
    lookupTableAccount: 'CkbTb7DXxR2Q1zoqZeTDWjfAzZKSzixHZdaVsbmFemSV',
    systemManagerAccount: 'DJ3jvpv6k7uhq8h9oVHZck6oY4dQqY1GHaLvCLjSqxaD',
    cpSwapProgram: 'CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C',
    cpSwapConfigAddress: 'D4FPEruKEHrG5TenZ2mpDGEfu1iUvTiqBxvpU8HLBvC2',
    createPoolFeeReceive: 'DNXgeM9EiiaAbaWvwjHj9fQQLAX5ZsfHyvmYUNRAdNC8'
  },
  devnet: {
    lookupTableAccount: 'DT77yCH3P5ShDA51h5foVux65bYYcg3XaYdYuBcPN8sG',
    systemManagerAccount: 'DJ3jvpv6k7uhq8h9oVHZck6oY4dQqY1GHaLvCLjSqxaD',
    cpSwapProgram: 'CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW',
    cpSwapConfigAddress: '9zSzfkYy6awexsHvmggeH36pfVUdDGyCcwmjT3AQPBj6',
    createPoolFeeReceive: 'G11FKBRaAkHAKuLCgLM6K6NUc9rTjPAznRCjZifrTQe2'
  },
  mainnet: {
    lookupTableAccount: 'DT77yCH3P5ShDA51h5foVux65bYYcg3XaYdYuBcPN8sG',
    systemManagerAccount: 'DJ3jvpv6k7uhq8h9oVHZck6oY4dQqY1GHaLvCLjSqxaD',
    cpSwapProgram: 'CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C',
    cpSwapConfigAddress: 'D4FPEruKEHrG5TenZ2mpDGEfu1iUvTiqBxvpU8HLBvC2',
    createPoolFeeReceive: 'DNXgeM9EiiaAbaWvwjHj9fQQLAX5ZsfHyvmYUNRAdNC8'
  }
};

const currentConfig = CONFIGS[network];

export const LOOKUP_TABLE_ACCOUNT = new PublicKey(currentConfig.lookupTableAccount);
export const SYSTEM_MANAGER_ACCOUNT = new PublicKey(currentConfig.systemManagerAccount);
export const cpSwapProgram = new PublicKey(currentConfig.cpSwapProgram);
export const cpSwapConfigAddress = new PublicKey(currentConfig.cpSwapConfigAddress);
export const createPoolFeeReceive = new PublicKey(currentConfig.createPoolFeeReceive);

