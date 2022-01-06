
class WalletInterfaceError extends Error
{
    constructor( message )
    {
        super( message );
    }
}

module.exports = WalletInterfaceError;