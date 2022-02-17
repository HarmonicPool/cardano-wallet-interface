import WalletError from "../WalletError";

class CardwalletError extends WalletError
{
    constructor( message )
    {
        super( message );
    }
}

export default CardwalletError;