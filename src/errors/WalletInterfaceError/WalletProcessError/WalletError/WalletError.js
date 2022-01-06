
const WalletProcessError = require("../WalletProcessError");

class WalletError extends WalletProcessError
{
    constructor( message )
    {
        super( message );
    }
}

module.exports = WalletError;