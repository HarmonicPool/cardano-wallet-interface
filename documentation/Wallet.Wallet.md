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

### getCurrentUserDelegation

```getCurrentUserDelegation``` performs a blockfrost call to the ```/accounts/${rewardAddress}``` endpoint, where ```rewardAddress``` is retreived using ```raw.getRewardAddress()```

### signTransaction & submitTransaction

wrappers around the CIP-0030 defined ones, where address handling is done by default

often used in pair as
```js
await submitTransaction(
    await signTransaction(
        /* your transaction */
    )
)
```

### delegateTo

the definition should be self explanatory

```js
const delegateTo = async ( targetPoolId, blockfrost_project_id = undefined ) => 
{
    return await submitTransaction(
        await signTransaction(
            await createDelegagtionTransaction(
                targetPoolId,
                blockfrost_project_id
            )
        )
    );
}
```