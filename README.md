# cardano-wallet-interface
##### brought to you by [Harmonic Pool](https://harmonicpool.on.fleek.co/)

## Thank you

**This softweare exists thanks to Harmonic delegators an supporters**

### How can I support?

- [delegate ADA to Harmonic Pool](https://harmonicpool.on.fleek.co/delegate/)
- donate ADA to : ```addr1qxm09exmyl04yhh67rvvmp2zauq32p8g7v60wtv03ved7t8h2y992ly7znq5q8ckurcpum0dc8kaunpkysnlnzzhw0pqd875p8```
- contribute building this repository
- contribute building a greather Cardano with any repository of Harmonic Pool

## Contents
- [Installation](#Installation)
- [supported wallets](#supported)
- [Usage](#Usage)
    - [basic usage](#basic_usage)
        - [access a generic wallet](#acces_wallet)
        - [simple delegation](#simple_delegation)
    - [other examples](#oth_examples)
- [Documentation](#docs_link)

## Installation

run the following in your project directory

```bash
npm install https://github.com/HarmonicPool/cardano-wallet-interface
```

<a name="supported">
</a>
<h2>supported wallets</h2>

here's a list of supported wallet, if you notice a Cardano wallet that support dApp connector is missing, feel free to [send a mail here](mailto:harmonic.pool@protonmail.com)

- [Nami](https://namiwallet.io/)
- [CCVault](https://ccvault.io/)
- [Flint](https://flint-wallet.com/)
- [Yoroi](https://yoroi-wallet.com/#/)
- [Gero Wallet](https://www.gerowallet.io/)
- [Typhon](https://typhonwallet.io/#/)
- [CardWallet](https://cardwallet.fi/)


## Usage

<a name="basic_usage">
</a>
<h4>basic usage</h4>


<a name="acces_wallet">
</a>
<h4>access a generic wallet</h4>

```js
let Typhon = undefined;
const ITyphon = Wallet.getInterface( Wallet.Names.Typhon );

if( 
    ITyphon.isInjected() // equivalent to ```Wallet.has( Wallet.Names.Typhon )```
)
{
    if(
        ITyphon.isAviable() // if enabled before returns true, no need to perform async calls
    )
    {
        Typhon = Wallet.Typhon; // Wallet.get( Wallet.Names.Typhon ) will do the same
    }
}
else // async code needed
{
    if(
        await ITyphon.isEnabled() // @returns {Promise<boolean>} as per CIP0030 definition
    )
    {
        Typhon = Wallet.Typhon; // same as before
    }
    else
    {
        await Wallet.enable( Wallet.Names.Typhon ); // makes the object aviable
        Typhon = Wallet.Typhon; // same as before
    }
}
```


<a name="simple_delegation">
</a>

##### simple delegation

> **_NOTE:_** every other wallet will work the same way, just change the name (eg. ```Nami``` -> ```CCVault``` )

```js
/*... other imports ...*/
import Wallet from "@harmonicpool/cardano-wallet-interface";

/*...*/

if( Wallet.has( Wallet.Names.Nami ) )
{
    if( !await Wallet.isEnabled( Wallet.Names.Nami ) )
    {
        Wallet.enable( Wallet.Names.Nami )
        .then(
            () => {
                Wallet.Nami.delegateTo(
                    "<your pool id>",
                    "<your blockforst api key>"
                );
            }
        );
    }
    else
    {
        Wallet.Nami.delegateTo(
            "<your pool id>",
            "<your blockforst api key>"
        );
    }
}

/*...*/
```

have a look at [documentation/examples/Wallets iteration.md]() to understand how to generalize the process for more wallets

<a name="oth_examples">
</a>
<h4>other examples</h4>

check the [documentation/examples](https://github.com/HarmonicPool/cardano-wallet-interface/tree/main/documentation/examples) folder for more


<a name="docs_link">
</a>
<h2>Documentation</h2>

a more in depth documentation can be found in the [documentation folder](https://github.com/HarmonicPool/cardano-wallet-interface/tree/main/documentation)
