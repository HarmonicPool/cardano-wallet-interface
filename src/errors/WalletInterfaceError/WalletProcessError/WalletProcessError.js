
const WalletInterfaceError = require("../WalletInterfaceError");

class WalletProcessError extends WalletInterfaceError
{
    constructor( message )
    {
        super( message );
    }
}

module.exports = WalletProcessError;