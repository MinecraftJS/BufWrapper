const { assert } = require('chai');
const { BufWrapper } = require('../dist');

describe('Float', () => {
  it('Write 1', () => {
    const buf = new BufWrapper();
    buf.writeFloat(12.34);
    assert.equal(buf.buffer.toString('hex'), '414570a4');
  });

  it('Write 2', () => {
    const buf = new BufWrapper();
    buf.writeFloat(43.21);
    assert.equal(buf.buffer.toString('hex'), '422cd70a');
  });

  it('Read 1', () => {
    const buf = new BufWrapper(Buffer.from([0x41, 0x45, 0x70, 0xa4]));
    assert.equal(Math.round(buf.readFloat() * 100) / 100, 12.34);
  });

  it('Read 2', () => {
    const buf = new BufWrapper(Buffer.from([0x42, 0x2c, 0xd7, 0x0a]));
    assert.equal(Math.round(buf.readFloat() * 100) / 100, 43.21);
  });
});
