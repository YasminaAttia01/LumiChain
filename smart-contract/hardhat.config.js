//https://eth-sepolia.g.alchemy.com/v2/XNzdNqY-0i0mm2-6CrkuH9YyZ8gEGquE
require('@nomiclabs/hardhat-waffle');
 module.exports = {
  solidity: '0.8.18',
  networks: {
    sepolia:{
      url: 'https://eth-sepolia.g.alchemy.com/v2/XNzdNqY-0i0mm2-6CrkuH9YyZ8gEGquE',
      accounts: ['35f20aea87c17fef36abb8470a588e01128fc24247cd2f85c914553b0d764a1d']
    }
  }
 }