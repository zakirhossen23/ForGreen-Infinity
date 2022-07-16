import * as dotenv from 'dotenv';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy';
dotenv.config();

module.exports = {
	networks: {
		Chainlink: {
			url: "https://rinkeby.infura.io/v3/cde24edfb39e462990149ecf3592d447",
			accounts: [`8470f20322e3e7b081ddb60179eb483e14c07022986d1b0c1c5da61ab729add4`],
			chainID:4,
			gasPrice: 1500000008
		  },
		
	},
	solidity: {
		compilers: [
			{
				version: '0.7.6',
			},
			{
				version: '0.8.6',
			},
		],
	},
	namedAccounts: {
		deployer: 0,
	},
};