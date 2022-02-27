
import Wallet from "./Wallet/index";

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
    
    WalletInterfaceError,
    StringFormatError,
    WalletProcessError,
    WalletError,
    CCVaultError,
    NamiError,
    YoroiError,
    GeroError
}