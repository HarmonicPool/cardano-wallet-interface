

const WalletError = require("../WalletError");

class FlintError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

module.exports = FlintError;