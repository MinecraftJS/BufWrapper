const { assert } = require('chai');
const BufWrapper = require('../dist').default;

describe('Long', () => {
  it('Write 1', () => {
    const buf = new BufWrapper();
    buf.writeLong(42);
    assert.equal(buf.buffer.toString('hex'), '000000000000002a');
  });

  it('Write 2', () => {
    const buf = new BufWrapper();
    buf.writeLong(300);
    assert.equal(buf.buffer.toString('hex'), '000000000000012c');
  });

  it('Read 1', () => {
    const buf = new BufWrapper(
      Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x2a])
    );
    assert.equal(buf.readLong(), 42);
  });

  it('Read 2', () => {
    const buf = new BufWrapper(
      Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x2c])
    );
    assert.equal(buf.readLong(), 300);
  });
});
