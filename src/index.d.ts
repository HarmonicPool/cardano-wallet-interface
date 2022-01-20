
declare module '@harmonicpool/cardano-wallet-interface';

import Wallet from "./Wallet/index";
import { WalletName } from "./Wallet/WalletName";
import {
    getWalletNameFromString,
    getStringFromWalletName,
    walletNames
} from "./Wallet/WalletName/utils";
import {
    WalletInterfaceError,
    StringFormatError,
    WalletProcessError,
    WalletError,
    CCVaultError,
    NamiError,
    FlintExperimentalError,
    YoroiError,
    GeroError
} from "./errors/index"

export default Wallet;
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
    FlintExperimentalError,
    YoroiError,
    GeroError
};