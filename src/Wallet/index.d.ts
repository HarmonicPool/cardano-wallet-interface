// Type definitions for cardano-wallet-interface 1.0.18^
// Project: cardano-wallet-interface
// Definitions by: Michele Nuzzi [michele.nuzzi.2014@gmail.com]

import { Transaction, TransactionUnspentOutput, TransactionWitnessSet } from "@emurgo/cardano-serialization-lib-browser";
import { Buffer } from "buffer";


export as namespace Wallet;
export = Wallet;

declare class Wallet {
    private constructor();

    private static _api_key?: string;

    private static _protocolParameters?: Wallet.TransactionProtocolParameters;

    private static _namiObj?: Wallet.RawCIP30WalletInterface;

    private static _namiInterface?: Wallet.WalletInterface;

    private static _NamiWallet?: Wallet.Wallet;

    private static _ccvaultObj?: Wallet.RawCIP30WalletInterface;

    private static _ccvaultInterface?: Wallet.WalletInterface;
    
    private static _CCVaultWallet?: Wallet.Wallet;

    private static _flintObj?: Wallet.RawCIP30WalletInterface;

    private static _flintInterface?: Wallet.WalletInterface;
    
    private static _flintWallet?: Wallet.Wallet;

    private static _yoroiObj?: Wallet.RawCIP30WalletInterface;

    private static _yoroiInterface?: Wallet.WalletInterface;

    private static _yoroiWallet?: Wallet.Wallet;

    private static _geroObj?: Wallet.RawCIP30WalletInterface;

    private static _geroInterface?: Wallet.WalletInterface;

    private static _geroWallet?: Wallet.Wallet;


    /**
     * checks for a defined window object
     * @throws {WalletInterfaceError} if typeof window === "undefined" evaluates to true
     */
    static _assertBrowser(): void


    /**
     * wallets enumerative object
     */
    static Names: Readonly<{
        Nami: Wallet.WalletStringName,
        CCVault: Wallet.WalletStringName,
        Flint: Wallet.WalletStringName,
        Yoroi: Wallet.WalletStringName,
        Gero: Wallet.WalletStringName,
        Typhon: Wallet.WalletStringName,
        Cardwallet: Wallet.WalletStringName
    }>;
    
    /**
     * wallet names in string type
     */
    static stringNames: Readonly<Wallet.WalletStringName[]>;
    
    /**
         * uselesshere unly for retro compatibility
         */
    static utils: {
        /**
         * uselesshere unly for retro compatibility
         */
        getStringFromWalletName: ( walletName: Wallet.WalletStringName ) => Wallet.WalletStringName ,
        /**
         * uselesshere unly for retro compatibility
         */
        getWalletNameFromString: ( stringName: Wallet.WalletStringName ) => Wallet.WalletStringName
    }

    /**
     * 
     * @param {string} blockfrost_project_id blockforst api key to be used
     */
    static setBlockfrost( blockfrost_project_id: string ): void;

    /**
     * @requires Wallet.setBlockfrost to have been called with a valid argument before
     * 
     * makes a blockfrost api call and returns a Promise of the response
     * see the [Blockfrost documentation](https://docs.blockfrost.io/) to see the valid enpoints.   
     * refer to https://docs.blockfrost.io/
     * @param {string} endpoint 
     * @param headers 
     * @param body 
     * @returns 
     */
    static makeBlockfrostRequest( endpoint: string, headers?: object, body?: object ): Promise<any>

    /**
     * 
     * @returns {boolean} true if Wallet.getProtocolParameters has ever been called, false otherwise
     */
    static hasProtocolParameters(): boolean

    /**
     * 
     * 
     * @param {string | undefined} blockfrost_project_id optional blocfrost api key to use as api key if no prtocolParameters object has been found before
     * @throws {WalletProcessError} if no api key was founded
     * @returns {Promise<Wallet.TransactionProtocolParameters>}
     */
    static getProtocolParameters( blockfrost_project_id ?: string ) : Promise<Wallet.TransactionProtocolParameters>

    /**
     * sync version of ```Wallet.getProtocolParameters```
     * @throws {WalletInterfaceError} if no protocolParameters object was found
     * prefer ```await Wallet.getProtocolParameters()``` if possible
     */
    static get protocolParameters() : Wallet.TransactionProtocolParameters
   
    /**
     * 
     * @param {Wallet.WalletStringName} wallet member of the WalletStringName enumerative object
     * @returns {boolean} ```true``` of the extension has been injected, ```false``` otherwise
     */
    static has( wallet : Wallet.Wallet.WalletStringName ) : boolean;

    /**
     * 
     * @param {Wallet.WalletStringName} wallet: element of Wallet.name enumerative object 
     * @returns {Wallet.Wallet} the dApp connecctor corresponding to the name
     */
    static get( wallet: Wallet.WalletStringName ): Wallet.Wallet

    /**
     * 
     * @param {Wallet.WalletStringName} wallet: element of Wallet.name enumerative object
     * @returns {Wallet.WalletInterface} initial API that allows enabling wallet
     */
    static getInterface( wallet: Wallet.WalletStringName ): Wallet.WalletInterface

    /**
     * 
     * @param {Wallet.WalletStringName} wallet member of the WalletStringName enumerative object
     */
    static enable( wallet : Wallet.WalletStringName ) : Promise<void>;

    /**
     * calls internally the ```isEnabled()``` defined in the CIP-0030
     * if the promise result is true then the Wallet accessor will be aviable without the need to call ```Wallet.enable( WalletStringName.Wallet )```.
     * may be useful to understand when a user has already connected the given wallet to the website in a previous session
     * @param {Wallet.WalletStringName} wallet member of the WalletStringName enumerative object
     * @returns {Promise<boolean>} same as window.cardano.isEnabled()
     */
    static isEnabled( wallet : Wallet.WalletStringName ) : Promise<boolean>;

    /**
     * 
     * @param {Wallet.WalletStringName} wallet member of the WalletStringName enumerative object
     * @returns {boolean} if the Wallet object is aviable
     */
    static isAviable( wallet : Wallet.WalletStringName ) : boolean;

    // ---------------------------------------- Nami ---------------------------------------- //

    /**
     * 
     */
     static get NamiInterface() : Wallet.WalletInterface
    
    /**
     * 
     */
    static get Nami() : Wallet.Wallet

    
    // ---------------------------------------- ccvault ---------------------------------------- //
    /**
     * 
     */
    static get CCVaultInterface() : Wallet.WalletInterface

    /**
     * 
     */
    static get CCVault(): Wallet.Wallet


    // ---------------------------------------- Yoroi ---------------------------------------- //

    /**
     * 
     */
    static get FlintInterface() : Wallet.WalletInterface

    /**
     * 
     */
    static get Flint() : Wallet.Wallet

    // ---------------------------------------- Yoroi ---------------------------------------- //
    /**
     * 
     */
    static get YoroiInterface() : Wallet.WalletInterface

    /**
     * 
     */
    static get Yoroi(): Wallet.Wallet

    // ---------------------------------------- gerowallet ---------------------------------------- //
    static pageIsGeroWalletFriendly(): boolean

    /**
     * 
     */
     static get GeroInterface() : Wallet.WalletInterface
    
    /**
     * 
     */
    static get Gero(): Wallet.Wallet

  // ---------------------------------------- typhon ---------------------------------------- //

  static get TyphonInterface() : Wallet.WalletInterface

  static get Typhon() : Wallet.Wallet

  // ---------------------------------------- cardwallet ---------------------------------------- //


  static get CardwalletInterface() : Wallet.WalletInterface

  static get Cardwallet() : Wallet.Wallet

}



declare namespace Wallet {

    export type WalletName = symbol;

    export type WalletStringName =
        "Nami"          |
        "ccvault"       |
        "Flint"         |
        "yoroi"         | 
        "GeroWallet"    |
        "Typhon Wallet" |
        "CardWallet"
    ;

    export namespace CardanoTypes {
        export type BaseAddress = string
    }

    export interface TransactionProtocolParameters {
        // TODO
    }

    export type cbor<val = any> =  string;
    export type address =  string;
    export type hash32 =  string;
    export type Bytes = Buffer;
    export type Paginate = object
    export type value = any;
    export type UTxO = cbor<value>
    export type Sig_structure = any;

    export interface RawCIP30WalletInterface {
        /**
         * may vary depending from the extension
         */
        exerimental: object
        //enable: () => Promise<any>,
        //isEnabled: () => Promise<boolean>,
        //apiVersion?: string,
        //name?: string,
        //icon?: string,
        getNetworkId: () => Promise<number>,
        getBalance: () => Promise<cbor<value>>,
        getUsedAddresses: (paginate?: Paginate) => Promise<cbor<address>[]>,
        getUnusedAddresses: () => Promise<cbor<address>[]>,
        getChangeAddress: () => Promise<cbor<address>>,
        getRewardAddresses: () => Promise<cbor<address>[]>,
        getUtxos:(amount?: cbor<value>, paginate?: Paginate) => Promise<TransactionUnspentOutput[] | undefined>,
        signTx: (tx: cbor<Transaction>, partialSign: boolean ) => Promise<cbor<TransactionWitnessSet>>,
        signData: (addr: cbor<address>, sigStructure: cbor<Sig_structure>) => Promise<Bytes>,
        submitTx: (tx: cbor<Transaction>) => Promise<hash32>
        // getCollateral is still experimental in some wallets
        getCollateral: () => Promise<UTxO[]>
    }

    export interface WalletInterface
    {
        apiVersion: string
        icon:       string
        name:       string
        isInjected:     () => boolean
        enable:         () => Promise<void>
        isEnabled:      () => Promise<boolean>
        isAviable:      () => boolean
    }
    
    export interface Wallet
    {
        raw: RawCIP30WalletInterface;
        getCurrentUserDelegation: ( blockfrost_project_id?: string ) => Promise<object>,
        createDelegagtionTransaction: ( targetPoolId?: string, blockfrost_project_id?: string) => Promise<Transaction>,
        signTransaction: ( transactionToSign: Transaction ) => Promise<Transaction>,
        submitTransaction:  ( signedTransaction: Transaction ) => Promise<string>,
        // getPoolId,
        delegateTo: ( targetPoolId: string, blockfrost_project_id?: string ) => Promise<string>
    }

    /*
    export interface NamiEventController
    {
        remove: () => void
    }

    export interface NamiInterface extends Wallet
    {
        onAccountChange: ( callback: (addresses : [CardanoTypes.BaseAddress]) => void ) => NamiEventController
        onNetworkChange: ( callback: (network : number) => void ) => NamiEventController
    }
    */
}
