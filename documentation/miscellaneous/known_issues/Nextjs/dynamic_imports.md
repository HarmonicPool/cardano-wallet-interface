# Dynamic imports

since Nextjs bundles all js files in one single one in production for faster page loading; dependencies are solved used commonjs ```resolve("../path/to/package")``` calls

since the package exports using ESMoudles ```import``` and ```export``` syntax you may want to extract al the wallet logic in a single component and import it dynamically
using ```dynamic```([Nextjs documentation for ```dynamic```](https://nextjs.org/docs/advanced-features/dynamic-import))

simple example:
```ts
import dynamic from 'next/dynamic';
const MyWalletComponent = dynamic( 
    () => import("../path/to/MyWalletComponent.ts"),
    { /* dynamic options as in the Nextjs docs */}
);
```

check [this solved issue for more inforamtions](https://github.com/HarmonicPool/cardano-wallet-interface/issues/7#issuecomment-1055741326)
