const { assert } = require('chai');
const BufWrapper = require('../dist').default;

describe('Bytes', () => {
  it('Write 1', () => {
    const buf = new BufWrapper();
    buf.writeBytes([
      0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c,
      0x0d, 0x0e, 0x0f, 0x10,
    ]);
    assert.equal(
      buf.buffer.toString('hex'),
      '0102030405060708090a0b0c0d0e0f10'
    );
  });

  it('Write 2', () => {
    const buf = new BufWrapper();
    buf.writeBytes(Buffer.from([0x01, 0x02, 0x03]));
    assert.equal(buf.buffer.toString('hex'), '010203');
  });

  it('Read 1', () => {
    const buf = new BufWrapper(
      Buffer.from([
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c,
        0x0d, 0x0e, 0x0f, 0x10,
      ])
    );
    assert.equal(
      buf.readBytes(16).toString('hex'),
      '0102030405060708090a0b0c0d0e0f10'
    );
  });

  it('Read 2', () => {
    const buf = new BufWrapper(Buffer.from([0x01, 0x02, 0x03]));
    assert.equal(buf.readBytes(3).toString('hex'), '010203');
  });
});
