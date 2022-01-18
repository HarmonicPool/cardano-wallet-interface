
declare module '@harmonicpool/cardano-wallet-interface';

import Wallet from "./Wallet/index";
import { WalletName } from "./Wallet/WalletName";
import {
    getWalletNameFromString,
    getStringFromWalletName,
    walletNames
} from "./Wallet/WalletName/utils";

export default Wallet;
export {
    Wallet,
    WalletName,
    getWalletNameFromString,
    getStringFromWalletName,
    walletNames
};