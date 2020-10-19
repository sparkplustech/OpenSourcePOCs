import Web3 from 'web3';
const HDWalletProvider = require("@truffle/hdwallet-provider");

var mnemonic = process.env.mnemonic;

var accessToken = process.env.accessToken;
    
const provider = new HDWalletProvider(mnemonic,accessToken,0);

const web3 = new Web3(provider);

export default web3;
