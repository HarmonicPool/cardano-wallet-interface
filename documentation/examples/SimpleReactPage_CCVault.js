import React from 'react'

import { Wallet } from "@harmonicpool/cardano-wallet-interface";

export default class Home extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      currentDelegation: {},
      ccvaultHasBeenInitialized: false
    }
  }

  async componentDidMount()
  {
    await Wallet.enableCCVault();

    // set your key once then you are free to go
    Wallet.setBlockfrost("<your blockforst api key>");

    this.setState({
      currentDelegation: await Wallet.CCVault.getCurrentUserDelegation(),
      ccvaultHasBeenInitialized: true
    })
  }

  render()
  {

    return (
      <div
      style={{
        position: "absolute",
        height: "100vh",
        width: "100vw",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
      >

        {
          !this.state.ccvaultHasBeenInitialized ?
            <p
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "5vh"
            }}
            >looking for CCVault... 👀</p>
          :
            (
            this.state.currentDelegation.pool_id === "<your pool id>" ?
              <p
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "5vh"
              }}
              >Thank you for your support &#9829;</p>
            :
              <button 
              onClick={() => Wallet.CCVault.delegateTo(
                "<your pool id>"
                // no need for api key since it has been setted in the componentDidMount() call
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