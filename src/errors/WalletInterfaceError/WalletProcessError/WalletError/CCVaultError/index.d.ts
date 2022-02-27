
import WalletError from "..";

export default class CCVaultError extends WalletError
{
    constructor( message: string )
    {
        super( message );
    }
} 