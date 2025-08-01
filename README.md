## Test in localnet
### Run the solana-test-validator
```
solana-test-validator --reset \
--bpf-program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA token_program.so \
--bpf-program TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb token_extensions.so \
--bpf-program metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s token_metadata.so \
--bpf-program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL token_ata.so \
--bpf-program devi51mZmdwUJGU9hjN27vEz64Gps7uUefqxg27EAtH raydium_clmm.so \
--bpf-program CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy4n2BHAbHkCW raydium_amm.so \
--bpf-program DDg4VmQaJV9ogWce7LpcjBA9bv22wRp5uaTPa5pGjijF raydium_stable_swap.so \
--bpf-program BVChZ3XFEwTMUk1o9i3HAf91H6mFxSwa5X2wFAWhYPhU raydium_amm_route.so \
--bpf-program HWy1jotHpo6UqeQxx49dpYYdQB8wj9Qk9MdxwjLvDHB8 openbook_amm.so
```

### Send some SOL to test account
```
solana transfer DJ3jvpv6k7uhq8h9oVHZck6oY4dQqY1GHaLvCLjSqxaD 20 --allow-unfunded-recipient
```

### Deploy fair_mint_token
Edit the `Anchor.toml`
```
...
[provider]
cluster = "localnet" # "mainnet"
...
```

Run the following commands to build and deploy the program:
```
solana config set --url localhost

anchor build -- --feature localnet

solana program deploy --keypair user-keypair.json ./target/deploy/fair_mint_token.so --program-id target/deploy/fair_mint_token-keypair-mainnet.json
```

The local fair_mint_token program id is:
```
FLipzZfErPUtDQPj9YrC6wp4nRRiVxRkFm3jdFmiPHJV
```

### Send some WSOL to fee account to initialize it's token account
Let's say the fee account is: `7x75mM5g8wx87bhjxhWKJPSb5mUboPGBWhRWA1AUBXmb`
```
spl-token wrap 10

spl-token transfer So11111111111111111111111111111111111111112 10 7x75mM5g8wx87bhjxhWKJPSb5mUboPGBWhRWA1AUBXmb --fund-recipient --allow-unfunded-recipient
```

### Initialize the system params of fair_mint_token program.
```
ts-node tests/src/cli.ts init --rpc http://127.0.0.1:8899 --keypair-base58 <base58_keypair of user_keypair.json>
```
Replace the LUT address to `config.ts` CONFIG.lookupTableAccount

Run the above command again, to initialize the system config account.

### Launch a token
```
ts-node tests/src/cli.ts launch --name "Test Token" --symbol "TEST" --keypair-bs58 <deployer_base58_keypair>
```
A new token will be deployed. You can find the `mint account`, `config account` and a list of all token details.

### Display mint details
```
ts-node tests/src/cli.ts display-mint --mint <mint_account> --rpc http://127.0.0.1:8899
```

### Set URC
```
ts-node tests/src/cli.ts set-urc --mint <mint_account> --urc <urc_code> --keypair-bs58 <urc creator's base58 keypair> --rpc http://127.0.0.1:8899
```

### Mint tokens
```

```

### Example:
Let's say, we have 3 accounts:
- #1 deployer:
```
pubkey: dety9BLfU3EvouTAfXpZNisULXAGMRnpjEANPq7duAp
prikey: 3HtSPuKFa1Df9pgdpqnMZoa4cMkLnh3tbAuXR9aeJY9WSWTUtXvPHUMyzNRjyN9sRF586T7fLdzhNLM4rdVpW4MW
```

- #2 urc provider:
```
pubkey: urq59pTdKGN9XMzfKUpj7oichcurNAAeMJJTapBKDWY
prikey: MpW2stfit1AswiLCwdGsSTG3Z8DFsBrmmbPZyiDfm5jDaEuPfVP7EANqiVXQ97Nibqx5m2KaKSrxqc917J3jwqi
```

- #3 minter:
```
pubkey: mi4AEZ4Q9CgKcwNsiraa1sAEUMaxsTLz42SPew3cYaa
prikey: jtqvhi1REtpMkysr3Z8L8RbvodDDXGpaTu7PVLWtamNMvP8zVidSUiPPgusYKgceRya6tzhd2CeFMeuNwZqcKVx
```
Send some SOL to above accounts.


1- Launch a token by deployer, say "Trump Token", symbol "TRP"
```
flipflop launch --name "Trump Token" --symbol "TRP" --keypair-bs58 3HtSPuKFa1Df9pgdpqnMZoa4cMkLnh3tbAuXR9aeJY9WSWTUtXvPHUMyzNRjyN9sRF586T7fLdzhNLM4rdVpW4MW
```
The mint address: `Ca8hEwpmXWmaheHF9Pitmo6pB1XvbSQtEFpVJJqddNz5`

2- Check the mint details
```
flipflop display-mint --mint Ca8hEwpmXWmaheHF9Pitmo6pB1XvbSQtEFpVJJqddNz5
```

3- Set URC by urc provider, say "TRP_URC"
```
flipflop set-urc --mint Ca8hEwpmXWmaheHF9Pitmo6pB1XvbSQtEFpVJJqddNz5 --urc TRP_URC --keypair-bs58 MpW2stfit1AswiLCwdGsSTG3Z8DFsBrmmbPZyiDfm5jDaEuPfVP7EANqiVXQ97Nibqx5m2KaKSrxqc917J3jwqi
```

4- Mint token by minter with URC: "TRP_URC"
```
flipflop mint --mint Ca8hEwpmXWmaheHF9Pitmo6pB1XvbSQtEFpVJJqddNz5 --urc TRP_URC --keypair-bs58 jtqvhi1REtpMkysr3Z8L8RbvodDDXGpaTu7PVLWtamNMvP8zVidSUiPPgusYKgceRya6tzhd2CeFMeuNwZqcKVx
```

5- Check the balanc of spl-token
```
spl-token accounts --owner mi4AEZ4Q9CgKcwNsiraa1sAEUMaxsTLz42SPew3cYaa
```



