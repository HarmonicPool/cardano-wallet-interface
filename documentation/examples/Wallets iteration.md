# Wallets iteration

Often you may want to be able an action on all wallets aviable (eg. checking if it has been ingected );

this can easly be done with a simple ```for``` loop iterating over ```Wallet.stringNames``` array as follows

> **_NOTE:_** it is assumed that all the wallet are already enabled

```js
for( let i = 0; i < Wallet.stringNames.length; i++ )
{
    const thisCycleWallet = Wallet.get( Wallet.stringNames[i] );

    doStuffWithWallet( thisCycleWallet );
}
```

this way we can also define our own utility function such as:

```js
function allWalletsAreInjected()
{
    return Wallet.stringNames.every(
        wName => Wallet.has( wName )
    );
}
```

> **_NOTE:_** ```Array.every``` acts as ```arr.map( arrElem => hasProperty( arrElem ) ).reduce( (a,b) => a && b , true )``` but should be overall more efficient since it does not have to test every element but can return ```false``` at the first element that is indeed ```false```
>
>[Array.prototype.every documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
