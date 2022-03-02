import React from 'react'

// import Wallet from "@harmonicpool/cardano-wallet-interface";
import Wallet from '../../src';

export default class Home extends React.Component
{
  constructor(props)
  {
    super(props);

    // set your key once then you are free to go
    Wallet.setBlockfrost("<your blockforst api key>");

    this.state = {
      currentDelegation: {},
      ccvaultHasBeenInitialized: false
    }
  }

  async componentDidMount()
  {
    
    await Wallet.enable( Wallet.Names.CCVault );
    // now Wallet.CCVault is accessible

    this.setState({
      currentDelegation: await Wallet.CCVault.getCurrentUserDelegation(),
      ccvaultHasBeenInitialized: true
    })
  }

  render()
  {

    return (
      <div
      style={containerSty}
      >

        {
          !this.state.ccvaultHasBeenInitialized ?
            <p
            style={txtSty}
            >looking for CCVault... 👀</p>
          :
            (
            this.state.currentDelegation.pool_id === "<your pool id>" ?
              <p
              style={txtSty}
              >Thank you for your support &#9829;</p>
            :
              <button 
              onClick={() => Wallet.CCVault.delegateTo(
                "<your pool id>"
                // no need for api key since it has been setted in the component constructor() call
              )}
              >
                Delegate
              </button>
            )
          }
        
      </div>
    )
  }
}

const containerSty = {
  position: "absolute",
  height: "100vh",
  width: "100vw",
  top: 0,
  left: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const txtSty = {
  fontFamily: "Arial, sans-serif",
  fontSize: "5vh"
};