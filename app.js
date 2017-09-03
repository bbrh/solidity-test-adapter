var async = require('async')
var _ = require('underscore')
var TestRPC = require('ethereumjs-testrpc')
var Web3 = require('web3')
var solsha3 = require('solidity-sha3')

var compiledContracts = require('./compiler.js').process
var config = require('./config.js')

function setUpTestEnvironment () {

  global.web3 = new Web3(config.web3ConnectionString)
  web3.setProvider(TestRPC.provider())
  web3.sha3 = solsha3.default

}

function deployContract (contractName, contractOptions, done) {
  var contractClass = contractOptions.instanceOf || contractName
  var abi = JSON.parse(contracts[contractClass].interface)
  var bin = contracts[contractClass].bytecode
  var constructorArgs = contractOptions.args || []

  web3.eth.contract(abi).new(...constructorArgs,
    {
      data: bin,
      from: (contractOptions.from || testWallets[0]),
      gas: (contractOptions.gas || config.defaultGas),
    }, (e, r) => {
      if (r.address) {
        global[contractName] = r
        done(e)
      }
    }
  )
}


module.exports = {
  config: (setupConfig, done) => {

    global.contracts = compiledContracts(config.sourcesPath)

    setUpTestEnvironment()

    async.waterfall([ // try to expand to parallel deployment
      cb3 => web3.eth.getAccounts((e, r) => {
        global.testWallets = r
        cb3(e)
      }),
      cb => {
        async.map(
          _.pairs(setupConfig),
          (x, cb2) => deployContract(...x, cb2),
          (e, r) => cb(e)
        )
      }
    ], (e, r) => done(e))
  }
}

