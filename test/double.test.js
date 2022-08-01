const { assert } = require('chai');
const { BufWrapper } = require('../dist');

describe('Double', () => {
  it('Write 1', () => {
    const buf = new BufWrapper();
    buf.writeDouble(42.42);
    assert.equal(buf.buffer.toString('hex'), '404535c28f5c28f6');
  });

  it('Write 2', () => {
    const buf = new BufWrapper();
    buf.writeDouble(43.21);
    assert.equal(buf.buffer.toString('hex'), '40459ae147ae147b');
  });

  it('Read 1', () => {
    const buf = new BufWrapper(Buffer.from('404535c28f5c28f6', 'hex'));
    assert.equal(Math.round(buf.readDouble() * 100) / 100, 42.42);
  });

  it('Read 2', () => {
    const buf = new BufWrapper(Buffer.from('40459ae147ae147b', 'hex'));
    assert.equal(Math.round(buf.readDouble() * 100) / 100, 43.21);
  });
});
