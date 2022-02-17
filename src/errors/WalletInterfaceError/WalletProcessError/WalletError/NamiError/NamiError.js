
import WalletError from "../WalletError";

class NamiError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

export default NamiError;