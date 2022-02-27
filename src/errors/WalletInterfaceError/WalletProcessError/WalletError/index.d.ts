
import WalletProcessError from "..";

export default class WalletError extends WalletProcessError
{
    constructor( message: string )
    {
        super( message );
    }
}