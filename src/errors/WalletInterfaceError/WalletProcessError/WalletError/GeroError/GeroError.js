
const WalletError = require("../WalletError");

class GeroError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

module.exports = GeroError;