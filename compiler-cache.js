var hash = require('string-hash')
var fs = require('fs-extra')
var path = require('path')

function CompilerCache (input) {
  var h = hash(JSON.stringify(input))
  this.handler = path.join('compiled', h+'.json')
}

CompilerCache.prototype.available = function() {
  return fs.existsSync(this.handler)
}

CompilerCache.prototype.load = function() {
  return fs.readJsonSync(this.handler)
}

CompilerCache.prototype.store = function(contracts) {
  fs.emptyDirSync('compiled')
  fs.writeJsonSync(this.handler, contracts)
}

module.exports = exports = CompilerCache
