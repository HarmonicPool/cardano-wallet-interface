
import WalletProcessError from "..";

class WalletError extends WalletProcessError
{
    constructor( message )
    {
        super( message );
    }
}

export default WalletError;