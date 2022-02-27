import WalletError from "..";

class CardwalletError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

export default CardwalletError;