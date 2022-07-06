const { assert } = require('chai');
const { BufWrapper } = require('../dist');

describe('Short', () => {
  it('Write 1', () => {
    const buf = new BufWrapper();
    buf.writeShort(42);
    assert.equal(buf.buffer.toString('hex'), '002a');
  });

  it('Write 2', () => {
    const buf = new BufWrapper();
    buf.writeShort(300);
    assert.equal(buf.buffer.toString('hex'), '012c');
  });

  it('Read 1', () => {
    const buf = new BufWrapper(Buffer.from([0x00, 0x2a]));
    assert.equal(buf.readShort(), 42);
  });

  it('Read 2', () => {
    const buf = new BufWrapper(Buffer.from([0x01, 0x2c]));
    assert.equal(buf.readShort(), 300);
  });
});
