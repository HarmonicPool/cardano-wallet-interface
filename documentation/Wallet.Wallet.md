# Wallet.Wallet

as defined in [src/Wallet/index.d.ts]()

```ts

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
    getUtxos:(amount?: cbor<value>, paginate?: Paginate) => Promise<cbor<TransactionUnspentOutput>[] | undefined>,
    signTx: (tx: cbor<Transaction>, partialSign: boolean ) => Promise<cbor<TransactionWitnessSet>>,
    signData: (addr: cbor<address>, sigStructure: cbor<Sig_structure>) => Promise<Bytes>,
    submitTx: (tx: cbor<Transaction>) => Promise<hash32>
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

for the ```Wallet.RawCIP30WalletInterface``` documentation refer to [CIP-0030](https://github.com/cardano-foundation/CIPs/tree/master/CIP-0030) itself.
