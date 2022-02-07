
const WalletError = require("../WalletError");

class TyphonError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

module.exports = TyphonError;