"use strict";

const Buffer = require("buffer").Buffer;

const Loader        = require("./WasmLoader");
const CoinSelection = require("./CoinSelection");

const StringFormatError = require("../errors/WalletInterfaceError/StringFormatError/StringFormatError");

const WalletInterfaceError    = require("../errors/WalletInterfaceError/WalletInterfaceError");
const NamiError               = require("../errors/WalletInterfaceError/WalletProcessError/WalletError/NamiError/NamiError");
const CCVaultError            = require("../errors/WalletInterfaceError/WalletProcessError/WalletError/CCVaultError/CCVaultError");
const FlintError              = require("../errors/WalletInterfaceError/WalletProcessError/WalletError/FlintError/FlintError");
const YoroiError              = require("../errors/WalletInterfaceError/WalletProcessError/WalletError/YoroiError/YoroiError");
const GeroError               = require("../errors/WalletInterfaceError/WalletProcessError/WalletError/GeroError/GeroError");
const TyphonError             = require("../errors/WalletInterfaceError/WalletProcessError/WalletError/TyphonError/TyphonError");
const CardwalletError         = require("../errors/WalletInterfaceError/WalletProcessError/WalletError/CardwalletError");
const WalletError             = require("../errors/WalletInterfaceError/WalletProcessError/WalletError/WalletError");
const WalletProcessError      = require("../errors/WalletInterfaceError/WalletProcessError/WalletProcessError");

const { WalletName } = require("./WalletName")
const { getStringFromWalletName, walletNames } =  require("./WalletName/utils");

function private_warnDeprecated(altSuggestion)
{
  console.error("this mthod will be deprecated soon" + ( altSuggestion ? ", please consider using " + altSuggestion + " instead" : "") );
}

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
   static _namiInterface = undefined;

  /**
   * @private
   */
  static _NamiWallet = undefined;

  // ---------------------------------------- ccvault objects ---------------------------------------- //
  
  /**
   * @private
   */
  static _ccvaultObj = undefined;

  /**
   * @private
   */
   static _ccvaultInterface = undefined;
  
  /**
   * @private
   */
  static _CCVaultWallet = undefined;


   // ---------------------------------------- flint objects ---------------------------------------- //

  /**
   * @private
   */
   static _flintObj = undefined;

   /**
   * @private
   */
    static _flintInterface = undefined;
  
   /**
    * @private
    */
   static _flintWallet = undefined;

   // ---------------------------------------- yoroi objects ---------------------------------------- //

  /**
   * @private
   */
    static _yoroiObj = undefined;

    /**
   * @private
   */
     static _yoroiInterface = undefined;

    /**
    * @private
    */
    static _yoroiWallet = undefined;

    // ---------------------------------------- gero objects ---------------------------------------- //

  /**
   * @private
   */
   static _geroObj = undefined;

   /**
   * @private
   */
    static _geroInterface = undefined;

   /**
   * @private
   */
   static _geroWallet = undefined;

  // ---------------------------------------- Typhon objects ---------------------------------------- //
  /**
   * @private
   */
  static _typhonObj = undefined;

  /**
   * @private
   */
   static _typhonInterface = undefined;

  /**
   * @private
   */
  static _TyphonWallet = undefined;

  // ---------------------------------------- cardWallet objects ---------------------------------------- //
  /**
   * @private
   */
   static _cardWalletObj = undefined;

   /**
    * @private
    */
    static _cardWalletInterface = undefined;
 
   /**
    * @private
    */
   static _CardWalletWallet = undefined;

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
    if( !Wallet.hasProtocolParameters() ) throw new WalletError("protocolParameters never checked before, call the async version Wallet.getProtocolParameters first");
    
    return Wallet._protocolParameters;
  }

  // ----------------------------------------------- Wallet common --------------------------------------------------- //

  static _assertWalletNameIsSym( walletSymbol )
  {
    if( typeof walletSymbol !== "symbol" ) throw WalletProcessError("a wallet identifier must be a member of the WalletName enumeration");
  }

  static _assertWalletExtensionInjected( walletSymbol )
  {
    Wallet._assertWalletNameIsSym( walletSymbol );
    const wName = getStringFromWalletName( walletSymbol );

    if( !Wallet.has( walletSymbol ) ) throw new WalletError("can't access the "+wName+" object if the "+wName+" extension is not installed");
  }
  
  /**
   * 
   * @param {symbol} wallet member of the WalletName enum object
   * @returns {boolean} ```true``` if the extension has been injected, ```false``` otherwise
   */
  static has( wallet )
  {
    Wallet._assertBrowser();
    Wallet._assertWalletNameIsSym( wallet );

    switch( wallet )
    {
      /*
      if you need to modify the cases please make sure
      any change is made also in the WalletName object
      */
      case WalletName.Nami:               return !!window?.cardano?.nami;
      case WalletName.CCVault:            return !!window?.cardano?.ccvault;
      case WalletName.Flint:              return !!window?.cardano?.flint;
      case WalletName.Yoroi:              return !!window?.cardano?.yoroi;
      case WalletName.Gero:               return !!window?.cardano?.gerowallet;
      case WalletName.Typhon:             return !!window?.cardano?.typhon;
      case WalletName.Cardwallet:         return !!window?.cardano?.cardwallet;

      default: throw new WalletProcessError("invalid argument; wallet name MUST be a member of the WalleName enumeration object")
    }
  }
  
  /**
   * 
   * @param {symbol} wallet member of the WalletName enum object
   */
  static async enable( wallet )
  {
    Wallet._assertWalletExtensionInjected( wallet );

    switch( wallet )
    {
      /*
      if you need to modify the cases please make sure
      any change is made also in the WalletName object
      */
      case WalletName.Nami:               
        Wallet._namiObj = await window.cardano.nami.enable();
        return; break;

      case WalletName.CCVault:            
        Wallet._ccvaultObj = await window.cardano.ccvault.enable();
        return; break;

      case WalletName.Flint:
        Wallet._flintObj = await window.cardano.flint.enable();
      return; break;

      case WalletName.Yoroi:              
        Wallet._yoroiObj = await window.cardano.yoroi.enable();
        return; break;

      case WalletName.Gero:               
        Wallet._geroObj = await window.cardano.gerowallet.enable();
        return; break;

      case WalletName.Typhon:
        let tResult =  await window.cardano.typhon.enable();
        if( tResult.satus )
        {
          Wallet._typhonObj = window.cardano.typhon
        }
        else throw TyphonError("user rejected typhon connection")
      return;
      break;
      case WalletName.Cardwallet:
        Wallet._cardWalletObj = await window.cardano.cardwallet.enable();
        return;
      break;

      default: throw new WalletProcessError("invalid argument; wallet name MUST be a member of the WalleName enumeration object")
    }
  }

  /**
   * 
   * @param {symbol} wallet member of the WalletName enum object
   * @returns {boolean} ```true``` if the user wallet is connected, ```false``` otherwise
   */
  static async isEnabled( wallet )
  {
    Wallet._assertWalletExtensionInjected( wallet );

    let walletIsEnabled = false;

    switch( wallet )
    {
      /*
      if you need to modify the cases please make sure
      any change is made also in the WalletName object
      */
      case WalletName.Nami:               
        walletIsEnabled = await window.cardano.nami.isEnabled();
      break;
        
      case WalletName.CCVault:            
        walletIsEnabled = await window.cardano.ccvault.isEnabled();
      break;
        
      case WalletName.Flint:
        walletIsEnabled = await window.cardano.flint.isEnabled();
      break;
        
      case WalletName.Yoroi:              
        walletIsEnabled = await window.cardano.yoroi.isEnabled();
      break;
        
      case WalletName.Gero:               
        walletIsEnabled = await window.cardano.gerowallet.isEnabled();
      break;

      case WalletName.Typhon:
        let {status, data} = await window.cardano.typhon.isEnabled();
        walletIsEnabled = data && status;
      break;

      case WalletName.Cardwallet:
        walletIsEnabled = await window.cardano.cardwallet.isEnabled();
      break;

      default: throw new WalletProcessError("invalid argument; wallet name MUST be a member of the WalleName enumeration object")
    }

    if( walletIsEnabled )
    {
      Wallet.enable( wallet );
      return true;
    }
    else
    {
      return false;
    };

  }

  /**
   * 
   * @param {symbol} wallet member of the WalletName enum object
   */
  static isAviable( wallet )
  {
    // Wallet._assertBrowser() not needed since checks into the Wallet class only
    Wallet._assertWalletNameIsSym( wallet );

    switch( wallet )
    {
      /*
      if you need to modify the cases please make sure
      any change is made also in the WalletName object
      */
      case WalletName.Nami:               return ( Wallet._namiObj !== undefined );
      case WalletName.CCVault:            return ( Wallet._ccvaultObj !== undefined );
      case WalletName.Flint:              return ( Wallet._flintObj !== undefined );
      case WalletName.Yoroi:              return ( Wallet._yoroiObj !== undefined );
      case WalletName.Gero:               return ( Wallet._geroObj !== undefined );
      case WalletName.Typhon:             return ( Wallet._typhonObj !== undefined );
      case WalletName.Cardwallet:         return ( Wallet._cardWalletObj !== undefined )

      default: throw new WalletProcessError("invalid argument; wallet name MUST be a member of the WalleName enumeration object")
    }
  }

  // ---------------------------------------- Nami ---------------------------------------- //

  static get NamiInterface()
  {
    if( !Wallet.has( WalletName.Nami ) ) throw new NamiError("can't access the nami object if the nami extension is not installed");

    if( Wallet._namiInterface === undefined )
    {
      Wallet._namiInterface = private_makeWalletInterface( WalletName.Nami );
    }
    
    return Wallet._namiInterface;
  }

  static get Nami()
  {
    if( !Wallet.has( WalletName.Nami ) ) throw new NamiError("can't access the Nami object if the nami extension is not installed");
    if( !Wallet.isAviable( WalletName.Nami ) ) throw new NamiError("Wallet.enableNami has never been called before, can't access the Nami wallet object");

    if( Wallet._NamiWallet === undefined )
    {
      Wallet._NamiWallet = private_makeWallet( Wallet._namiObj, Wallet._api_key )
    }

    return Wallet._NamiWallet;
  }
  
  // ---------------------------------------- ccvault ---------------------------------------- //

  static get CCVaultInterface()
  {
    if( !Wallet.has( WalletName.CCVault ) ) throw new CCVaultError("can't access the ccvault object if the ccvault extension is not installed");

    if( Wallet._ccvaultInterface === undefined )
    {
      Wallet._ccvaultInterface = private_makeWalletInterface( WalletName.CCVault );
    }
    
    return Wallet._ccvaultInterface;
  }

  static get CCVault()
  {
    if( !Wallet.has( WalletName.CCVault ) ) throw new CCVaultError("can't access the CCVault object if the CCVault extension is not installed");
    if( !Wallet.isAviable( WalletName.CCVault ) ) throw new CCVaultError("Wallet.enableCCVault has never been called before, can't access the CCVault wallet object");

    if( Wallet._CCVaultWallet === undefined )
    {
      Wallet._CCVaultWallet = private_makeWallet( Wallet._ccvaultObj, Wallet._api_key )
    }

    return Wallet._CCVaultWallet;
  }

 

  // ---------------------------------------- flint TODO ToDo todo ---------------------------------------- //
  
  static get FlintInterface()
  {
    if( !Wallet.has( WalletName.Flint ) ) throw new FlintError("can't access the flint object if the flint extension is not installed");

    if( Wallet._flintInterface === undefined )
    {
      Wallet._flintInterface = private_makeWalletInterface( WalletName.Flint );
    }
    
    return Wallet._flintInterface;
  }

  static get Flint()
  {
    if( !Wallet.has( WalletName.Flint ) ) throw new FlintError("can't access the flint object if the flint extension is not installed");
    if( !Wallet.isAviable( WalletName.Flint ) ) throw new FlintError("Wallet.enableFlint has never been called before, can't access the flint wallet object");

    if( Wallet._flintWallet === undefined )
    {
      Wallet._flintWallet = private_makeWallet( Wallet._flintWallet, Wallet._api_key )
    }

    return Wallet._flintWallet;
  }

  // ---------------------------------------- yoroi ---------------------------------------- //

  static get YoroiInterface()
  {
    if( !Wallet.has( WalletName.Yoroi ) ) throw new YoroiError("can't access the yoroi object if the yoroi extension is not installed");

    if( Wallet._yoroiInterface === undefined )
    {
      Wallet._yoroiInterface = private_makeWalletInterface( WalletName.Yoroi );
    }
    
    return Wallet._yoroiInterface;
  }

  static get Yoroi()
  {
    if( !Wallet.has( WalletName.Yoroi ) ) throw new WalletInterfaceError("can't access the Yoroi object if the Yoroi nigthly extension is not installed");
    if( !Wallet.isAviable( WalletName.Yoroi ) ) throw new WalletInterfaceError("Wallet.enableYoroi has never been called before, can't access the Yoroi interface");

    if( Wallet._yoroiWallet === undefined )
    {
      Wallet._yoroiWallet = private_makeWallet( Wallet._yoroiObj, Wallet._api_key )
    }

    return Wallet._yoroiWallet;
  }

  // ---------------------------------------- gerowallet ---------------------------------------- //

  static get GeroInterface()
  {
    if( !Wallet.has( WalletName.Gero ) ) throw new GeroError("can't access the gero object if the gerowallet extension is not installed");

    if( Wallet._geroInterface === undefined )
    {
      Wallet._geroInterface = private_makeWalletInterface( WalletName.Gero );
    }
    
    return Wallet._geroInterface;
  }

  static get Gero()
  {
    if( !Wallet.has( WalletName.Gero ) ) throw new WalletInterfaceError("can't access the Gero object if the Gero Wallet extension is not installed");
    if( !Wallet.isAviable( WalletName.Gero ) ) throw new WalletInterfaceError("Wallet.enableGero has never been called before, can't access the Gero interface");

    if( Wallet._geroWallet === undefined )
    {
      Wallet._geroWallet = private_makeWallet( Wallet._geroObj, Wallet._api_key )
    }

    return Wallet._geroWallet;
  }

  // ---------------------------------------- typhon ---------------------------------------- //

  
  static get TyphonInterface()
  {
    if( !Wallet.has( WalletName.Typhon ) ) throw new TyphonError("can't access the Typhon object if the Typhon extension is not installed");

    if( Wallet._typhonInterface === undefined )
    {
      Wallet._typhonInterface = private_makeWalletInterface( WalletName.Typhon );
    }
    
    return Wallet._typhonInterface;
  }

  static get Typhon()
  {
    if( !Wallet.has( WalletName.Typhon ) ) throw new TyphonError("can't access the Typhon object if the Typhon Wallet extension is not installed");
    if( !Wallet.isAviable( WalletName.Typhon ) ) throw new TyphonError("Wallet.enable( WalletName.Typhon ) has never been called before, can't access the Typhon interface");

    if( Wallet._TyphonWallet === undefined )
    {
      Wallet._TyphonWallet = private_makeWallet( Wallet._typhonObj, Wallet._api_key )
    }

    return Wallet._TyphonWallet;
  }

  // ---------------------------------------- cardwallet ---------------------------------------- //


  static get CardwalletInterface()
  {
    if( !Wallet.has( WalletName.Cardwallet ) ) throw new CardwalletError("can't access the Cardwallet object if the Cardwallet extension is not installed");

    if( Wallet._cardWalletInterface === undefined )
    {
      Wallet._cardWalletInterface = private_makeWalletInterface( WalletName.Cardwallet );
    }
    
    return Wallet._cardWalletInterface;
  }

  static get Cardwallet()
  {
    if( !Wallet.has( WalletName.Cardwallet ) ) throw new CardwalletError("can't access the Cardwallet object if the Cardwallet Wallet extension is not installed");
    if( !Wallet.isAviable( WalletName.Cardwallet ) ) throw new CardwalletError("Wallet.enable( WalletName.Cardwallet ) has never been called before, can't access the Cardwallet interface");

    if( Wallet._CardWalletWallet === undefined )
    {
      Wallet._CardWalletWallet = private_makeWallet( Wallet._cardWalletObj, Wallet._api_key )
    }

    return Wallet._CardWalletWallet;
  }

}



// ---------------------------------------------------- private --------------------------------------------------------- //

/**
 * 
 * @param {symbol} walletSymbolName member of the WalletNameobject which you can import by ```inport { WalletName } from "@harmonicpool/cardano-wallet-interface"```
 * @returns {Wallet.WalletInterface}
1 */
function private_makeWalletInterface( walletSymbolName )
{
  // I know is private but I don't trust myself
  Wallet._assertBrowser();
  Wallet._assertWalletNameIsSym( walletSymbolName );

  if(
    walletSymbolName !== WalletName.Nami ||
    walletSymbolName !== WalletName.CCVault ||
    walletSymbolName !== WalletName.Flint ||
    walletSymbolName !== WalletName.Yoroi ||
    walletSymbolName !== WalletName.Gero ||
    walletSymbolName !== WalletName.Typhon ||
    walletSymbolName !== WalletName.Cardwallet
  )
  throw new WalletProcessError("invalid argument; wallet name MUST be a member of the WalleName enumeration object");

  function getApiVersion()
  {
    switch( walletSymbolName )
    {
      case WalletName.Nami:              return window?.cardano?.nami?.apiVersion               ? window.cardano.nami.apiVersion : ""; 
      case WalletName.CCVault:           return window?.cardano?.ccvault?.apiVersion            ? window.cardano.ccvault.apiVersion : "";  
      case WalletName.Flint:             return window?.cardano?.flint?.apiVersion              ? window.cardano.flint.apiVersion : ""; 
      case WalletName.Yoroi:             return window?.cardano?.yoroi?.apiVersion              ? window.cardano.yoroi.apiVersion : "";  
      case WalletName.Gero:              return window?.cardano?.gerowallet?.apiVersion         ? window.cardano.gerowallet.apiVersion : "";
      case WalletName.Typhon:            return window?.cardano?.typhon?.apiVersion             ? window.cardano.typhon.apiVersion : "";
      case WalletName.Cardwallet:        return window?.cardano?.cardwallet?.apiVersion         ? window.cardano.cardwallet.apiVersion : "";
      
      default: throw new WalletProcessError("invalid argument; wallet name MUST be a member of the WalleName enumeration object")
    }
  }

  function getName()
  {
    switch( walletSymbolName )
    {
      case WalletName.Nami:              return window?.cardano?.nami?.name               ? window.cardano.nami.name : ""; 
      case WalletName.CCVault:           return window?.cardano?.ccvault?.name            ? window.cardano.ccvault.name : "";  
      case WalletName.Flint:             return window?.cardano?.flint?.name              ? window.cardano.flint.name : ""; 
      case WalletName.Yoroi:             return window?.cardano?.yoroi?.name              ? window.cardano.yoroi.name : "";  
      case WalletName.Gero:              return window?.cardano?.gerowallet?.name         ? window.cardano.gerowallet.name : "";
      case WalletName.Typhon:            return window?.cardano?.typhon?.name             ? window.cardano.typhon.name : "";
      case WalletName.Cardwallet:        return window?.cardano?.cardwallet?.name         ? window.cardano.cardwallet.name : "";

      default: throw new WalletProcessError("invalid argument; wallet name MUST be a member of the WalleName enumeration object")
    }
  }

  function getIcon()
  {
    switch( walletSymbolName )
    {
      case WalletName.Nami:              return window?.cardano?.nami?.icon               ? window.cardano.nami.icon : ""; 
      case WalletName.CCVault:           return window?.cardano?.ccvault?.icon            ? window.cardano.ccvault.icon : "";  
      case WalletName.Flint:             return window?.cardano?.flint?.icon              ? window.cardano.flint.icon : ""; 
      case WalletName.Yoroi:             return window?.cardano?.yoroi?.icon              ? window.cardano.yoroi.icon : "";  
      case WalletName.Gero:              return window?.cardano?.gerowallet?.icon         ? window.cardano.gerowallet.icon : "";
      case WalletName.Typhon:            return window?.cardano?.typhon?.icon             ? window.cardano.typhon.icon : "";
      case WalletName.Cardwallet:        return window?.cardano?.cardwallet?.icon         ? window.cardano.cardwallet.icon : "";
      
      default: throw new WalletProcessError("invalid argument; wallet name MUST be a member of the WalleName enumeration object")
    }
  }

  return {
    apiVersion: getApiVersion(),
    icon:       getIcon(),
    name:       getName(),
    isInjected: () => Wallet.has( walletSymbolName ),
    isAviable:  () => Wallet.isAviable( walletSymbolName ),
    isEnabled:  () => Wallet.isEnabled( walletSymbolName ),
    enable:     () => Wallet.enable( walletSymbolName )
  };

}

/**
 * 
 * @param {RawCip30} WalletProvider 
 * @param {string} defaultBlockfrost_api_key 
 * @returns {Wallet.Wallet}
 */
function private_makeWallet( WalletProvider, defaultBlockfrost_api_key )
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

  const signAndSubmitTransaction = async ( Transaction ) =>
  {
    return await submitTransaction(
      await signTransaction(
        Transaction
      )
    )
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
    raw: WalletProvider,
    getCurrentUserDelegation,
    createDelegagtionTransaction,
    signTransaction,
    submitTransaction,
    signAndSubmitTransaction,
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
  // nami || flint
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

// exports default
module.exports = Wallet;


const geroWalletFriendlyDomains = [
  "3air.io",
  "aada.finance",
  "ada-quest.com",
  "adadomains.io",
  "adafinance.io",
  "adahandle.com",
  "adalend.finance",
  "adanft.app",
  "adanize.com",
  "adapay.finance",
  "adaswap.app",
  "adatokenizer.io",
  "adax.pro",
  "adazine.com",
  "adazoo.com",
  "ardana.org",
  "artano.io",
  "artifct.app",
  "astarter.io",
  "bearsclub.io",
  "beyondrockets.city",
  "bingochain.io",
  "bondly.finance",
  "canucks-publishing.com",
  "cardahub.io",
  "cardano4speed.com",
  "cardanotales.com",
  "cardanowarriors.io",
  "cardax.io",
  "cardingo.io",
  "cardstarter.io",
  "centaurify.com",
  "charli3.io",
  "chibidangoheroes.com",
  "cnft.io",
  "cnft.tools",
  "coinlink.finance",
  "cornucopias.io",
  "coti.io",
  "credefi.finance",
  "cryptodino.io",
  "dcspark.io",
  "defire.fi",
  "do.exchange",
  "don-key.finance",
  "dracards.com",
  "dripdropz.io",
  "drunkendragon.games",
  "duelistking.com",
  "empowa.io",
  "ergodex.io",
  "everlens.io",
  "flur.ee",
  "gada.finance",
  "galactico.app",
  "galaxyof.art",
  "gamingcardano.com",
  "genesishouse.io",
  "geniusyield.co",
  "hashguardians.io",
  "husky-swap.io",
  "indigoprotocol.io",
  "jpg.store",
  "kick.io",
  "koios.rest",
  "kubecoin.org",
  "lilgoats.io",
  "liqwid.finance",
  "liqwid.finance",
  "lovada.art",
  "maladex.com",
  "martify.io",
  "matrixswap.io",
  "matrixswap.io",
  "mechverse.co",
  "meld.com",
  "meowswap.fi",
  "meowswap.fi",
  "minswap.org",
  "mirqur.io",
  "muesliswap.com",
  "myhomeplanet.io",
  "nexo.io",
  "nftjam.io",
  "optim.finance",
  "paribus.io",
  "pavia.io",
  "payment.nft-maker.io",
  "pixellinks.golf",
  "planetpalz.io",
  "playermint.com",
  "raynetwork.io",
  "ridotto.io",
  "rraayy.com",
  "scatdao.com",
  "spacetimemeta.io",
  "spinada.cash",
  "sundaeswap.finance",
  "tangocrypto.com",
  "theos.fi",
  "tokhun.io",
  "txgalactic.io",
  "vyfi.io",
  "wayacollective.com",
  "worldmobile.io",
  "worldofpirates.io",
]