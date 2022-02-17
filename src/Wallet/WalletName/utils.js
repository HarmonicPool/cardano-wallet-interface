import WalletInterfaceError from "../../errors/WalletInterfaceError/WalletInterfaceError";
import { Nami, CCVault, Flint, Yoroi, Gero, Typhon, Cardwallet } from "./index";

const walletNames = Object.freeze([
    "Nami",
    "ccvault",
    "Flint",
    "yoroi",
    "GeroWallet",
    "Typhon Wallet",
    "CardWallet"
]);

function getStringFromWalletName( walletNameEnum )
{
    const invalidSymbolError = new WalletInterfaceError("walletNameEnum must be a property of the WalletName enum object");;
    if( typeof walletNameEnum !== "symbol" ) throw invalidSymbolError;

    switch( walletNameEnum )
    {
        case Nami:               return "Nami";
        case CCVault:            return "ccvault";
        case Flint:              return "Flint";
        case Yoroi:              return "yoroi";
        case Gero:               return "GeroWallet";
        case Typhon:             return "Typhon Wallet";
        case Cardwallet:         return "CardWallet";

        default:
            throw invalidSymbolError;
    }
}

function getWalletNameFromString( string )
{
    const invalidString = new WalletInterfaceError("getWalletNameFromString parameter must be a valid wallet string name");

    if( typeof string !== "string" )    throw invalidString;
    if( !walletNames.includes(string) ) throw invalidString;

    switch( string )
    {
        case "Nami":                return Nami;
        case "ccvault":             return CCVault;
        case "Flint":               return Flint;
        case "yoroi":               return Yoroi;
        case "GeroWallet":          return Gero;
        case "Typhon Wallet":       return Typhon;
        case "CardWallet":          return Cardwallet;


        default: // should never get here
            throw invalidString;
    }
}

export default {
    getStringFromWalletName,
    getWalletNameFromString,
    walletNames
}