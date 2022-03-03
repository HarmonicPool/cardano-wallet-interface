import WalletInterfaceError from "..";

export default class StringFormatError extends WalletInterfaceError
{
    constructor( message: string );
}