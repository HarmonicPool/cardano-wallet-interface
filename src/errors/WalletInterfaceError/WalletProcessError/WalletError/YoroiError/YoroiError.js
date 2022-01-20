
const WalletError = require("../WalletError");

class YoroiError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

module.exports = YoroiError;