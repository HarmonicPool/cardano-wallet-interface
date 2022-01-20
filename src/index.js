
const Wallet = require("./Wallet/index");
const WalletName = require("./Wallet/WalletName")
const {
    getWalletNameFromString,
    getStringFromWalletName,
    walletNames
} =  require("./Wallet/WalletName/utils");

const {
    WalletInterfaceError,
    StringFormatError,
    WalletProcessError,
    WalletError,
    CCVaultError,
    NamiError,
    FlintExperimentalError,
    YoroiError,
    GeroError
} = require("./errors/index")

module.exports.default = Wallet

module.exports = {
    Wallet,
    ...WalletNameImport,
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
    FlintExperimentalError,
    YoroiError,
    GeroError
}