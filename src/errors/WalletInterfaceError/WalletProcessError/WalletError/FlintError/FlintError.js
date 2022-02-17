

import WalletError from "../WalletError";

class FlintError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

export default FlintError;