require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Optional if you're using .env

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/EzhnfizLsXjwFFyExJYdVM65_sjfxoAv", // from your env or hardcoded
      accounts: ["0x0236afd5a4f0897f78b5e7e1f8fc00b5d83335ac7083e1aee737cbb2084ae429"], // PRIVATE_KEY
    },
  },
};
