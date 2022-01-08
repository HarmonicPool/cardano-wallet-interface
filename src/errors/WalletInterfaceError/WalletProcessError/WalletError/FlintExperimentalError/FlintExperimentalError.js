

const WalletError = require("../WalletError");

class FlintExperimentalError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

module.exports = FlintExperimentalError;