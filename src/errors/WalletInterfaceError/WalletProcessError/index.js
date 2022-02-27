
import WalletInterfaceError from "..";

class WalletProcessError extends WalletInterfaceError
{
    constructor( message )
    {
        super( message );
    }
}

export default WalletProcessError;