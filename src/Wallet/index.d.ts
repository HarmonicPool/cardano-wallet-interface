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

    private static _NamiInterface?: Wallet.WalletInterface;

    private static _ccvaultObj?: Wallet.RawCIP30WalletInterface;
    
    private static _CCVaultInterface?: Wallet.WalletInterface;

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
     * @throws {WalletError} if no protocolParameters object was found
     * prefer ```await Wallet.getProtocolParameters()``` if possible
     */
    static get protocolParameters() : Wallet.TransactionProtocolParameters
   


    // ---------------------------------------- Nami ---------------------------------------- //

    /**
     * checks if the nami extension is aviable
     * @returns {boolean} true if the nami extension has injected the window.cardano.enable function; false otherwise
     */
    static hasNami(): boolean
    
    /**
     * tries to call ```.enable()``` on the chosen wallet, if successful makes aviable the accessor ```Wallet.{Wallet}```
     */
    static enableNami(): Promise<void>

    /**
     * NOTE the result of this accessor may differ from calling Wallet.{wallet}IsEnabled()
     * only checks if the ```Wallet.{Wallet}``` is accessible
     * @returns {boolean} ```true``` if the ```Wallet.{Wallet}``` is accessible, ```false``` otherwise
     */
    static get namiHasBeenEnabled() : boolean

    /**
     * calls internally the ```isEnabled()``` defined in the CIP-0030
     * if the promise result is true then the ```Wallet.Nami``` accessor will be aviable without the need to call ```Wallet.enable{Wallet}()```.
     * may be useful to understand when a user has already connected the given wallet to the website in a previous session
     * @returns {Promise<boolean>} same as window.cardano.isEnabled()
     */
    static namiIsEnabled(): Promise<boolean>

    /**
     * 
     */
    static get Nami() : Wallet.NamiInterface

    
    // ---------------------------------------- ccvault ---------------------------------------- //
    /**
     * checks if the ccvault extension is aviable
     * @returns {boolean} true if the ccvault extension has injected the window.cardano.ccvault object; false otherwise
     */
    static hasCCVault(): boolean

    /**
     * tries to call ```window.cardano.ccvault.enable()``` if successful makes aviable the accessor ```Wallet.{Wallet}```
     */
    static enableCCVault(): Promise<void>

    /**
     * NOTE the result of this accessor may differ from calling Wallet.ccvaultIsEnabled()
     * only checks if the ```Wallet.CCVault``` is accessible
     * @returns {boolean} ```true``` if the ```Wallet.CCVault``` is accessible, ```false``` otherwise
     */
    static get ccvaultHasBeenEnabled(): boolean

    /**
     * calls internally the ```isEnabled()``` defined in the CIP-0030
     * if the promise result is true then the ```Wallet.CCVault``` accessor will be aviable without the need to call ```Wallet.enableCCVault()```.
     * may be useful to understand when a user has already connected the given wallet to the website in a previous session
     * @returns {Promise<boolean>} same as window.cardano.ccvault.isEnabled()
     */
    static ccvaultlIsEnabled(): Promise<boolean>

    /**
     * 
     */
    static get CCVault(): Wallet.WalletInterface

    // ---------------------------------------- flintExperimental ---------------------------------------- //

    /**
     * checks for the others extension supported
     * @throws {FlintExperimentalError} if either Wallet.hasNami() or Wallet.hasCCVault() evaluates to true.
     */
    static _assertFlintExperimentalOnly() : void

    /**
     * checks if the flintExperimental extension is aviable
     * @returns {boolean} true if the flintExperimental extension has injected the window.cardano.flintExperimental object; false otherwise
     */
    static hasFlintExperimental() : boolean

    /**
     * tries to call ```window.cardano.flintExperimental.enable()``` if successful makes aviable the accessor ```Wallet.{Wallet}```
     */
    static enableFlintExperimental(): Promise<void>

    /**
     * NOTE the result of this accessor may differ from calling Wallet.flintExperimentalIsEnabled()
     * only checks if the ```Wallet.FlintExperimental``` is accessible
     * @returns {boolean} ```true``` if the ```Wallet.FlintExperimental``` is accessible, ```false``` otherwise
     */
    static get flintExperimentalHasBeenEnabled(): boolean

    /**
     * calls internally the ```isEnabled()``` defined in the CIP-0030
     * if the promise result is true then the ```Wallet.FlintExperimental``` accessor will be aviable without the need to call ```Wallet.enableFlintExperimental()```.
     * may be useful to understand when a user has already connected the given wallet to the website in a previous session
     * @returns {Promise<boolean>} same as window.cardano.flintExperimental.isEnabled()
     */
    static flintExperimentalIsEnabled(): Promise<boolean>

    static get FlintExperimental(): Wallet.WalletInterface

}



declare namespace Wallet {

    export type WalletName = "nami" | "ccvault" | "flintEperimental";

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
        enable: () => Promise<any>,
        isEnabled: () => Promise<boolean>,
        apiVersion?: string,
        name?: string,
        icon?: string,
        getNetworkId: () => Promise<number>,
        getUtxos:(amount?: cbor<value>, paginate?: Paginate) => Promise<TransactionUnspentOutput[] | undefined>,
        getBalance: () => Promise<cbor<value>>,
        getUsedAddresses: (paginate?: Paginate) => Promise<cbor<address>[]>,
        getUnusedAddresses: () => Promise<cbor<address>[]>,
        getChangeAddress: () => Promise<cbor<address>>,
        getRewardAddresses: () => Promise<cbor<address>[]>,
        signTx: (tx: cbor<Transaction>, partialSign: boolean ) => Promise<cbor<TransactionWitnessSet>>,
        signData: (addr: cbor<address>, sigStructure: cbor<Sig_structure>) => Promise<Bytes>,
        submitTx: (tx: cbor<Transaction>) => Promise<hash32>
    }

    export interface WalletInterface extends RawCIP30WalletInterface
    {
        getCurrentUserDelegation: ( blockfrost_project_id?: string ) => Promise<object>,
        createDelegagtionTransaction: ( targetPoolId?: string, blockfrost_project_id?: string) => Promise<Transaction>,
        signTransaction: ( transactionToSign: Transaction ) => Promise<Transaction>,
        submitTransaction:  ( signedTransaction: Transaction ) => Promise<string>,
        // getPoolId,
        delegateTo: ( targetPoolId: string, blockfrost_project_id?: string ) => Promise<string>
    }

    export interface NamiEventController
    {
        remove: () => void
    }

    export interface NamiInterface extends WalletInterface
    {
        onAccountChange: ( callback: (addresses : [CardanoTypes.BaseAddress]) => void ) => NamiEventController
        onNetworkChange: ( callback: (network : number) => void ) => NamiEventController
    }
}
