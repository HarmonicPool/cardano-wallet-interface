
const Wallet = require("./Wallet/index");

// allows import { Wallet } from "@harmonicpool/cardano-wallet-interface";
Wallet.Wallet = Wallet;
// for strict ES Module import Wallet from "@harmonicpool/cardano-wallet-interface";
Wallet.default  = Wallet;

module.exports = Wallet