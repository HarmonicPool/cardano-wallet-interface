
import WalletError from "../WalletError";

class YoroiError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

export default YoroiError;