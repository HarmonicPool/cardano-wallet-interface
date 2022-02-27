
import WalletError from "..";

export default class TyphonError extends WalletError
{
    constructor( message: string )
    {
        super( message );
    }
}