/* eslint-env mocha */

let fs = require('fs')
let assert = require('assert')

let RCTGraphics = require('./src/api')

const srcData = fs.readFileSync(__dirname + '/game-files/csg1.dat')
const srcIndex = fs.readFileSync(__dirname + '/game-files/csg1i.dat')

describe('RCTGraphics', function () {
  let graphics

  before(function () {
    graphics = new RCTGraphics({ srcIndex, srcData })
    assert.equal(graphics.recordCount, 69917)
  })

  it('loads a bitmap', function () {
    let info = graphics.loadInfoAtIndex(2275)
    let bitmap = graphics.loadDataAtIndex(2275)

    assert.equal(info.width, 42)
    assert.equal(info.height, 31)
    assert.equal(info.offsetX, -21)
    assert.equal(info.offsetY, -22)
    assert.equal(bitmap.length, info.width * info.height)
  })

  it('loads a palette', function () {
    let palette = graphics.loadDataAtIndex(2024)

    assert.ok(palette instanceof Map)
    assert.equal(palette.size, 236)
    assert.ok(palette.has(10))
    assert.ok(palette.has(245))
  })
})
