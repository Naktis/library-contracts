var Taxi = artifacts.require("./Taxi.sol");

module.exports = function(deployer, networks, accounts) {
  deployer.deploy(Taxi, accounts[1]);
};
