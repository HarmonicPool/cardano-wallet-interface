# static methods

### has

```ts
static has( WalletName_member: string ): boolean
```

checks if the extension for the wallet has been injected;
returns ```true``` if the extension was found, ```false``` otherwise


### isAviable

```ts
static isAviable( WalletName_member: string ): boolean
```

returns ```true``` if the ```Wallet.YourWallet``` is accessible, ```false``` otherwise

> **_NOTE:_**  calling this accessor **is differtent** than calling Wallet.YourWalletInterface.isEnabled(), which internally calls ```window.cardano.yourWallet.isEnabled()``` defined in the CIP30.

### isEnabled

```ts
static Wallet.isEnabled( WalletName_member: string ): Promise<boolean>
```
calls internally the ```isEnabled()``` [defined in the CIP-0030](https://github.com/cardano-foundation/CIPs/tree/master/CIP-0030#cardanowalletnameisenabled-promisebool)

if the promise result is true then the ```YourWallet``` accessor will be aviable without the need to call ```Wallet.YourWallet.enable()```.

this method may be useful to understand when a user has already connected the given wallet to the website in a previous session


### enable

```ts
static enable( WalletName_member: string )): Promise<void>
```

tries to call ```.enable()``` on the chosen wallet, then makes aviable the accessor ```Wallet.YourWallet```  

> **_SIDE EFFECT:_**  calling ```.enable()```([defined in the CIP30](https://github.com/cardano-foundation/CIPs/tree/master/CIP-0030#cardanowalletnameenable-promiseapi)) will likely open a window asking for the user to connect the wallet,
this wont appen if the wallet is already connected; you can check if that's the case via ```Wallet.YourWallet.isEnabled()```.


### get

```ts
static get( WalletName_member: string ): Wallet.Wallet
```

returns ```Wallet.YourWallet``` if accessible, **throws** otherwise

> **_BEST PRACTICE:_** check ```Wallet.isAviable( WalletName_member )``` to return ```true``` to be sure no error will be thrown

check also [Wallet.Wallet](https://github.com/HarmonicPool/cardano-wallet-interface/blob/main/documentation/Wallet.Wallet.md) to know how to use the returned object

### getInterface

```ts
static getInterface( WalletName_member: string ): Wallet.WalletInterface
```

returns ```Wallet.YourWalletInterface```

check also [Wallet.WalletInterface](https://github.com/HarmonicPool/cardano-wallet-interface/blob/main/documentation/Wallet.WalletInterface.md) to know how to use the returned object
