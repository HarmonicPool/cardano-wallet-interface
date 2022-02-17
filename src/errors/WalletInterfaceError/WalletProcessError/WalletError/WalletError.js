
import WalletProcessError from "../WalletProcessError";

class WalletError extends WalletProcessError
{
    constructor( message )
    {
        super( message );
    }
}

export default WalletError;