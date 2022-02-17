
import WalletInterfaceError from "../WalletInterfaceError";

class WalletProcessError extends WalletInterfaceError
{
    constructor( message )
    {
        super( message );
    }
}

export default WalletProcessError;