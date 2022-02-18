
/**
 * set of valid wallet names
 * @deprecated use ```Wallet.stringNames``` instead
 */
export const walletNames: Readonly<Array<string>>;

/**
 * 
 * @param walletNameEnum member of the WalleName enum object
 * @returns string wallet name
 * 
 * @deprecated use ```Wallet.utils.getStringFromWalletName``` instead
 */
export function getStringFromWalletName( walletNameEnum: symbol ) : Wallet.WalletStringName;

/**
 * 
 * @param string string name of the desired wallet; same as windon.cardano.{your wallet}.name
 * @returns {symbol} member of the WalleName enum object
 * 
 * @deprecated use ```Wallet.utils.getWalletNameFromString``` instead
 */
export function getWalletNameFromString( string: Wallet.WalletStringName ) : symbol;