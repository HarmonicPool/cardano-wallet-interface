
/*
if any changes are made please make sure also the utils.js supports them
*/
const WalletName = Object.freeze({
    Nami: Symbol("Nami"),
    CCVault: Symbol("ccvault"),
    /**
     * @deprecated
     */
    FlintExperimental: Symbol("Flint Experimental"),
    Flint: Symbol("Flint"),
    Yoroi: Symbol("yoroi"),
    Gero: Symbol("GeroWallet")
})

module.exports = WalletName;