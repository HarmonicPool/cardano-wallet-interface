
const WalletError = require("../WalletError");

class NamiError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

module.exports = NamiError;