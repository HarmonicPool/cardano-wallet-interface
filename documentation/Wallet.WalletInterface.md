# Wallet.WalletInterface

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
