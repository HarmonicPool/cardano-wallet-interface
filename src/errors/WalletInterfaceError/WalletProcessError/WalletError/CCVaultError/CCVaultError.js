
const WalletError = require("../WalletError");

class CCVaultError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

module.exports = CCVaultError;