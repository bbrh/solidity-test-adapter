# What is it?

It is a small utility that glues smart-contracts in [solidity](http://solidity.readthedocs.io/) language and your favorite testing framework. This utility taking care of compiling and deploying them to the [ethreumjs-testrpc](https://github.com/ethereumjs/testrpc) blockchain emulator.

Originally it was designed to work with [mocha](http://mochajs.org/) testing framework.

## How to write tests?

Same way you usually do. Just specify `before` hook with the setup you want. Here is `mocha` example:

```javascript
    var config = {
      'MyTest': {
        args: [ 1 ],
        instanceOf: 'Test',
        gas: 4e6,
      },
    }

    before(done => setup.config.call(this, config, done))
```

In your tests you can do something like
```javascript
  MyTest.myMethod(arg1, arg2, { gas: 4e6, from: testWallets[7] }, (e, r) => console.log(e, r) )
```

### Config

The syntax for `config` was inpired by [embark](https://github.com/iurimatias/embark-framework) framework.

```javascript
'DeployedContractName': {  // name of variable to store contract - (1)
  args: [ 1 ],             // constructor arguments
  instanceOf: 'Test',      // contract class name, by default equals to (1)
  gas: 4e6,                // gas amount, default is in the file `config.json`
  from: testWallets[1]     // address of a contract that sendds request, `testWallets[0]` by defalut
}
```

### Variables

Apart from contracts deployed according to whatever you've deployed in `setup.config`, there is a set of global variables available for your convenience:

  * `global.web3` -- `Web3` instance
  * `global.contracts` -- compiler output (ABI, bytecode, etc)
  * `global.testWallets` -- an array with 10 unlocked contracts with non-zero balance

## How to run tests?

Depends on your framework. To run example shipped with the utility try

```bash
    > mocha example-test.js --no-timeouts
    ...
```
