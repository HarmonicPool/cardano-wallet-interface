// Type definitions for cardano-wallet-interface 1.0.18^
// Project: cardano-wallet-interface
// Definitions by: Michele Nuzzi <michelenuzzi.crypto>

export as namespace Wallet;
export = Wallet;

declare class Wallet {
    private constructor();

    private static _api_key?: string = undefined;

    private static _protocolParameters?: Wallet.TransactionProtocolParameters = undefined;

    private static _namiObj?: Wallet.RawCIP30WalletInterface = undefined;

    private static _NamiInterface?: Wallet.WalletInterface = undefined;

    private static _ccvaultObj?: Wallet.RawCIP30WalletInterface = undefined;
    
    private static _CCVaultInterface?: Wallet.WalletInterface = undefined;

    /**
     * 
     * @param {string} blockfrost_project_id blockforst api key to be used
     */
    static setBlockforst( blockfrost_project_id: string ): void;
  
    /**
     * refer to https://docs.blockfrost.io/
     * @param {string} endpoint 
     * @param headers 
     * @param body 
     * @returns 
     */
    static async makeBlockfrostRequest( endpoint: string, headers?: object, body?: object ): any

    /**
     * 
     * @returns {boolean} true if Wallet.getProtocolParameters has ever been called, false otherwise
     */
    static hasProtocolParameters(): boolean

    /**
     * 
     * @param blockfrost_project_id 
     * @returns {Wallet.TransactionProtocolParameters}
     */
    static async getProtocolParameters( blockfrost_project_id ?: string ) : Wallet.TransactionProtocolParameters

    /**
     * minimal protocol parameters needed for transactions, throws if not present,
     * prefer ```await Wallet.getProtocolParameters()``` instead
     */
    static get protocolParameters() : Wallet.TransactionProtocolParameters
   


    // ---------------------------------------- Nami ---------------------------------------- //

    /**
     * 
     * @returns {boolean} true if the nami extension has injected the window.cardano.enable function; false otherwise
     */
    static hasNami(): boolean
    
    /**
     * 
     */
    static async enableNami(): void

    /**
     * 
     */
    static get namiHasBeenEnabled() : boolean


    /**
     * 
     */
    static get Nami() : Wallet.WalletInterface

    
    // ---------------------------------------- ccvault ---------------------------------------- //
    /**
     * 
     * @returns {boolean} true if the ccvault extension has injected the window.cardano.ccvault object; false otherwise
     */
    static hasCCVault(): boolean

    /**
     * 
     */
    static async enableCCVault(): void

    /**
     * 
     */
    static get ccvaultHasBeenEnabled(): boolean

    /**
     * 
     */
    static get CCVault(): Wallet.WalletInterface
}


declare namespace Wallet {
    export interface TransactionProtocolParameters {
        // TODO
    }

    export interface RawCIP30WalletInterface {
        // TODO
    }

    export interface WalletInterface extends RawCIP30WalletInterface
    {
        getCurrentUserDelegation: ( blockfrost_project_id?: string = undefined ) => Promise<object>,
        createDelegagtionTransaction: ( targetPoolId?: string, blockfrost_project_id?: string = undefined ) => Promise<Transaction>,
        signTransaction: ( transactionToSign: Transaction ) => Promise<Transaction>,
        submitTransaction:  ( signedTransaction: Transaction ) => Promise<string>,
        // getPoolId,
        delegateTo: ( targetPoolId: string, blockfrost_project_id?: string = undefined ) => Promise<string>
    }
}