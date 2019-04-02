const etherlime = require('etherlime');
const BetFactory = require('../build/BetFactory.json')

const deploy = async (network, secret) => {

	const deployer = new etherlime.EtherlimeGanacheDeployer();
	const result = await deployer.deploy(BetFactory);

};

module.exports = {
	deploy
};