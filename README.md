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

### Keypair File Format

The keypair file should be a JSON file containing an array of 64 numbers representing your private key:

```json
[174, 47, ..., 238, 135]
```

### Options

- `--rpc <url>`: RPC endpoint (default: https://api.mainnet-beta.solana.com)
- `--keypair-bs58 <bs58>`: Keypair in base58 format
- `--keypair-file <path>`: Path to keypair file (JSON array format)
- `--name <name>`: Token name (for launch command)
- `--symbol <symbol>`: Token symbol (for launch command)
- `--uri <uri>`: Token metadata URI (for launch command)
- `--token-type <type>`: Token type - meme or standard (default: meme)
- `--mint <address>`: Mint account address
- `--urc <code>`: URC referral code
