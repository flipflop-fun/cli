# FlipFlop CLI ✨

## CLI Commands

### 🚀 Launch a token

```bash
flipflop launch --name <token_name> --symbol <token_symbol> --keypair-bs58 <deployer_base58_keypair> --rpc http://127.0.0.1:8899
```
A new token will be deployed. You can find the `mint account`, `config account` and a list of all token details.

### 🔍 Display mint details

```bash
flipflop display-mint --mint <mint_account> --rpc http://127.0.0.1:8899
```

### 🎯 Set URC

```bash
flipflop set-urc --mint <mint_account> --urc <urc_code> --keypair-bs58 <urc creator's base58 keypair> --rpc http://127.0.0.1:8899
```

### 🔧 Display URC

```bash
flipflop display-urc --urc <urc_code> --rpc http://127.0.0.1:8899
```

### 💎 Mint tokens

```bash
flipflop mint --mint <mint_account> --urc <urc_code> --keypair-bs58 <minter's base58 keypair> --rpc http://127.0.0.1:8899
```

## 🎭 Example

### Account Setup

Let's say, we have 3 accounts:

- **#1 Deployer**:
  ```
  pubkey: dety9BLfU3EvouTAfXpZNisULXAGMRnpjEANPq7duAp
  prikey: 3HtSPuKFa1Df9pgdpqnMZoa4cMkLnh3tbAuXR9aeJY9WSWTUtXvPHUMyzNRjyN9sRF586T7fLdzhNLM4rdVpW4MW
  ```

- **#2 URC Provider**:
  ```
  pubkey: urq59pTdKGN9XMzfKUpj7oichcurNAAeMJJTapBKDWY
  prikey: MpW2stfit1AswiLCwdGsSTG3Z8DFsBrmmbPZyiDfm5jDaEuPfVP7EANqiVXQ97Nibqx5m2KaKSrxqc917J3jwqi
  ```

- **#3 Minter**:
  ```
  pubkey: mi4AEZ4Q9CgKcwNsiraa1sAEUMaxsTLz42SPew3cYaa
  prikey: jtqvhi1REtpMkysr3Z8L8RbvodDDXGpaTu7PVLWtamNMvP8zVidSUiPPgusYKgceRya6tzhd2CeFMeuNwZqcKVx
  ```

Send some SOL to above accounts for gas fee and minting fee.

### 🎪 Step-by-step flow

#### 1. Launch a token by deployer, say token name is "Trump Token", and symbol is "TRP"
```bash
flipflop launch --name "Trump Token" --symbol "TRP" --keypair-bs58 3HtSPuKFa1Df9pgdpqnMZoa4cMkLnh3tbAuXR9aeJY9WSWTUtXvPHUMyzNRjyN9sRF586T7fLdzhNLM4rdVpW4MW
```
The mint address: `Ca8hEwpmXWmaheHF9Pitmo6pB1XvbSQtEFpVJJqddNz5`. As the mint account depends on the token name and symbol, it will be same if token name and symbol are same.

#### 2. Check the mint details
```bash
flipflop display-mint --mint Ca8hEwpmXWmaheHF9Pitmo6pB1XvbSQtEFpVJJqddNz5
```

#### 3. Set URC by URC provider, say "TRP_URC"
```bash
flipflop set-urc --mint Ca8hEwpmXWmaheHF9Pitmo6pB1XvbSQtEFpVJJqddNz5 --urc TRP_URC --keypair-bs58 MpW2stfit1AswiLCwdGsSTG3Z8DFsBrmmbPZyiDfm5jDaEuPfVP7EANqiVXQ97Nibqx5m2KaKSrxqc917J3jwqi
```

#### 4. Mint token by minter with URC: "TRP_URC"
```bash
flipflop mint --mint Ca8hEwpmXWmaheHF9Pitmo6pB1XvbSQtEFpVJJqddNz5 --urc TRP_URC --keypair-bs58 jtqvhi1REtpMkysr3Z8L8RbvodDDXGpaTu7PVLWtamNMvP8zVidSUiPPgusYKgceRya6tzhd2CeFMeuNwZqcKVx
```

#### 5. Check the balance of SPL-token
```bash
spl-token accounts --owner mi4AEZ4Q9CgKcwNsiraa1sAEUMaxsTLz42SPew3cYaa
```
