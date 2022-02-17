
import WalletError from "../WalletError";

class GeroError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

export default GeroError;