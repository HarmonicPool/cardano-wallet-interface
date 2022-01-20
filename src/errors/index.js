
const WalletInterfaceError      = require("./WalletInterfaceError/WalletInterfaceError");
const StringFormatError         = require("./WalletInterfaceError/StringFormatError/StringFormatError");
const WalletProcessError        = require("./WalletInterfaceError/WalletProcessError/WalletProcessError");
const WalletError               = require("./WalletInterfaceError/WalletProcessError/WalletError/WalletError");
const CCVaultError              = require("./WalletInterfaceError/WalletProcessError/WalletError/CCVaultError/CCVaultError");
const NamiError                 = require("./WalletInterfaceError/WalletProcessError/WalletError/NamiError/NamiError");
const FlintExperimentalError    = require("./WalletInterfaceError/WalletProcessError/WalletError/FlintExperimentalError/FlintExperimentalError");
const YoroiError                = require("./WalletInterfaceError/WalletProcessError/WalletError/YoroiError/YoroiError");
const GeroError                 = require("./WalletInterfaceError/WalletProcessError/WalletError/GeroError/GeroError");



module.exports = {
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