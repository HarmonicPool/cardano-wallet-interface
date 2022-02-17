import WalletInterfaceError from "../../errors/WalletInterfaceError/WalletInterfaceError";
import WalletName from "./index";

export const walletNames = Object.freeze([
    "Nami",
    "ccvault",
    "Flint",
    "yoroi",
    "GeroWallet",
    "Typhon Wallet",
    "CardWallet"
]);

export function getStringFromWalletName( walletNameEnum )
{
    const invalidSymbolError = new WalletInterfaceError("walletNameEnum must be a property of the WalletName enum object");;
    if( typeof walletNameEnum !== "symbol" ) throw invalidSymbolError;

    switch( walletNameEnum )
    {
        case WalletName.Nami:               return "Nami";
        case WalletName.CCVault:            return "ccvault";
        case WalletName.Flint:              return "Flint";
        case WalletName.Yoroi:              return "yoroi";
        case WalletName.Gero:               return "GeroWallet";
        case WalletName.Typhon:             return "Typhon Wallet";
        case WalletName.Cardwallet:         return "CardWallet";

        default:
            throw invalidSymbolError;
    }
}

export function getWalletNameFromString( string )
{
    const invalidString = new WalletInterfaceError("getWalletNameFromString parameter must be a valid wallet string name");

    if( typeof string !== "string" )    throw invalidString;
    if( !walletNames.includes(string) ) throw invalidString;

    switch( string )
    {
        case "Nami":                return WalletName.Nami;
        case "ccvault":             return WalletName.CCVault;
        case "Flint":               return WalletName.Flint;
        case "yoroi":               return WalletName.Yoroi;
        case "GeroWallet":          return WalletName.Gero;
        case "Typhon Wallet":       return WalletName.Typhon;
        case "CardWallet":          return WalletName.Cardwallet;


        default: // should never get here
            throw invalidString;
    }
}