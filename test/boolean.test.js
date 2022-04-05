const { assert } = require('chai');
const BufWrapper = require('../dist').default;

describe('Boolean', () => {
  it('Write 1', () => {
    const buf = new BufWrapper();
    buf.writeBoolean(true);
    assert.equal(buf.buffer.toString('hex'), '01');
  });

  it('Write 2', () => {
    const buf = new BufWrapper();
    buf.writeBoolean(false);
    assert.equal(buf.buffer.toString('hex'), '00');
  });

  it('Read 1', () => {
    const buf = new BufWrapper(Buffer.from([0x01]));
    assert.equal(buf.readBoolean(), true);
  });

  it('Read 2', () => {
    const buf = new BufWrapper(Buffer.from([0x00]));
    assert.equal(buf.readBoolean(), false);
  });
});
