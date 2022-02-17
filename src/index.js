
const Wallet = require("./Wallet/index");
const WalletName = require("./Wallet/WalletName")
const {
    getWalletNameFromString,
    getStringFromWalletName,
    walletNames
} =  require("./Wallet/WalletName/utils");

const WalletNameImports = {}; // for some reason the complier cryies

const {
    WalletInterfaceError,
    StringFormatError,
    WalletProcessError,
    WalletError,
    CCVaultError,
    NamiError,
    YoroiError,
    GeroError
} = require("./errors/index")

module.exports.default = Wallet

module.exports = {
    Wallet,
    WalletName,
    getWalletNameFromString,
    getStringFromWalletName,
    walletNames,
    WalletInterfaceError,
    StringFormatError,
    WalletProcessError,
    WalletError,
    CCVaultError,
    NamiError,
    YoroiError,
    GeroError
}