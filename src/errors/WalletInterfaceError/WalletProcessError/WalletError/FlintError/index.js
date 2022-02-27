

import WalletError from "..";

class FlintError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

export default FlintError;