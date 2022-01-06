
const WalletInterfaceError = require("../WalletInterfaceError");

class StringFormatError extends WalletInterfaceError
{
    constructor( message )
    {
        super( message );
    }
}

module.exports = StringFormatError;