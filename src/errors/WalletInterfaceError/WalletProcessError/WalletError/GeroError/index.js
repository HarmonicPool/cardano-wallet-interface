
import WalletError from "..";

class GeroError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

export default GeroError;