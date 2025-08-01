import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

// Basic types
export interface KeypairInfo {
  publicKey: string;
  bs58Secret: string;
  secretArray: number[];
}

// Add more types from IDL as needed
export type NetworkType = 'local' | 'devnet' | 'mainnet';

export type RemainingAccount = {
  pubkey: PublicKey,
  isSigner: boolean,
  isWritable: boolean
}

export interface ReferralAccountData {
    referrerMain: PublicKey;
    referrerAta: PublicKey;
    usageCount: number;
    codeHash: PublicKey;
    mint: PublicKey;
    activeTimestamp: BN;
    isProcessing: boolean;
}
