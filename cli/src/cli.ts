#!/usr/bin/env node

import { Command } from 'commander';
// import { initCommand } from './init';
import { launchCommand } from './launch';
import { setUrcCommand } from './set-urc';
import { displayMintCommand } from './display-mint';
import { mintCommand } from './mint';
import { displayUrcCommand } from './display-urc';
import { systemConfigCommand } from './system-config';
import { metadataCommand } from './metadata';
import { displayTokenParamsCommand } from './display-token-params';
import { buyTokenCommand } from './raydium/buy-token';
import { sellTokenCommand } from './raydium/sell-token';
import { addLiquidityCommand } from './raydium/add-liquidity';
import { removeLiquidityCommand } from './raydium/remove-liquidity';
import { burnLiquidityCommand } from './raydium/burn-liquidity';
import { displayPoolCommand } from './raydium/display-pool';
import { displayLPCommand } from './raydium/display-lp';
import { createPoolCommand } from './raydium/create-pool';
// Create the main program
const program = new Command();

program
  .name('flipflop')
  .description('A CLI tool for Flipflop token operations')
  .version('1.2.1');

// Add launch subcommand
program.command('launch')
  .description('Launch a new token')
  .option('--rpc <url>', 'RPC endpoint', 'https://api.mainnet-beta.solana.com')
  .option('--name <name>', 'Token name')
  .option('--symbol <symbol>', 'Token symbol')
  .option('--uri <uri>', 'Token URI')
  .option('--token-type <type>', 'Token type (meme or standard)', 'meme')
  .option('--keypair-bs58 <bs58>', 'Keypair in BS58 format')
  .option('--keypair-file <pathfile>', 'Path to keypair file (Array format)')
  .action(launchCommand);

program.command('display-mint')
  .description('Display mint details')
  .option('--rpc <url>', 'RPC endpoint', 'https://api.mainnet-beta.solana.com')
  .option('--mint <address>', 'Mint account address')
  .action(displayMintCommand);

// Add urc subcommand
program.command('set-urc')
  .description('Create or update URC code')
  .option('--rpc <url>', 'RPC endpoint', 'https://api.mainnet-beta.solana.com')
  .option('--mint <address>', 'Mint account address')
  .option('--urc <code>', 'URC code')
  .option('--keypair-bs58 <bs58>', 'Keypair in BS58 format')
  .option('--keypair-file <pathfile>', 'Path to keypair file (Array format)')
  .action(setUrcCommand);

program.command('display-urc')
  .description('Display URC details')
  .option('--rpc <url>', 'RPC endpoint', 'https://api.mainnet-beta.solana.com')
  .option('--urc <code>', 'URC code')
  .action(displayUrcCommand);

program.command('display-token-params')
  .description('Display token params')
  .option('--rpc <url>', 'RPC endpoint', 'https://api.mainnet-beta.solana.com')
  .option('--token-type <type>', 'Token type (meme or standard)', 'meme')
  .action(displayTokenParamsCommand);

// Add mint subcommand
program.command('mint')
  .description('Mint tokens')
  .option('--rpc <url>', 'RPC endpoint', 'https://api.mainnet-beta.solana.com')
  .option('--mint <address>', 'Mint account address')
  .option('--urc <code>', 'URC code')
  .option('--keypair-bs58 <bs58>', 'Keypair in BS58 format')
  .option('--keypair-file <pathfile>', 'Path to keypair file (Array format)')
  .option('--lut <address>', 'LookupTableAddress of common addresses')
  .action(mintCommand);

// Add show system config
program.command('system-config')
  .description('Get system config')
  .option('--rpc <url>', 'RPC endpoint', 'https://api.mainnet-beta.solana.com')
  .action(systemConfigCommand);

// Add upload metadata and get uri
program.command('metadata')
  .description('Upload metadata and get uri')
  .option('--rpc <url>', 'RPC endpoint', 'https://api.mainnet-beta.solana.com')
  .option('--name <name>', 'Token name')
  .option('--symbol <symbol>', 'Token symbol')
  .option('--description <description>', 'Token description')
  .option('--image-path <path>', 'Path to image file')
  .action(metadataCommand);

// Raydium CPMM Commands
program.command('raydium-buy')
  .description('Buy tokens from Raydium CPMM pool')
  .option('--rpc <url>', 'RPC endpoint', 'https://api.mainnet-beta.solana.com')
  .option('--mint <address>', 'Mint account address')
  .option('--amount <amount>', 'Amount of tokens to buy')
  .option('--keypair-bs58 <bs58>', 'Keypair in BS58 format')
  .option('--keypair-file <pathfile>', 'Path to keypair file (Array format)')
  .action(buyTokenCommand);

program.command('raydium-sell')
  .description('Sell tokens to Raydium CPMM pool')
  .option('--rpc <url>', 'RPC endpoint', 'https://api.mainnet-beta.solana.com')
  .option('--mint <address>', 'Mint account address')
  .option('--amount <amount>', 'Amount of tokens to sell')
  .option('--keypair-bs58 <bs58>', 'Keypair in BS58 format')
  .option('--keypair-file <pathfile>', 'Path to keypair file (Array format)')
  .action(sellTokenCommand);

program.command('raydium-add-liquidity')
  .description('Add liquidity to Raydium CPMM pool')
  .option('--rpc <url>', 'RPC endpoint', 'https://api.mainnet-beta.solana.com')
  .option('--mint <address>', 'Mint account address')
  .option('--token-amount <amount>', 'Amount of tokens to add')
  .option('--slippage <percentage>', 'Slippage tolerance in percentage', '1')
  .option('--keypair-bs58 <bs58>', 'Keypair in BS58 format')
  .option('--keypair-file <pathfile>', 'Path to keypair file (Array format)')
  .action(addLiquidityCommand);

program.command('raydium-remove-liquidity')
  .description('Remove liquidity from Raydium CPMM pool')
  .option('--rpc <url>', 'RPC endpoint', 'https://api.mainnet-beta.solana.com')
  .option('--mint <address>', 'Mint account address')
  .option('--remove-percentage <percentage>', 'Percentage of LP tokens to remove (0-100)')
  .option('--slippage <percentage>', 'Slippage tolerance in percentage', '1')
  .option('--keypair-bs58 <bs58>', 'Keypair in BS58 format')
  .option('--keypair-file <pathfile>', 'Path to keypair file (Array format)')
  .action(removeLiquidityCommand);

program.command('raydium-burn-liquidity')
  .description('Burn liquidity tokens and receive underlying assets')
  .option('--rpc <url>', 'RPC endpoint', 'https://api.mainnet-beta.solana.com')
  .option('--mint <address>', 'Mint account address')
  .option('--lp-token-amount <amount>', 'Amount of LP tokens to burn')
  .option('--keypair-bs58 <bs58>', 'Keypair in BS58 format')
  .option('--keypair-file <pathfile>', 'Path to keypair file (Array format)')
  .action(burnLiquidityCommand);

program.command('raydium-display-pool')
  .description('Display Raydium CPMM pool information')
  .option('--rpc <url>', 'RPC endpoint', 'https://api.mainnet-beta.solana.com')
  .option('--mint <address>', 'Mint account address')
  .action(displayPoolCommand);

program.command('raydium-display-lp')
  .description('Display LP token information for user')
  .option('--rpc <url>', 'RPC endpoint', 'https://api.mainnet-beta.solana.com')
  .option('--mint <address>', 'Mint account address')
  .option('--owner <address>', 'Owner address')
  .action(displayLPCommand);

program.command('raydium-create-pool')
  .description('Create a new Raydium CPMM pool')
  .option('--rpc <url>', 'RPC endpoint', 'https://api.mainnet-beta.solana.com')
  .option('--mint-a <address>', 'Token A mint address')
  .option('--mint-b <address>', 'Token B mint address')
  .option('--amount-a <amount>', 'Amount of token A to deposit')
  .option('--amount-b <amount>', 'Amount of token B to deposit')
  .option('--keypair-bs58 <bs58>', 'Keypair in BS58 format')
  .option('--keypair-file <pathfile>', 'Path to keypair file (Array format)')
  .action(createPoolCommand);

  // Add init subcommand
// program.command('init')
//   .description('Initialize contracts including LUT and system config, only by Flipflop program deployer')
//   .option('--rpc <url>', 'RPC endpoint', 'https://api.mainnet-beta.solana.com')
//   .option('--keypair-bs58 <bs58>', 'Keypair in BS58 format')
//   .option('--keypair-file <path>', 'Path to keypair file (Array format)')
//   .action(initCommand);

program.parse();