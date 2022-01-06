import React from 'react'

import { Wallet } from "@harmonicpool/cardano-wallet-interface";

export default class Home extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      currentDelegation: {},
      namiHasBeenInitialized: false
    }
  }

  async componentDidMount()
  {
    await Wallet.enableNami();

    // set your key once then you are free to go
    Wallet.setBlockfrost("<your blockforst api key>");

    this.setState({
      currentDelegation: await Wallet.Nami.getCurrentUserDelegation(),
      namiHasBeenInitialized: true
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
          !this.state.namiHasBeenInitialized ?
            <p
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: "5vh"
            }}
            >looking for Nami... 👀</p>
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
              onClick={() => Wallet.Nami.delegateTo(
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