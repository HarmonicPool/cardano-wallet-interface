# Wallet.Names

The strings values are the same returned by calling ```window.cardano.walletExtension.name``` in any browser environment, where ```walletExtension``` is the desired wallet

these properties, paired with some static methods, allow for wallet abstraction

as defined in [src/Wallet/index.js]():

```js
static Names = Object.freeze({
    Nami: "Nami",
    CCVault: "ccvault",
    Flint: "Flint",
    Yoroi: "yoroi",
    Gero: "GeroWallet",
    Typhon: "Typhon Wallet",
    Cardwallet: "CardWallet"
});

static stringNames = Object.freeze([
    "Nami",
    "ccvault",
    "Flint",
    "yoroi",
    "GeroWallet",
    "Typhon Wallet",
    "CardWallet"
]);
```

> **_NOTE:_** you can use ```Wallet.stringNames``` to iterate each aviable wallet check [documentation/examples/Wallets iteration.md](https://github.com/HarmonicPool/cardano-wallet-interface/blob/main/documentation/examples/Wallets%20iteration.md)
