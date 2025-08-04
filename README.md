# FlipFlop CLI ✨

A command-line interface for Flipflop token operations.

## Installation

```bash
npm install -g @flipflop-sdk/cli
```

## Usage

### Authentication

The CLI supports two ways to provide your keypair:

1. **Base58 format**: Use `--keypair-bs58` with your private key in base58 format
2. **File format**: Use `--keypair-file` with path to a JSON file containing your private key as an array of 64 numbers

**Note**: If both parameters are provided, `--keypair-file` takes priority.

### Commands

#### Launch a new token

```bash
flipflop launch --name "MyToken" --symbol "MTK" --keypair-file ./keypair.json
# or
flipflop launch --name "MyToken" --symbol "MTK" --keypair-bs58 "your_base58_private_key"
```

#### Set URC code

```bash
flipflop set-urc --mint <mint_address> --urc "mycode" --keypair-file ./keypair.json
# or
flipflop set-urc --mint <mint_address> --urc "mycode" --keypair-bs58 "your_base58_private_key"
```

#### Mint tokens

```bash
flipflop mint --mint <mint_address> --urc "mycode" --keypair-file ./keypair.json
# or
flipflop mint --mint <mint_address> --urc "mycode" --keypair-bs58 "your_base58_private_key"
```

#### Display mint information

```bash
flipflop display-mint --mint <mint_address>
```

#### Display URC information

```bash
flipflop display-urc --urc "mycode"
```

#### View system configuration

```bash
flipflop system-config
```

Displays comprehensive system configuration including:
- System admin address
- Token count
- Fee rates and accounts
- Pool settings
- System status

#### Upload metadata and get URI

```bash
flipflop metadata --name "MyToken" --symbol "MTK" --description "My awesome token" --image-path ./token-image.png
```

Uploads token metadata (including image) and returns the metadata URI for use in token creation.

### Keypair File Format

The keypair file should be a JSON file containing an array of 64 numbers representing your private key:

```json
[174, 47, ..., 238, 135]
```

### Global Options

- `--rpc <url>`: RPC endpoint (default: https://api.mainnet-beta.solana.com)
- `--keypair-bs58 <bs58>`: Keypair in base58 format
- `--keypair-file <path>`: Path to keypair file (JSON array format)

### Command-specific Options

#### Launch Command
- `--name <name>`: Token name (required)
- `--symbol <symbol>`: Token symbol (required)
- `--uri <uri>`: Token metadata URI (optional)
- `--token-type <type>`: Token type - meme or standard (default: meme)

#### Set URC Command
- `--mint <address>`: Mint account address (required)
- `--urc <code>`: URC referral code (required)

#### Mint Command
- `--mint <address>`: Mint account address (required)
- `--urc <code>`: URC referral code (required)

#### Display Commands
- `--mint <address>`: Mint account address (for display-mint)
- `--urc <code>`: URC code (for display-urc)

#### Metadata Command
- `--name <name>`: Token name (required)
- `--symbol <symbol>`: Token symbol (required)
- `--description <description>`: Token description (required)
- `--image-path <path>`: Path to image file (required)

## Features

- 🚀 **Token Launch**: Create new tokens with customizable metadata
- 🎯 **URC Management**: Set and manage referral codes
- 💰 **Token Minting**: Mint tokens using URC codes
- 📊 **Information Display**: View mint and URC details
- ⚙️ **System Configuration**: Check current system settings
- 🖼️ **Metadata Upload**: Upload token images and metadata
- 🔐 **Flexible Authentication**: Support for both file and base58 keypairs
- 🌐 **Multi-network Support**: Configurable RPC endpoints

## Dependencies

This CLI tool uses the following key libraries:

- `@flipflop-sdk/node`: Core FlipFlop SDK functionality
- `@solana/web3.js`: Solana blockchain interaction
- `@coral-xyz/anchor`: Solana program framework
- `commander`: Command-line interface framework
- `decimal.js`: Precise decimal arithmetic
- `bs58`: Base58 encoding/decoding

## Requirements

- Node.js >= 16.0.0
- npm or yarn package manager

## Support

For issues and questions, please visit our [GitHub repository](https://github.com/flipflop-fun/sdk).
