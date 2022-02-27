
declare module '@harmonicpool/cardano-wallet-interface';

import Wallet from "./Wallet/index";
import {
    StringFormatError,
    WalletInterfaceError,
    WalletProcessError,
    WalletError,
    CCVaultError,
    NamiError,
    YoroiError,
    GeroError,
    FlintError,
    CardwalletError
} from "./errors/index";


export default Wallet;
export {
    Wallet,

    StringFormatError,
    WalletInterfaceError,
    WalletProcessError,
    WalletError,
    CCVaultError,
    NamiError,
    YoroiError,
    GeroError,
    FlintError,
    CardwalletError
};