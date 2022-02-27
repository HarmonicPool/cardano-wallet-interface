
import WalletError from "..";

class YoroiError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

export default YoroiError;