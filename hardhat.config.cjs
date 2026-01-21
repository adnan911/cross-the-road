require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.20",
    networks: {
        base: {
            url: "https://mainnet.base.org",
            accounts: [process.env.PRIVATE_KEY],
            gasPrice: 1000000000,
        },
    },
};
