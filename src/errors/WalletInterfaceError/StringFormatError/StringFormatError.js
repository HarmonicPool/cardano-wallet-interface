
import WalletInterfaceError from "../WalletInterfaceError";

class StringFormatError extends WalletInterfaceError
{
    constructor( message )
    {
        super( message );
    }
}

export default StringFormatError;