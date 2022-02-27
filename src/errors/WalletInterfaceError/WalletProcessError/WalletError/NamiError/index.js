
import WalletError from "..";

class NamiError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

export default NamiError;