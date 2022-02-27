
import WalletInterfaceError from "..";

class StringFormatError extends WalletInterfaceError
{
    constructor( message )
    {
        super( message );
    }
}

export default StringFormatError;