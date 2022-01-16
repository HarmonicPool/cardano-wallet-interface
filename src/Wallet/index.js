"use strict";

const Buffer = require("buffer").Buffer;

const Loader        = require("./WasmLoader");
const CoinSelection = require("./CoinSelection");

const StringFormatError = require("../errors/WalletInterfaceError/StringFormatError/StringFormatError");

const WalletInterfaceError    = require("../errors/WalletInterfaceError/WalletInterfaceError");
const NamiError               = require("../errors/WalletInterfaceError/WalletProcessError/WalletError/NamiError/NamiError");
const CCVaultError            = require("../errors/WalletInterfaceError/WalletProcessError/WalletError/CCVaultError/CCVaultError");
const FlintExperimentalError  = require("../errors/WalletInterfaceError/WalletProcessError//WalletError/FlintExperimentalError/FlintExperimentalError");
const WalletError             = require("../errors/WalletInterfaceError/WalletProcessError/WalletError/WalletError");
const WalletProcessError      = require("../errors/WalletInterfaceError/WalletProcessError/WalletProcessError");

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

  // ---------------------------------------- nami objects ---------------------------------------- //
  /**
   * @private
   */
  static _namiObj = undefined;

  /**
   * @private
   */
  static _NamiInterface = undefined;

  // ---------------------------------------- ccvault objects ---------------------------------------- //
  
  /**
   * @private
   */
  static _ccvaultObj = undefined;
  
  /**
   * @private
   */
  static _CCVaultInterface = undefined;

  // ---------------------------------------- flint objects ---------------------------------------- //

  /**
   * @private
   */
   static _flintExperimentalObj = undefined;
  
   /**
    * @private
    */
   static _flintExperimentalInterface = undefined;

   // ---------------------------------------- flint objects ---------------------------------------- //

  /**
   * @private
   */
    static _yoroiObj = undefined;

    /**
    * @private
    */
    static _yoroiInterface = undefined;

  // ---------------------------------------- wallet utils ---------------------------------------- //

  static _assertBrowser()
  {
    if( typeof window === "undefined" ) throw new WalletInterfaceError("can check for any cardano wallet extension only in a browser environment");
  }

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
    Wallet._assertBrowser();

    // if only ccvault was installed but not nami
    // then window.cardano would still be defined but containing onli the ccvault object
    // here I check for window.cardano.enable to be defined but could be any function defined
    // by the nami extension
    // DEPRECATED SINCE FLINT_EXPERIMENTAL return ( typeof window.cardano?.enable !== "undefined" );

    const tmpEvtController = window.cardano?.onAccountChange(console.log);

    // since from the addition of FlintExperimental window.cardano.enable gets ingìjected too is no more a valid way to check for nami
    // if Nami is injected correctly the return type of window.cardano?.onAccountChange(<anyFunc>) is {Wallet.NamiEventController} object
    // if Nami is not injected but flintEcperimental is, the return type is undefined.
    if ( typeof tmpEvtController !== "undefined" )
    {
      tmpEvtController.remove();
      return true;
    }

    return false;
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

  static async namiIsEnabled()
  {
    if( !Wallet.hasNami() ) throw new CCVaultError("can't access the CCVault object if the CCVault extension is not installed");

    if( await window.cardano?.isEnabled() )
    {
      // sets the _ccvaultObj static property
      Wallet.enableNami();
      return true;
    }
    else return false;

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
    Wallet._assertBrowser();

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

  static async ccvaultIsEnabled()
  {
    if( !Wallet.hasCCVault() ) throw new CCVaultError("can't access the CCVault object if the CCVault extension is not installed");

    if( await window.cardano?.ccvault.isEnabled() )
    {
      // sets the _ccvaultObj static property
      Wallet.enableCCVault();
      return true;
    }
    else return false;

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

  // ---------------------------------------- flintExperimental ---------------------------------------- //

  static _assertFlintExperimentalOnly()
  {
    if( Wallet.hasNami() || Wallet.hasCCVault() )
    throw new FlintExperimentalError(
      "flintExperimental only works if is the only extension injected, please ask to disable all other cardano wallets extension and to refresh the page in order to work with flintExperimental"
    );
  }

  /**
   * 
   * @returns {boolean} true if the flintExperimental extension has injected the window.cardano.flintExperimental object; false otherwise
   */
  static hasFlintExperimental()
  {
    Wallet._assertBrowser();
    Wallet._assertFlintExperimentalOnly();

    return !!window.cardano?.flintExperimental;
  }
 
  static async enableFlintExperimental()
  {
    Wallet._assertFlintExperimentalOnly();
    if( !Wallet.hasFlintExperimental() ) throw new FlintExperimentalError("can't access the flintExperimental object if the flintExperimental extension is not installed");

    try
    {
      let enableResult = await window.cardano?.flintExperimental.enable();

      if(enableResult)
      {
        Wallet._flintExperimentalObj = window.cardano;
      }
    }
    catch (e)
    {
      console.warn("could not enable flintExperimental");
      Wallet._flintExperimentalObj = undefined;
      throw e;
    }
  }
 
  static get flintExperimentalHasBeenEnabled()
  {
    Wallet._assertFlintExperimentalOnly();
    return ( Wallet._flintExperimentalObj !== undefined )
  }

  static async flintExperimentalIsEnabled()
  {
    Wallet._assertFlintExperimentalOnly();
    if( !Wallet.hasFlintExperimental() ) throw new FlintExperimentalError("can't access the flintExperimental object if the flintExperimental extension is not installed");

    if( await window.cardano?.flintExperimental.isEnabled() )
    {
      // sets the _flintExperimentalObj static property
      Wallet.enableFlintExperimental();
      return true;
    }
    else return false;

  }

  static get FlintExperimental()
  {
    Wallet._assertFlintExperimentalOnly();
    if( !Wallet.hasFlintExperimental() ) throw new FlintExperimentalError("can't access the flintExperimental object if the flintExperimental extension is not installed");
    if( !Wallet.flintExperimentalHasBeenEnabled ) throw new FlintExperimentalError("Wallet.enableFlintExperimental has never been called before, can't access the flintExperimental interface");

    if( Wallet._flintExperimentalInterface === undefined )
    {
      Wallet._flintExperimentalInterface = private_makeWalletInterface( Wallet._flintExperimentalObj, Wallet._api_key )
    }

    return Wallet._flintExperimentalInterface;
  }

  // ---------------------------------------- yoroi ---------------------------------------- //
  static _makeSureYoroiIsInjectedCorrectly()
  {
    Wallet._assertBrowser();

    if(!private_performedYoroiReInjection)
    {
      private_injectYoroi();
    }
  }

  static hasYoroi()
  {
    Wallet._assertBrowser();
    
    return !!window.cardano?.yoroi;
  }

  static async enableYoroi()
  {
    if( !Wallet.hasYoroi() ) throw new WalletInterfaceError("can't access the Yoroi object if the Yoroi extension is not installed");

    try
    {
      Wallet._makeSureYoroiIsInjectedCorrectly();
      Wallet._yoroiObj = await window.cardano.yoroi.enable();
      Wallet._yoroiObj = {
        ...Wallet._yoroiObj,
        enable: window.cardano.yoroi.enable,
        isEnabled: window.cardano.yoroi.isEnabled
      }
    }
    catch (e)
    {
      console.warn("could not enable Yoroi");
      Wallet._yoroiObj = undefined;
      throw e;
    }
  }

  static get yoroiHasBeenEnabled()
  {
    return ( Wallet._yoroiObj !== undefined )
  }

  static async yoroiIsEnabled()
  {
    if( !Wallet.hasYoroi() ) throw new WalletInterfaceError("can't access the flintExperimental object if the flintExperimental extension is not installed");

    Wallet._makeSureYoroiIsInjectedCorrectly();
    if( await window.cardano?.yoroi.isEnabled() )
    {
      // sets the _flintExperimentalObj static property
      Wallet.enableYoroi();
      return true;
    }
    else return false;

  }

  static get Yoroi()
  {
    if( !Wallet.hasYoroi() ) throw new WalletInterfaceError("can't access the Yoroi object if the Yoroi nigthly extension is not installed");
    if( !Wallet.yoroiHasBeenEnabled ) throw new WalletInterfaceError("Wallet.enableYoroi has never been called before, can't access the Yoroi interface");

    if( Wallet._yoroiInterface === undefined )
    {
      Wallet._yoroiInterface = private_makeWalletInterface( Wallet._yoroiObj, Wallet._api_key )
    }

    return Wallet._yoroiInterface;
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
  // nami || flintExperimental
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

/**
 * 
 */
let private_performedYoroiReInjection = false
/**
 * this function only injectsyoroi if the extension is present already
 * this injection corrects some bugs present in the extension
 */
function private_injectYoroi()
{
  if( !window?.cardnao?.yoroi ) throw WalletProcessError("could not perform bug correction injection of yoroi if yoroi nightly is not installed");

  var connectRequests = [];

  window.addEventListener("message", function(event) {
    if (event.data.type == "connector_connected") {
      if (event.data.err !== undefined) {
        connectRequests.forEach(promise => promise.reject(event.data.err));
      } else {
        const isSuccess = event.data.success;
        connectRequests.forEach(promise => {
            if (promise.protocol === 'cardano') {
                if (isSuccess) {
                    promise.resolve(event.data.auth);
                } else {
                    promise.reject(new Error('user reject'));
                }
            } else {
                promise.resolve(isSuccess);
            }
        });
      }
    }
  });

  window.ergo_request_read_access = function() {
    return new Promise(function(resolve, reject) {
      window.postMessage({
        type: "connector_connect_request/ergo",
      }, location.origin);
      connectRequests.push({ resolve: resolve, reject: reject });
    });
  };

  window.ergo_check_read_access = function() {
    if (typeof ergo !== "undefined") {
      return ergo._ergo_rpc_call("ping", []);
    } else {
      return Promise.resolve(false);
    }
  };

  // RPC setup
  var cardanoRpcUid = 0;
  var cardanoRpcResolver = new Map();

  window.addEventListener("message", function(event) {
    if (event.data.type == "connector_rpc_response" && event.data.protocol === "cardano") {
      console.debug("page received from connector: " + JSON.stringify(event.data) + " with source = " + event.source + " and origin = " + event.origin);
      const rpcPromise = cardanoRpcResolver.get(event.data.uid);
      if (rpcPromise !== undefined) {
        const ret = event.data.return;
        if (ret.err !== undefined) {
          rpcPromise.reject(ret.err);
        } else {
          rpcPromise.resolve(ret.ok);
        }
      }
    }
  });
  
  function cardano_rpc_call(func, params) {
    return new Promise(function(resolve, reject) {
      window.postMessage({
        type: "connector_rpc_request",
        protocol: "cardano",
        uid: cardanoRpcUid,
        function: func,
        params: params
      }, location.origin);
      console.debug("cardanoRpcUid = " + cardanoRpcUid);
      cardanoRpcResolver.set(cardanoRpcUid, { resolve: resolve, reject: reject });
      cardanoRpcUid += 1;
    });
  }

  function cardano_request_read_access(cardanoAccessRequest) {
    const { requestIdentification, onlySilent } = (cardanoAccessRequest || {});
    return new Promise(function(resolve, reject) {
      window.postMessage({
        type: "connector_connect_request/cardano",
        requestIdentification,
        onlySilent,
      }, location.origin);
      connectRequests.push({
        protocol: 'cardano',
        resolve: (auth) => {
            resolve(Object.freeze(new CardanoAPI(auth, cardano_rpc_call)));
        },
        reject: reject
      });
    });
  }

  function cardano_check_read_access() {
    if (typeof cardano !== "undefined") {
      //return cardano._cardano_rpc_call("ping", []);
      /**
       * original call was ```cardano._cardano_rpc_call("ping", []);```
       * however no such function is present until window.cardano.yoroi.enable() evaluates to true
       * which makes useless "window.cardano.yoroi.isEnabled()" in this case
       */
      return cardano_rpc_call("ping", []);
    } else {
      return Promise.resolve(false);
    }
  }
  
  window.cardano = {
    ...(window.cardano||{}),
    'yoroi': {
      enable: cardano_request_read_access,
      isEnabled: cardano_check_read_access,
      apiVersion: '0.2.0',
      name: 'yoroi',
    }
  };
  
  private_performedYoroiReInjection = true;
}

// exports default
module.exports = Wallet;