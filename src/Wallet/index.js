const Buffer = require("buffer").Buffer;
const Loader = require("./WasmLoader");
const CoinSelection = require("./CoinSelection");
const StringFormatError = require("../errors/WalletInterfaceError/StringFormatError/StringFormatError");
const WalletInterfaceError = require("../errors/WalletInterfaceError/WalletInterfaceError");
const NamiError = require("../errors/WalletInterfaceError/WalletProcessError/WalletError/NamiError/NamiError");
const CCVaultError = require("../errors/WalletInterfaceError/WalletProcessError/WalletError/CCVaultError/CCVaultError");
const WalletError = require("../errors/WalletInterfaceError/WalletProcessError/WalletError/WalletError");
const WalletProcessError = require("../errors/WalletInterfaceError/WalletProcessError/WalletProcessError");

let private_walletInterface_hasBlockFrost = false;

class Wallet
{
  /**
   * @private
   */
  static _api_key = undefined;

  /**
   * @private
   */
  static _protocolParameters = undefined;

  /**
   * @private
   */
  static _namiObj = undefined;

  /**
   * @private
   */
  static _NamiInterface = undefined;

  
  /**
   * @private
   */
  static _ccvaultObj = undefined;
  
  /**
   * @private
   */
  static _CCVaultInterface = undefined;

  /**
   * 
   * @param {string} blockfrost_project_id blockforst api key to be used
   */
  static setBlockfrost( blockfrost_project_id )
  {    
    if( typeof blockfrost_project_id !== "string" ) throw StringFormatError("blockfrost_project_id must be a string")
    
    Wallet._api_key = blockfrost_project_id;
    
    private_walletInterface_hasBlockFrost = true;
  }
  
  static async makeBlockfrostRequest( endpoint, headers, body )
  {
    if( !private_walletInterface_hasBlockFrost ) throw new WalletProcessError("Wallet.setBlockfrost has not been called, can't use Wallet.makeBlockfrostRequest")
    return await private_blockfrostRequest( Wallet._api_key, endpoint, headers, body );
  }

  static hasProtocolParameters()
  {
    return ( Wallet._protocolParameters !== undefined );
  }

  static async getProtocolParameters( blockfrost_project_id = undefined )
  {

    if( !Wallet.hasProtocolParameters() )
    {
      let api_key_toUse = "";

      if( typeof blockfrost_project_id === "string" )
      {
        api_key_toUse = blockfrost_project_id;
      }
      else
      {
        if( !private_walletInterface_hasBlockFrost ) throw new WalletProcessError("Wallet.setBlockfrost has not been called, can't use Wallet.getProtocolParameters")

        api_key_toUse = Wallet._api_key;
      }

      Wallet._protocolParameters = await private_getProtocolParameters( api_key_toUse );
    }

    return Wallet._protocolParameters;
  }

  static get protocolParameters()
  {
    if( !Wallet.hasProtocolParameters() ) throw new WalletError("protocoloParameters never checked before, call the async version Wallet.getProtocolParameters first");
    
    return Wallet._protocolParameters;
  }


  // ---------------------------------------- Nami ---------------------------------------- //

  /**
   * 
   * @returns {boolean} true if the nami extension has injected the window.cardano.enable function; false otherwise
   */
  static hasNami()
  {
    if( typeof window === "undefined" ) throw new WalletInterfaceError("can check for nami extension on in a browser environment");

    // if only ccvault was installed but not nami
    // then window.cardano would still be defined but containing onli the ccvault object
    // here I check for window.cardano.enable to be defined but could be any function defined
    // by the nami extension
    return ( typeof window.cardano?.enable !== "undefined" );
  }

  static async enableNami()
  {
    if( !Wallet.hasNami() ) throw new NamiError("can't access the Nami object if the nami extension is not installed");

    if( await window.cardano.isEnabled() || await window.cardano.enable() )
      Wallet._namiObj = window.cardano;
    else
      Wallet._namiObj = undefined;
  }

  static get namiHasBeenEnabled()
  {
    return ( Wallet._namiObj !== undefined )
  }

  static get Nami()
  {
    if( !Wallet.hasNami() ) throw new NamiError("can't access the Nami object if the nami extension is not installed");
    if( !Wallet.namiHasBeenEnabled ) throw new NamiError("Wallet.enableNami has never been called before, can't access the Nami interface");

    if( Wallet._NamiInterface === undefined )
    {
      Wallet._NamiInterface = private_makeWalletInterface( Wallet._namiObj, Wallet._api_key )
    }

    return Wallet._NamiInterface;
  }
  
  // ---------------------------------------- ccvault ---------------------------------------- //
  /**
   * 
   * @returns {boolean} true if the ccvault extension has injected the window.cardano.ccvault object; false otherwise
   */
  static hasCCVault()
  {
    if( typeof window === "undefined" ) throw new WalletInterfaceError("can check for CCVault extension on in a browser environment");

    return !!window.cardano?.ccvault;
  }

  static async enableCCVault()
  {
    if( !Wallet.hasCCVault() ) throw new CCVaultError("can't access the CCVault object if the CCVault extension is not installed");

    try
    {
      Wallet._ccvaultObj = await window.cardano.ccvault.enable();
    }
    catch (e)
    {
      console.warn("could not enable CCVault");
      Wallet._ccvaultObj = undefined;
      throw e;
    }
  }

  static get ccvaultHasBeenEnabled()
  {
    return ( Wallet._ccvaultObj !== undefined )
  }

  static get CCVault()
  {
    if( !Wallet.hasCCVault() ) throw new CCVaultError("can't access the CCVault object if the CCVault extension is not installed");
    if( !Wallet.ccvaultHasBeenEnabled ) throw new CCVaultError("Wallet.enableCCVault has never been called before, can't access the CCVault interface");

    if( Wallet._CCVaultInterface === undefined )
    {
      Wallet._CCVaultInterface = private_makeWalletInterface( Wallet._ccvaultObj, Wallet._api_key )
    }

    return Wallet._CCVaultInterface;
  }

}

function private_makeWalletInterface( WalletProvider, defaultBlockfrost_api_key )
{
  const getCurrentUserDelegation = async ( blockfrost_project_id = undefined ) =>
  {
    if( !(blockfrost_project_id || defaultBlockfrost_api_key) ) throw new NamiError("no blockfrost api key was provvided, please set a default one by calling Wallet.setBlockfrost or pass one as a parameter");

    if( typeof blockfrost_project_id !== "string" )
    {
      if( typeof defaultBlockfrost_api_key !== "string" ) throw new NamiError("no blockfrost api key is valid");

      return await private_getCurrentUserDelegation( WalletProvider, defaultBlockfrost_api_key )
    }
    else
    {
      return await private_getCurrentUserDelegation( WalletProvider, blockfrost_project_id )
    }
  }

  const createDelegagtionTransaction = async ( targetPoolId, blockfrost_project_id = undefined ) => {
    if( typeof targetPoolId !== "string" ) throw StringFormatError("in order to delegate to a pool you must provvide a valid pool id string;  pool id was: " + targetPoolId );
    if( !targetPoolId.startsWith("pool") ) throw StringFormatError("you must use the bech 32 pool id, perhaps you provvided the hex pool id? input was: " + targetPoolId );

    return await private_delegationTransaction(
      blockfrost_project_id,
      WalletProvider,
      await getCurrentUserDelegation( blockfrost_project_id ),
      targetPoolId
    )
  };

  const signTransaction = async ( transactionToSign ) =>
  {
    return await private_signTransaction( WalletProvider, transactionToSign );
  }

  const submitTransaction = async ( signedTransaction ) =>
  {
    return await private_submitTransaction( WalletProvider, signedTransaction )
  }

  const delegateTo= async ( targetPoolId, blockfrost_project_id = undefined ) => 
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

  return {
    ...WalletProvider,
    getCurrentUserDelegation,
    createDelegagtionTransaction,
    signTransaction,
    submitTransaction,
    getPoolId: private_getPoolId,
    delegateTo
  }
}

async function private_blockfrostRequest( blockfrost_project_id, endpoint, headers, body )
{
  if( typeof blockfrost_project_id !== "string" ) throw Error;

  return await fetch(
    `https://cardano-mainnet.blockfrost.io/api/v0` + endpoint,
    {
      headers: { project_id: blockfrost_project_id },
    }
  ).then((res) => res.json());
};


async function private_getProtocolParameters( blockfrost_project_id )
{
  if( typeof blockfrost_project_id !== "string" ) throw Error;

  await Loader.load();

  const p = await private_blockfrostRequest( blockfrost_project_id,"/epochs/latest/parameters" );

  return {
    linearFee: Loader.Cardano.LinearFee.new(
      Loader.Cardano.BigNum.from_str(p.min_fee_a.toString()),
      Loader.Cardano.BigNum.from_str(p.min_fee_b.toString())
    ),
    minUtxo: Loader.Cardano.BigNum.from_str(p.min_utxo),
    poolDeposit: Loader.Cardano.BigNum.from_str(p.pool_deposit),
    keyDeposit: Loader.Cardano.BigNum.from_str(p.key_deposit),
    maxValueSize: p.max_val_size,
    maxTxSize: p.max_tx_size,
  };
};


function private_getPoolId( bech32_poolId )
{
  return Buffer.from(Loader.Cardano.Ed25519KeyHash.from_bech32(poolId).to_bytes(), "hex").toString("hex")
}


async function private_getRewardAddress ( WalletProvider )
{
  const getRewardAddress =
  // nami
  WalletProvider.getRewardAddress || 
  // CCVault
  WalletProvider.getRewardAddresses

  if( typeof getRewardAddress !== "function" )
  throw WalletProcessError(
  "could not find reward address or addresses, probably this is not your fault and the package may need mainatainance, \
  please open an issue at https://github.com/HarmonicPool/cardano-wallet-interface/issues"
  );

  let rawAddress = await getRewardAddress();

  if (rawAddress === undefined)
  console.warn("GOT YA")

  if( Array.isArray(rawAddress) )
  {
    rawAddress = rawAddress[0];
  }
  
  if( typeof rawAddress !== "string" )
  throw WalletProcessError(
    "bad request for getting user reward address, probably not your fault, pleas open an issue explaining what appened here: https://github.com/HarmonicPool/cardano-wallet-interface/issues"
  );

  return rawAddress;
}

async function private_delegationTransaction( blockfrost_project_id, WalletProvider, delegation, targetPoolId)
{
  await Loader.load();
  const protocolParameters = await private_getProtocolParameters( blockfrost_project_id );

  let address = (await WalletProvider.getUsedAddresses())[0];

  if( address === undefined )
  {
    throw new WalletProcessError("Seems like the user has no used addresses, please found the using wallet")
  }

  address = Loader.Cardano.Address.from_bytes(Buffer.from(address, "hex"));

  const rewardAddress = await private_getRewardAddress( WalletProvider );

  const stakeCredential = Loader.Cardano.RewardAddress.from_address(
    Loader.Cardano.Address.from_bytes(Buffer.from(rewardAddress, "hex"))
  ).payment_cred();

  let utxos = await WalletProvider.getUtxos();

  utxos = utxos.map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(Buffer.from(utxo, "hex"))
  );

  //estimated max multiasset size 5848
  //estimated max value size 5860
  //estimated max utxo size 5980
  const MULTIASSET_SIZE = 5848;
  const VALUE_SIZE = 5860;

  const outputs = Loader.Cardano.TransactionOutputs.new();
  outputs.add(
    Loader.Cardano.TransactionOutput.new(
      address,
      Loader.Cardano.Value.new(protocolParameters.keyDeposit)
    )
  );

  const selection = await CoinSelection.randomImprove(
    utxos,
    outputs,
    20,
    protocolParameters.minUtxo.to_str()
  );

  const inputs = selection.input;

  const txBuilder = Loader.Cardano.TransactionBuilder.new(
    protocolParameters.linearFee,
    protocolParameters.minUtxo,
    protocolParameters.poolDeposit,
    protocolParameters.keyDeposit,
    protocolParameters.maxValueSize,
    protocolParameters.maxTxSize
  );

  for (let i = 0; i < inputs.length; i++) {
    const utxo = inputs[i];
    txBuilder.add_input(
      utxo.output().address(),
      utxo.input(),
      utxo.output().amount()
    );
  }

  const certificates = Loader.Cardano.Certificates.new();
  if (!delegation.active)
    certificates.add(
      Loader.Cardano.Certificate.new_stake_registration(
        Loader.Cardano.StakeRegistration.new(stakeCredential)
      )
    );

  certificates.add(
    Loader.Cardano.Certificate.new_stake_delegation(
      Loader.Cardano.StakeDelegation.new(
        stakeCredential,
        Loader.Cardano.Ed25519KeyHash.from_bech32(targetPoolId)
      )
    )
  );
  txBuilder.set_certs(certificates);

  const change = selection.change;
  const changeMultiAssets = change.multiasset();

  // check if change value is too big for single output
  if (changeMultiAssets && change.to_bytes().length * 2 > VALUE_SIZE) {
    const partialChange = Loader.Cardano.Value.new(
      Loader.Cardano.BigNum.from_str("0")
    );

    const partialMultiAssets = Loader.Cardano.MultiAsset.new();
    const policies = changeMultiAssets.keys();
    const makeSplit = () => {
      for (let j = 0; j < changeMultiAssets.len(); j++) {
        const policy = policies.get(j);
        const policyAssets = changeMultiAssets.get(policy);
        const assetNames = policyAssets.keys();
        const assets = Loader.Cardano.Assets.new();
        for (let k = 0; k < assetNames.len(); k++) {
          const policyAsset = assetNames.get(k);
          const quantity = policyAssets.get(policyAsset);
          assets.insert(policyAsset, quantity);
          //check size
          const checkMultiAssets = Loader.Cardano.MultiAsset.from_bytes(
            partialMultiAssets.to_bytes()
          );
          checkMultiAssets.insert(policy, assets);
          if (checkMultiAssets.to_bytes().length * 2 >= MULTIASSET_SIZE) {
            partialMultiAssets.insert(policy, assets);
            return;
          }
        }
        partialMultiAssets.insert(policy, assets);
      }
    };
    makeSplit();
    partialChange.set_multiasset(partialMultiAssets);
    const minAda = Loader.Cardano.min_ada_required(
      partialChange,
      protocolParameters.minUtxo
    );
    partialChange.set_coin(minAda);

    txBuilder.add_output(
      Loader.Cardano.TransactionOutput.new(address, partialChange)
    );
  }

  txBuilder.add_change_if_needed(address);

  const transaction = Loader.Cardano.Transaction.new(
    txBuilder.build(),
    Loader.Cardano.TransactionWitnessSet.new()
  );

  const size = transaction.to_bytes().length * 2;
  if (size > protocolParameters.maxTxSize) throw ERROR.txTooBig;

  return transaction;
};

async function private_signTransaction( WalletProvider, transactionObj )
{
  await Loader.load();

  // the transaction is signed ( by the witnesess )
  return await Loader.Cardano.Transaction.new(
    transactionObj.body(),
    // get witnesses object
    Loader.Cardano.TransactionWitnessSet.from_bytes(
      Buffer.from(
        // gets witnesses
        await WalletProvider.signTx(
          Buffer.from(transactionObj.to_bytes(), "hex").toString("hex")
        ),
        "hex"
      )
    )
  );
};

/**
 * 
 * @param {object} WalletProvider an object respecting the CIP30 dApp connector interface 
 * @param {Transaction} signedTransaction 
 * @returns {string} the transaction has you can use to check transaction status
 */
async function private_submitTransaction( WalletProvider, signedTransaction )
{
  // returns the transaction hash
  return await WalletProvider.submitTx(
    Buffer.from( signedTransaction.to_bytes(), "hex").toString("hex")
  );
};

async function private_getRewardAddress_bech32( WalletProvider )
{
  return await Loader.Cardano.Address.from_bytes(
    Buffer.from( await private_getRewardAddress( WalletProvider ), "hex")
  ).to_bech32();
}

async function private_getCurrentUserDelegation( WalletProvider, blockfrost_project_id ){
  await Loader.load();

  const rewardAddress = await private_getRewardAddress_bech32( WalletProvider );

  const stake = await private_blockfrostRequest( blockfrost_project_id, `/accounts/${rewardAddress}`);

  if (!stake || stake.error || !stake.pool_id) return {};

  return stake;
};

// allows import { Wallet } from "@harmonicpool/cardano-wallet-interface";
Wallet.Wallet = Wallet;
// for strict ES Module import Wallet from "@harmonicpool/cardano-wallet-interface";
Wallet.default  = Wallet;
// exports default
module.exports = Wallet;