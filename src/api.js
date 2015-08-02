let struct = require('cstruct')

const TGraphicRecord = struct `
  uint32 startAddress;
  int16 width, height, offsetX, offsetY;
  uint16 flags, _padding;
`
const TScanElement = struct `
  uint8 size, offset;
`

function loadDirectBitmap (srcData, record) {
  let pos = record.startAddress
  let size = record.width * record.height

  return srcData.slice(pos, pos + size)
}

function loadCompactedBitmap (srcData, record) {
  let { startAddress, width, height } = record
  let result = new Buffer(width * height)

  // Fill with transparent pixels
  result.fill(0)

  for (let y = 0; y < height; y++) {
    let isLast
    let startOffset = struct.read('uint16', srcData, startAddress + (2 * y))

    do {
      let scanElement = TScanElement.read(srcData, startAddress + startOffset)

      isLast = (scanElement.size & 0x80)
      let scanSize = (scanElement.size & 0x7F)
      let pixelsPos = startAddress + startOffset + TScanElement.byteLength

      if (scanSize > width) throw new Error('Line overflow')

      srcData.copy(result, y * width + scanElement.offset, pixelsPos, pixelsPos + scanSize)
    } while (isLast === false)
  }

  return result
}

function loadPaletteEntries (srcData, record) {
  let result = new Map()

  for (let i = 0; i < record.width; i++) {
    let pos = record.startAddress + (i * 3)
    let rgb = struct.readArray('uint8', 3, srcData, pos)
    result.set(record.offsetX + i, rgb)
  }

  return result
}

export default class RCTGraphics {
  constructor (opts) {
    let { srcData, srcIndex } = opts

    this.srcData = srcData
    this.srcIndex = srcIndex
    this.recordCount = (srcIndex.length / TGraphicRecord.byteLength)
  }

  loadInfoAtIndex (idx) {
    return TGraphicRecord.read(this.srcIndex, idx * TGraphicRecord.byteLength)
  }

  loadDataAtIndex (idx) {
    let record = this.loadInfoAtIndex(idx)

    switch (record.flags & 0x0F) {
      case 1: return loadDirectBitmap(this.srcData, record)
      case 5: return loadCompactedBitmap(this.srcData, record)
      case 8: return loadPaletteEntries(this.srcData, record)
      default: throw new Error('Unknown flags: ' + record.flags)
    }
  }
}
