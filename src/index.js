
import Wallet from "./Wallet/index";
import WalletName from "./Wallet/WalletName";
import { getWalletNameFromString, getStringFromWalletName, walletNames } from "./Wallet/WalletName/utils";

import {
    WalletInterfaceError,
    StringFormatError,
    WalletProcessError,
    WalletError,
    CCVaultError,
    NamiError,
    YoroiError,
    GeroError
} from "./errors/index";

const WalletNameImport = {}; // for some reason the complier cryies

const _default = Wallet;
export { _default as default };

export {
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