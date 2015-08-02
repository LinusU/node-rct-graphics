# RCT Graphics

Read RollerCoaster Tycoon graphic files.

## Installation

```sh
npm install --save rct-graphics
```

## Usage

```javascript
var fs = require('fs')
var RCTGraphics = require('rct-graphics')

var srcData = fs.readFileSync('csg1.dat')
var srcIndex = fs.readFileSync('csg1i.dat')

var graphics = new RCTGraphics({
  srcData: srcData,
  srcIndex: srcIndex
})

// Load a palette
var palette = graphics.loadDataAtIndex(2024)

// Load a bitmap
var info = graphics.loadInfoAtIndex(2275)
var bitmap = graphics.loadDataAtIndex(2275)
```

## API

### `new RCTGraphics(opts)`

Create a new instance for retrieving graphics. `opts` should be an object with
both `srcData` and `srcIndex`. `srcData` is a buffer with the content of
`csg1.dat`. `srcIndex` is a buffer with the content of `csg1i.dat`.

### `.loadInfoAtIndex(idx)`

Load info about the graphic at index `idx`. Returns an object with
`startAddress`, `width`, `height`, `offsetX`, `offsetY` and `flags`.

### `.loadDataAtIndex(idx)`

Loads data for the graphic at index `idx`. Returns either a buffer (bitmap) or
a `Map` (palette).

## Tests

To run the tests you need to supply `csg1.dat` and `csg1i.dat`. Create a folder
called `game-files` and drop them in there. Then run `npm test`.
