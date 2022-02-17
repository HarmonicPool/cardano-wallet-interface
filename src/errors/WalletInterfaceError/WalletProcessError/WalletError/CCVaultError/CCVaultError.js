
import WalletError from "../WalletError";

class CCVaultError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

export default CCVaultError;