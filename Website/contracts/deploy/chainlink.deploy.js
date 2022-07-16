// Just a standard hardhat-deploy deployment definition file!
const func = async (hre) => {
	const { deployments, getNamedAccounts } = hre;
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();

	const name = 'LINK';
	const symbol = 'LINK';

	await deploy('ChainLinkERC721', {
		from: deployer,
		args: [name, symbol],
		log: true,
	});
};

func.tags = ['LINK'];
module.exports = func;
