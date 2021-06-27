const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();
const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          [process.env.MNEMONIC],
          `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`
        );
      },
      network_id: 4,
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(
          [process.env.MNEMONIC],
          `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`
        );
      },
      network_id: 3,
    },
  },

  contracts_build_directory: path.join(__dirname, "client/src/contracts"),

  compilers: {
    solc: {
      version: ">0.8.5", // Récupérer la version exacte de solc-bin (par défaut : la  version de truffle)
      settings: {
        // Voir les documents de solidity pour des conseils sur l'optimisation et l'evmVersion
        optimizer: {
          enabled: false,
          runs: 200,
        },
      },
    },
  },
};
