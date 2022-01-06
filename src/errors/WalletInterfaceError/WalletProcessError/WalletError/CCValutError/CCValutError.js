
const WalletError = require("../WalletError");

class CCValut extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

module.exports = CCValut;