
/**
 * set of valid wallet names
 */
export const walletNames: Readonly<Array<string>>;

/**
 * 
 * @param walletNameEnum member of the WalleName enum object
 * @returns string wallet name
 */
export function getStringFromWalletName( walletNameEnum: symbol ) : Wallet.WalletStringName;

/**
 * 
 * @param string string name of the desired wallet; same as windon.cardano.{your wallet}.name
 * @returns {symbol} member of the WalleName enum object
 */
export function getWalletNameFromString( string: Wallet.WalletStringName ) : symbol;