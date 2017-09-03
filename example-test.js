var async = require('async')
var assert = require('assert')
var setup = require('./app.js')

var config = {
  'Test123' : {
    args : [ 123 ],
    instanceOf: 'Test'
  },
  'Test456' : {
    args : [ 456 ],
    instanceOf: 'Test'
  },
  'Test': {
    args: [ 1 ]
  },
}

describe('test example', function() {

  before(done => setup.config.call(this, config, done))

  describe('constructor called properly', function() {

    it('Test', (done) => Test.a((e, r) => {
      assert.equal(r.toNumber(), 1)
      done(e)
    }))

    it('Test123', (done) => Test123.a((e, r) => {
      assert.equal(r.toNumber(), 123)
      done(e)
    }))

    it('Test456', (done) => Test456.a((e, r) => {
      assert.equal(r.toNumber(), 456)
      done(e)
    }))

  })

  describe('overriding stored values', function() {

    it('can re-set stored value', (done) => Test.setA(2, {from: testWallets[0]}, (e, r) => done(e)))
    it('the value is stored', (done) => Test.a((e, r) => {
      assert.equal(r.toNumber(), 2)
      done(e)
    }))

  })

  describe('obtaining non-constant function result', function() {

    it('expecting `false`',
      (done) => Test.setLargeA.call(10, {from: testWallets[0]}, (e, r) => {
        assert.equal(r, false)
        done(e)
      })
    )

    it('expecting `true`',
      (done) => Test.setLargeA.call(1000, {from: testWallets[0]}, (e, r) => {
        assert.equal(r, true)
        done(e)
      })
    )

    it('note this doesn\'t affect the chain',
      (done) => Test.a((e, r) => {
        assert.equal(r, 2)
        done(e)
      })
    )

  })

})
