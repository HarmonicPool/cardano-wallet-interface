
import WalletError from "..";

export default class GeroError extends WalletError
{
    constructor( message: string )
    {
        super( message );
    }
}