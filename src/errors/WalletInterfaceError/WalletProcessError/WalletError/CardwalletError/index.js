const WalletError = require("../WalletError");

class CardwalletError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

module.exports = CardwalletError;