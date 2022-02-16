
/*
if any changes are made please make sure also the utils.js supports them
*/
const WalletName = Object.freeze({
    Nami: Symbol("Nami"),
    CCVault: Symbol("ccvault"),
    Flint: Symbol("Flint"),
    Yoroi: Symbol("yoroi"),
    Gero: Symbol("GeroWallet"),
    Typhon: Symbol("Typhon Wallet"),
    Cardwallet: Symbol("CardWallet")
})

module.exports = WalletName;