

/**
 * other files to possiblly update:
 * Wallet/index.js
 *  - has
 *  - isAviable
 *  - isEnabled
 *  - enable
 * all taking a WalletName as input and divveretiating by using a switch
 */

/**
 * enum object to keep track of the wallet used
 * @readonly
 */
export const WalletName : Readonly<{
    Nami: symbol;
    CCVault: symbol;
    /**
     * @deprecated
     */
    FlintExperimental: symbol;
    Flint: symbol;
    Yoroi: symbol;
    Gero: symbol;
}>;


export default WalletName;
