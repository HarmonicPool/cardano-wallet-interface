# Wallet.Names

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

the strings values are the same returned by calling ```window.cardano.walletExtension.name``` in any browser environment, where ```walletExtension``` is the desired wallet

> **_NOTE:_** you can use ```Wallet.stringNames``` to iterate each aviable wallet