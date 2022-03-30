const { assert } = require('chai');
const BufWrapper = require('../dist').default;

describe('Int', () => {
  it('Write 1', () => {
    const buf = new BufWrapper();
    buf.writeInt(42);
    assert.equal(buf.buffer.toString('hex'), '0000002a');
  });

  it('Write 2', () => {
    const buf = new BufWrapper();
    buf.writeInt(300);
    assert.equal(buf.buffer.toString('hex'), '0000012c');
  });

  it('Read 1', () => {
    const buf = new BufWrapper(Buffer.from([0x00, 0x00, 0x00, 0x2a]));
    assert.equal(buf.readInt(), 42);
  });

  it('Read 2', () => {
    const buf = new BufWrapper(Buffer.from([0x00, 0x00, 0x01, 0x2c]));
    assert.equal(buf.readInt(), 300);
  });
});
