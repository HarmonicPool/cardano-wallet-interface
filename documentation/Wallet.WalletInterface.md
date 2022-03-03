# Wallet.WalletInterface

as defined in [src/Wallet/index.d.ts]()

```ts
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

```

where:
- ```apiVersion```, ```icon``` and ```name``` respects the CIP-0030 standards
- ```isEnabled``` acts as the CIP-0030
- ```enable``` makes aviable the wallet in the ```Wallet``` static class; same as calling ```Wallet.enable( Wallet.Names.YourWWallet )```
- ```isInjected``` acts as ```Wallet.has( Wallet.Names.YourWallet )```
- ```isAviable``` acts as ```Wallet.isAviable( Wallet.Names.YourWallet )```