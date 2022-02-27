
import WalletError from "..";

class TyphonError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

export default TyphonError;