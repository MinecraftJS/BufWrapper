const { assert } = require('chai');
const BufWrapper = require('../dist').default;

describe('Varint', () => {
  it('Write 1', () => {
    const buf = new BufWrapper();
    buf.writeVarInt(42);
    assert.equal(buf.buffer.toString('hex'), '2a');
  });

  it('Write 2', () => {
    const buf = new BufWrapper();
    buf.writeVarInt(300);
    assert.equal(buf.buffer.toString('hex'), 'ac02');
  });

  it('Read 1', () => {
    const buf = new BufWrapper(Buffer.from([0x2a]));
    assert.equal(buf.readVarInt(), 42);
  });

  it('Read 2', () => {
    const buf = new BufWrapper(Buffer.from([0xac, 0x02]));
    assert.equal(buf.readVarInt(), 300);
  });
});
