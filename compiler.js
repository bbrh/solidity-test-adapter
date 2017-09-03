var path = require('path')
var fs = require('fs-extra')
var _ = require('underscore')

var solc = require('solc')

var CompilerCache = require('./compiler-cache.js')

function sourceFiles (source) {
  if (fs.lstatSync(source).isDirectory()) {
    return _.chain(fs.readdirSync(source))
      .filter(f => f.endsWith('.sol'))
      .map(f => [f, path.join(source, f)])
      .value()
  } else {
    return [ path.basename(source), source ]
  }
}

function sourceFilesContent (source) {
  return _.chain(sourceFiles(source))
    .map(f => [f, fs.readFileSync(f, 'utf8')])
    .object()
    .value()
}

function compile (sourcesDir) {
  var compilerInput = sourceFilesContent(sourcesDir)
  var cache = new CompilerCache(compilerInput)
  var contracts = {}

  if (cache.available()) {
    contracts = cache.load()
  } else {
    var compilerOutput = solc.compile({ sources: compilerInput }, 1)

    if ((Object.keys(compilerOutput.contracts).length === 0) && compilerOutput.errors) { // solc version dependent!
      console.log('=== COMPILATION ERRORS ===')
      console.log(compilerOutput.errors)
      return
    }

    contracts = _.chain(compilerOutput.contracts)
      .pairs()
      .map(kv => {
        key = kv[0]
        val = kv[1]
        val.abi = JSON.parse(val.interface)
        return [ key.substr(key.indexOf(':')+1), val ] // contract names collisions possible
      })
      .object()
      .value()

    cache.store(contracts)
  }

  return contracts
}

module.exports = exports = {
  process: compile
}
