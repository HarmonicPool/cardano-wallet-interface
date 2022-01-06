# cardano-wallet-interface
##### brought to you by Harmonic Pool

## Contents
- [Prerequisites](#Prerequisites)
- [Installation](#Installation)
- [Usage](#Usage)
    - [basic usage](#basic_delegation)
        - [nami delegation](#delegate_using_nami)
        - [ccvault delegation](#delegate_using_ccvault)
    - [other examples](#oth_examples)
- [Support Harmonic](#Support)

## Prerequisites

make sure to enable web-assembly if not configured by default.

You may find some help at [documentation/known_issues/allowing_webassembly.md](https://github.com/HarmonicPool/cardano-wallet-interface/blob/main/documentation/knownIssues/allowing_webassembly.md)

## Installation

make sure you have a folder called ```node_modules``` in your project

run the following in your project directory

```bash
npm install https://github.com/HarmonicPool/cardano-wallet-interface
```

## Usage

<a name="basic_delegation">
</a>
<h4>basic delegation functionality</h4>

<a name="delegate_using_nami">
</a>

##### using Nami
```js
/*... other imports ...*/
import { Wallet } from "@harmonicpool/cardano-wallet-interface";

/*...*/

if( Wallet.hasNami() )
{
    if( !Wallet.namiHasBeenEnabled )
    {
        Wallet.enableNami()
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

<a name="delegate_using_ccvault">
</a>

##### using ccvault
```js
/*... other imports ...*/
import { Wallet } from "@harmonicpool/cardano-wallet-interface";

/*...*/

if( Wallet.hasCCVault() )
{
    if( !Wallet.ccvaultHasBeenEnabled )
    {
        Wallet.enableCCVault()
        .then(
            () => {
                Wallet.CCVault.delegateTo(
                    "<your pool id>",
                    "<your blockforst api key>"
                );
            }
        );
    }
    else
    {
        Wallet.CCVault.delegateTo(
            "<your pool id>",
            "<your blockforst api key>"
        );
    }
}

/*...*/
```

<a name="oth_examples">
</a>
<h4>other examples</h4>

check the [documentation/examples](https://github.com/HarmonicPool/cardano-wallet-interface/tree/main/documentation/examples) folder for more

<a name="Support">
</a>
<h2>Support Harmonic</h2>


Any code correction you may find useful is a great form of support for all the Cardano community, you can send them to the [Harmonic Pool mail](mailto:harmonic.pool@protonmail.com)


other great forms to show support are:
 - [delegating to Harmonic Pool](https://harmonicpool.on.fleek.co/delegate/)
 - donating ADA to the following address that delegates to Harmonic:

```addr1qxyryaacjdwau64wyf5truhq2akuc50dunrzlpj82pcjjkwpcdn8a48cpt55dp9d7wc8khg8aksheu62u4nhrdtgddeqd4r83d```

any of the above will be really appreciated \<3
