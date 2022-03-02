# Blockchain related

### setBlockfrost

```ts
static setBlockfrost( blockfrost_project_id : string ) : void
```
sets a common blockfrost api key, tough you can pass it each time needed, is good parctice call this method at least once in order to reduce rendundancy.
some methods also reqire to call this one first, if you don't plan to use any of them it should not be a problem.

### makeBlockfrostRequest

```ts
static async makeBlockfrostRequest( endpoint: string, headers?: string, body?: string ): any
```

> **_IMPORTANT:_** requires ```Wallet.setBlockfrost("<your api key>")``` to have been called before.


makes a blockfrost api call and returns a Promise of the response

see the [Blockfrost documentation](https://docs.blockfrost.io/) to see the valid enpoints.

### hasProtocolParameters

```ts
static hasProtocolParameters() : boolean
```

returns ```true``` if a protocol parameters object needed for creating transaction is aviable, false otherwise 

### getProtocolParameters

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

