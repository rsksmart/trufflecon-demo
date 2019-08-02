# TruffleCon RSK Workshop demo

This is a sample project with a single contract "MessageBoard" and an App to show the messages sent to the contract. 
Head over to our [documentation](https://developers.rsk.co) to learn more about RSK.

## Contract
To deploy it using [Truffle](https://www.trufflesuite.com/docs/truffle/getting-started/installation):
- Navigate to `cd contracts`
- Install Truffle with `npm install -g truffle`
- Install Truffle HDWallet Provider with `npm install truffle-hdwallet-provider`
- Use `testnet` network or configure a different one on the `truffle-config.js` file
- Connect to `testnet` with `truffle console --network testnet`
- Deploy the contract with `migrate` Truffle command

## App
To run it on your machine:
- Navigate to `cd app`
- Install dependencies with `npm install`
- Run the app with `npm start`
