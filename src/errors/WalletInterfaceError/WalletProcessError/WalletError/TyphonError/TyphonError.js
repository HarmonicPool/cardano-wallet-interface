
import WalletError from "../WalletError";

class TyphonError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

export default TyphonError;