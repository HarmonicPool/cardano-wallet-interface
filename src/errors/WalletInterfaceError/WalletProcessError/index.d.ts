
import WalletInterfaceError from "..";

export default class WalletProcessError extends WalletInterfaceError
{
    constructor( message: string )
    {
        super( message );
    }
}