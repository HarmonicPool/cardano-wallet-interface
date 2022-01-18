
const Wallet = require("./Wallet/index");
const WalletName = require("./Wallet/WalletName")
const {
    getWalletNameFromString,
    getStringFromWalletName,
    walletNames
} =  require("./Wallet/WalletName/utils");

module.exports.default = Wallet

module.exports = {
    Wallet,
    ...WalletNameImport,
    WalletName,
    getWalletNameFromString,
    getStringFromWalletName,
    walletNames
}