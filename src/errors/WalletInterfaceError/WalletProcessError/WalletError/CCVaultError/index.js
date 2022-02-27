
import WalletError from "..";

class CCVaultError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

export default CCVaultError;