import Wallet from "..";

/**
 * 
 * @param walletNameEnum member of the WalleName enum object
 * @returns {Wallet.WalletStringName}
 */
function getStringFromWalletName( walletNameEnum: symbol ) : Wallet.WalletStringName;

/**
 * 
 * @param string string name of the desired wallet; same as windon.cardano.{your wallet}.name
 * @returns {symbol} member of the WalleName enum object
 */
function getWalletNameFromString( string: Wallet.WalletStringName ) : symbol;

export default {
    getStringFromWalletName,
    getWalletNameFromString
}