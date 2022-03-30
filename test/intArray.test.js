const { assert } = require('chai');
const BufWrapper = require('../dist').default;

describe('Int Array', () => {
  it('Write 1', () => {
    const buf = new BufWrapper();
    buf.writeIntArray([1, 2, 3]);
    assert.equal(buf.buffer.toString('hex'), '03000000010000000200000003');
  });

  it('Write 2', () => {
    const buf = new BufWrapper();
    buf.writeIntArray([42, -42]);
    assert.equal(buf.buffer.toString('hex'), '020000002affffffd6');
  });

  it('Read 1', () => {
    const buf = new BufWrapper(
      Buffer.from([
        0x03, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00,
        0x03,
      ])
    );
    const decoded = buf.readIntArray();
    assert.equal(decoded.length, 3);
    assert.equal(decoded[0], 1);
    assert.equal(decoded[1], 2);
    assert.equal(decoded[2], 3);
  });

  it('Read 2', () => {
    const buf = new BufWrapper(
      Buffer.from([0x02, 0x00, 0x00, 0x00, 0x2a, 0xff, 0xff, 0xff, 0xd6])
    );
    const decoded = buf.readIntArray();
    assert.equal(decoded.length, 2);
    assert.equal(decoded[0], 42);
    assert.equal(decoded[1], -42);
  });
});
