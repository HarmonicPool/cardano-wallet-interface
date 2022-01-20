# Wallet

### static class

## Contents
- [How to use the Wallet documentation](#how_to_use)
- [Top level functions](#top_level_functions)
- [Wallet common Interface](#wallet_common_interface)
    - [Making sure a wallet is aviable](#check_for_wallet)
        - [has]
        - [isAviable]
        - [isEnabled]
        - [enable]
        - [WalletInterface]
    - [Wallet object](#wallet_object)
- [Wallet specific](#wallet_specific)
    - [Nami](#nami_specific)
    - [ccvalut](#ccvalut_specific)
    - [flintExperimental](#flintExperimental_specific)

<a name="how_to_use">
</a>
<h2>How to use the Wallet documentation</h2>

#### curly brackets abstraction

since multiple functions behave similarly with the only difference for the wallet in use the following abstraction has benn introdced

```YourWallet``` ->  ```Nami``` | ```CCVault```  | ```FlintExperimental``` | ```Yoroi``` | ```Gero```
```yourWallet``` ->  ```nami``` | ```ccvault```  | ```flintExperimental``` | ```yoroi``` | ```gero```

**PLEASE PAY ATTENTION TO THE CAPITAL LETTERS**

as an example then ```Wallet.YourWallet``` here in the documentation will be intended as ```Wallet.Nami``` or ```Wallet.CCVault``` or ```Wallet.FlintExperimental``` depending from the desired wallet.

and similarly ```Wallet.YourWallet.isEnabled()``` should be intended respectively ```Wallet.Nami.isEnabled()```, ```Wallet.CCVautl.isEnabled()``` and so on.

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

see the [Blockfrost documentation](https://docs.blockfrost.io/) to see the valid enpoints.

###### hasProtocolParameters

```ts
static hasProtocolParameters() : boolean
```

returns ```true``` if a protocol parameters object needed for creating transaction is aviable, false otherwise 

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

###### has

```ts
static has( WalletName_member: symbol ): boolean
```

checks if the extension for the wallet is aviable;
returns ```true``` if the extension was found, ```false``` otherwise


###### isAviable

```ts
static isAviable( WalletName_member: symbol ): boolean
```

returns ```true``` if the ```Wallet.YourWallet``` is accessible, ```false``` otherwise

> **_NOTE:_**  calling this accessor **is differtent** than calling Wallet.YourWalletInterface.isEnabled(), which internally calls ```window.cardano.yourWallet.isEnabled()``` defined in the CIP30.

###### isEnabled

```ts
static async Wallet.isEnabled( WalletName_member: symbol ): boolean
```
calls internally the ```isEnabled()``` [defined in the CIP-0030](https://github.com/cardano-foundation/CIPs/tree/master/CIP-0030#cardanowalletnameisenabled-promisebool)

if the promise result is true then the ```YourWallet``` accessor will be aviable without the need to call ```Wallet.YourWallet.enable()```.

this method may be useful to understand when a user has already connected the given wallet to the website in a previous session


###### enable

```ts
static async enable( WalletName_member: symbol )): void
```

tries to call ```.enable()``` on the chosen wallet, then makes aviable the accessor ```Wallet.YourWallet```  

> **_SIDE EFFECT:_**  calling ```.enable()```([defined in the CIP30](https://github.com/cardano-foundation/CIPs/tree/master/CIP-0030#cardanowalletnameenable-promiseapi)) will likely open a window asking for the user to connect the wallet,
this wont appen if the wallet is already connected; you can check if that's the case via ```Wallet.YourWallet.isEnabled()```.

###### WalletInterface

```ts
static get YourWalletInterface(): Wallet.WalletInterface
```

as you'll find tin the typedefinition below an object that respect the ```Wallet.WalletInterface``` interface simpli umplements the above four functions without the need to use ( and the to import ) the ```WalletName``` enum object


###### Wallet

```ts
static get YourWallet() : Wallet.Wallet // returns a Wallet object described below
```

access the wallet functionalities.

<a name="wallet_object">
</a>
<h4>Wallet.WalletInterface</h4>

getting a Wallet object from the ```Wallet``` static class returns an istance of the ```Wallet.WalletInterface``` interface,
so defined:

```ts
// defined in the Wallet namespace

namespace CardanoTypes {
    export type BaseAddress = string
}

interface RawCIP30WalletInterface
{
    // may vary depending from the extension
    exerimental: object
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

interface WalletInterface
{
    apiVersion: string
    icon:       string
    name:       string
    isInjected:     () => boolean
    enable:         () => Promise<void>
    isEnabled:      () => Promise<boolean>
    isAviable:      () => boolean
}

interface Wallet
{
    raw: RawCIP30WalletInterface;
    getCurrentUserDelegation: ( blockfrost_project_id?: string ) => Promise<object>,
    createDelegagtionTransaction: ( targetPoolId?: string, blockfrost_project_id?: string) => Promise<Transaction>,
    signTransaction: ( transactionToSign: Transaction ) => Promise<Transaction>,
    submitTransaction:  ( signedTransaction: Transaction ) => Promise<string>,
    delegateTo: ( targetPoolId: string, blockfrost_project_id?: string ) => Promise<string>
}

```
so anything needed will be aviable using the syntax: ```Wallet.YourWallet```;

for the ```Wallet.RawCIP30WalletInterface``` documentation refer to [CIP-0030](https://github.com/cardano-foundation/CIPs/tree/master/CIP-0030) itself.
