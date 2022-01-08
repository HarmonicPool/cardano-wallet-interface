# Wallet

### static class

## Contents
- [Top level functions](#top_level_functions)
- [Wallet common Interface](#wallet_common_interface)
    - [Making sure a wallet is aviable](#check_for_wallet)
    - [Wallet object](#wallet_object)
- [Wallet specific](#wallet_specific)
    - [Nami](#nami_specific)
    - [ccvalut](#ccvalut_specific)
    - [flintExperimental](#flintExperimental_specific)

<a name="top_level_functions">
</a>
<h2>Top level functions</h2>

###### setBlockfrost

```ts
static setBlockfrost( blockfrost_project_id : string ) : void
```
sets a common blockfrost api key, tough you can pass it each time needed, is good parctice call this method at least once in order to reduce rendundancy.
some methods also reqire to call this one first, if you don't plan to use any of them it should not be a problem.

###### makeBlockfrostRequest

```ts
static async makeBlockfrostRequest( endpoint: string, headers?: string, body?: string ): any
```

> **_IMPORTANT:_** requires ```Wallet.setBlockfrost("<your api key>")``` to have been called before.


makes a blockfrost api call and returns a Promise of the response

se the [Blockfrost documentation](https://docs.blockfrost.io/) to see the valid enpoints.

###### hasProtocolParameters

```ts
static hasProtocolParameters() : boolean
```

returns ```true``` if a protocol parameters object needed for creating transaction s aviable, false otherwise 

###### getProtocolParameters

```ts
static async getProtocolParameters( blockfrost_project_id ?: string ) : object
```

takes an optional ```blockfrost_project_id ?: string``` to use as api key if no _prtocolParameters_ object has been found before;
if not provvided and no _prtocolParameters_ object is present tries to use the key setted via ```Wallet.setBlockfrost("<your api key>")```
finally throws a [WalletProcessError]() if no api key was founded

returns ```Promise<object>``` where ```object``` are the protocol parameters needed to make transactions

##### protocolParameters
```ts
// may throw
static get protocolParameters() : object
```
sync version of ```Wallet.getProtocolParameters```throws if no protocolParameters object was found

> **_BEST PRACTICE:_** prefer the Wallet.getProtocolParameter asyncronous function whenever possible



<a name="wallet_common_interface">
</a>
<h2>Wallet common Interface</h2>

here we'll see how to interact with a Wallet object

<a name="check_for_wallet">
</a>
<h4>Making sure a wallet is aviable</h4>

the following methods / properties are accessible via the Wallet static class directly

> **_NOTE:_**  here in the documentation we'll use a generic "Wallet" as Wallet provider name, please be sure to substitute "Wallet" with the one you are willing to use; as an example "Wallet.enableWallet()" will be "Wallet.enableNami()" if you plan to use _Nami_, or "Wallet.enableCCValut()" if you use _ccvalut_ instead

###### hasWallet

```ts
static hasWallet(): boolean
```

checks if the extension for the wallet is aviable;
returns ```true``` if the extension was found, ```false``` otherwise

###### enableWallet

```ts
static async enableWallet(): void
```

tries to call ```.enable()``` on the chosen wallet, then makes aviable the accessor ```Wallet.{YourWallet}```  

> **_SIDE EFFECT:_**  calling ```.enable()```(defined in the CIP30) will likely open a window asking for the user to connect the wallet,
this wont appen if the wallet is alreadi connected; iou can check if that's the case via ```.isEnabled()```.


###### walletHasBeenEnabled

```ts
static get walletHasBeenEnabled(): boolean
```

returns ```true``` if the ```Wallet.{YourWallet}``` is accessible, ```false``` otherwise

> **_NOTE:_**  calling this accessor **is differtent** than calling Wallet.{YourWallet}.isEnabled(), defined in the CIP30.

> **_REMINDER:_**  the name of the accessor becomes ```Wallet.namiHasBeenEnabled``` for **Nami**; ```Wallet.ccvalutHasBeenEnabled```for **ccvalut**


###### Wallet

```ts
static get Wallet() : object // returns a Wallet object described below
```

access the wallet functionalities.

<a name="wallet_object">
</a>
<h4>Wallet.WalletInterface</h4>

getting a Wallet object from the ```Wallet``` static class returns an istance of the ```Wallet.WalletInterface``` interface,
so defined:

```ts

namespace CardanoTypes {
    export type BaseAddress = string
}

interface RawCIP30WalletInterface
{
    enable: () => Promise<any>,
    isEnabled: () => Promise<boolean>,
    apiVersion?: string,
    name?: string,
    icon?: string,
    getNetworkId: () => Promise<number>,
    getUtxos:(amount: cbor<value> = undefined, paginate: Paginate = undefined) => Promise<TransactionUnspentOutput[] | undefined>,
    getBalance: () => Promise<cbor<value>>,
    getUsedAddresses: (paginate: Paginate = undefined) => Promise<cbor<address>[]>,
    getUnusedAddresses: () => Promise<cbor<address>[]>,
    getChangeAddress: () => Promise<cbor<address>>,
    getRewardAddresses: () => Promise<cbor<address>[]>,
    signTx: (tx: cbor<transaction>, partialSign: bool = false) => Promise<cbor<transaction_witness_set>>,
    signData: (addr: cbor<address>, sigStructure: cbor<Sig_structure>) => Promise<Bytes>,
    submitTx: (tx: cbor<transaction>) => Promise<hash32>
}

interface WalletInterface extends RawCIP30WalletInterface
{
    // ...WalletProvider, <-- CIP30 
    getCurrentUserDelegation: ( blockfrost_project_id?: string = undefined ) => Promise<object>,
    createDelegagtionTransaction: ( targetPoolId?: string, blockfrost_project_id?: string = undefined ) => Promise<Transaction>,
    signTransaction: ( transactionToSign: Transaction ) => Promise<Transaction>,
    submitTransaction:  ( signedTransaction: Transaction ) => Promise<string>,
    delegateTo: ( targetPoolId: string, blockfrost_project_id?: string = undefined ) => Promise<string>
}

```
so anything needed will be aviable using the syntax: ```Wallet.{YourWallet}```;

for the ```Wallet.RawCIP30WalletInterface``` refer to the [CIP-0030](https://github.com/cardano-foundation/CIPs/tree/master/CIP-0030) itself.

<a name="wallet_specific">
</a>
<h2>Wallet specific</h2>


<a name="nami_specific">
</a>
<h4>Nami</h4>

###### Wallet Interface return object

the Nami wallet interface is extended as follows

```ts
static get Nami() : Wallet.NamiInterface
```

```ts

interface NamiEventController
{
    remove: () => void
}

interface NamiInterface extends WalletInterface
{
    onAccountChange: ( callback: (addresses : [CardanoTypes.BaseAddress]) => void ) => NamiEventController
    onNetworkChange: ( callback: (network : number) => void ) => NamiEventController
}

```

therfore it supports the ```onAccountChange``` and ```onNetworkChange``` event listeners;
check out the [Nami wallet documentation](https://github.com/Berry-Pool/nami-wallet#cardanoonaccountchangeaddresses) for further informations.

<a name="ccvalut_specific">
</a>
<h4>ccvalut</h4>

<a name="flintExperimental_specific">
</a>
<h4>flintExperimental</h4>