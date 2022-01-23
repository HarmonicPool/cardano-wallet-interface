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

    private static _NamiWallet?: Wallet.Wallet;

    private static _ccvaultObj?: Wallet.RawCIP30WalletInterface;
    
    private static _CCVaultWallet?: Wallet.Wallet;

    private static _flintExperimentalObj?: Wallet.RawCIP30WalletInterface;
    
    private static _flintExperimentalWallet?: Wallet.Wallet;

    private static _yoroiObj?: Wallet.RawCIP30WalletInterface;

    private static _yoroiWallet?: Wallet.Wallet;

    private static _geroObj?: Wallet.RawCIP30WalletInterface;

    private static _geroWallet?: Wallet.Wallet;


    /**
     * checks for a defined window object
     * @throws {WalletInterfaceError} if typeof window === "undefined" evaluates to true
     */
    static _assertBrowser(): void

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
     * @param {Wallet.WalletName} wallet member of the WalletName enumerative object
     * @returns {boolean} ```true``` of the extension has been injected, ```false``` otherwise
     */
    static has( wallet : Wallet.WalletName ) : boolean;

    /**
     * 
     * @param {Wallet.WalletName} wallet member of the WalletName enumerative object
     */
    static enable( wallet : Wallet.WalletName ) : Promise<void>;

    /**
     * calls internally the ```isEnabled()``` defined in the CIP-0030
     * if the promise result is true then the Wallet accessor will be aviable without the need to call ```Wallet.enable( WalletName.Wallet )```.
     * may be useful to understand when a user has already connected the given wallet to the website in a previous session
     * @param {Wallet.WalletName} wallet member of the WalletName enumerative object
     * @returns {Promise<boolean>} same as window.cardano.isEnabled()
     */
    static isEnabled( wallet : Wallet.WalletName ) : Promise<boolean>;

    /**
     * 
     * @param {Wallet.WalletName} wallet member of the WalletName enumerative object
     * @returns {boolean} if the Wallet object is aviable
     */
    static isAviable( wallet : Wallet.WalletName ) : boolean;

    // ---------------------------------------- Nami ---------------------------------------- //

    /**
   * @deprecated use Wallet.has( WalletName.Nami ) instead
   * @returns {boolean} true if the nami extension has injected the window.cardano.enable function; false otherwise
   */
    static hasNami(): boolean
    
    /**
   * @deprecated use Wallet.enable( WalletName.Nami ) instead
   */
    static enableNami(): Promise<void>

    /**
   * @deprecated use Wallet.isAviable( WalletName.Nami ) instead
   */
    static get namiHasBeenEnabled() : boolean

    
    /**
   * 
   * @deprecated use Wallet.isEnabled( WalletName.Nami ) instead
   */
    static namiIsEnabled(): Promise<boolean>

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
   * @deprecated use Wallet.has( WalletName.CCVault ) instead
   * @returns {boolean} true if the ccvault extension has injected the window.cardano.ccvault object; false otherwise
   */
    static hasCCVault(): boolean

    /**
   * @deprecated use Wallet.enable( WalletName.CCVault ) instead
   */
    static enableCCVault(): Promise<void>

    /**
   * @deprecated use Wallet.isAviable( WalletName.CCVault ) instead
   */
    static get ccvaultHasBeenEnabled(): boolean

    /**
   * 
   * @deprecated use Wallet.isEnabled( WalletName.CCVault ) instead
   */
    static ccvaultIsEnabled(): Promise<boolean>

    /**
     * 
     */
    static get CCVaultInterface() : Wallet.WalletInterface

    /**
     * 
     */
    static get CCVault(): Wallet.Wallet

    // ---------------------------------------- flintExperimental ---------------------------------------- //

    /**
     * checks for the others extension supported
     * @throws {FlintExperimentalError} if either Wallet.hasNami() or Wallet.hasCCVault() evaluates to true.
     */
    static _assertFlintExperimentalOnly() : void

    /**
   * @deprecated use Wallet.has( WalletName.FlintExperimental ) instead
   * @returns {boolean} true if the flintExperimental extension has injected the window.cardano.flintExperimental object; false otherwise
   */
    static hasFlintExperimental() : boolean

    /**
   * @deprecated use Wallet.enable( WalletName.FlintExperimental ) instead
   */
    static enableFlintExperimental(): Promise<void>

    /**
   * @deprecated use Wallet.isAviable( WalletName.FlintExperimental ) instead
   */
    static get flintExperimentalHasBeenEnabled(): boolean

    /**
   * 
   * @deprecated use Wallet.isEnabled( WalletName.FlintExperimental ) instead
   */
    static flintExperimentalIsEnabled(): Promise<boolean>

    /**
     * 
     */
    static get FlintExperimentalInterface() : Wallet.WalletInterface
    
    /**
     * 
     */
    static get FlintExperimental(): Wallet.Wallet


    /**
   * 
   * @deprecated use Wallet.has( WalletName.Yoroi ) instead
   */
    static hasYoroi(): boolean
        
    /**
     * @deprecated use Wallet.enable( WalletName.Yoroi ) instead
     */
    static enableYoroi(): Promise<void>

    /**
     * @deprecated use Wallet.isAviable( WalletName.Yoroi ) instead
     */
    static get yoroiHasBeenEnabled(): boolean

    /**
     * 
     * @deprecated use Wallet.isEnabled( WalletName.Yoroi ) instead
     */
    static yoroiIsEnabled(): Promise<boolean>

    /**
     * 
     */
    static get YoroiInterface() : Wallet.WalletInterface

    /**
     * 
     */
    static get Yoroi(): Wallet.Wallet

    // ---------------------------------------- gerowallet ---------------------------------------- //

    /**
     * 
     * @deprecated use Wallet.has( WalletName.Gero ) instead
     */
    static hasGero(): boolean

    static pageIsGeroWalletFriendly(): boolean

    /**
     * @deprecated use Wallet.enable( WalletName.Gero ) instead
     */
    static enableGero(): Promise<void>

    static get geroHasBeenEnabled(): boolean

    /**
     * 
     * @deprecated use Wallet.isEnabled( WalleName.Gero ) instead
     */
    static geroIsEnabled(): Promise<boolean>

    /**
     * 
     */
     static get GeroInterface() : Wallet.WalletInterface
    
    /**
     * 
     */
    static get Gero(): Wallet.Wallet
}



declare namespace Wallet {

    export type WalletName = symbol;

    export type WalletStringName = "Nami" | "ccvault" | "Flint Experimental" | "yoroi" | "GeroWallet" ;

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
