const { assert } = require('chai');
const { BufWrapper } = require('../dist');

describe('UUID', () => {
  it('Write 1', () => {
    const buf = new BufWrapper();
    buf.writeUUID('c09b74b4-8c14-44cb-b567-6576a2daf1f9');
    assert.equal(
      buf.buffer.toString('hex'),
      'c09b74b48c1444cbb5676576a2daf1f9'
    );
  });

  it('Write 2', () => {
    const buf = new BufWrapper();
    buf.writeUUID('12ba1036085a49c29fbd24517289ce58');
    assert.equal(
      buf.buffer.toString('hex'),
      '12ba1036085a49c29fbd24517289ce58'
    );
  });

  it('Read 1', () => {
    const buf = new BufWrapper(
      Buffer.from([
        0xc0, 0x9b, 0x74, 0xb4, 0x8c, 0x14, 0x44, 0xcb, 0xb5, 0x67, 0x65, 0x76,
        0xa2, 0xda, 0xf1, 0xf9,
      ])
    );
    assert.equal(buf.readUUID(), 'c09b74b4-8c14-44cb-b567-6576a2daf1f9');
  });

  it('Read 2', () => {
    const buf = new BufWrapper(
      Buffer.from([
        0x12, 0xba, 0x10, 0x36, 0x08, 0x5a, 0x49, 0xc2, 0x9f, 0xbd, 0x24, 0x51,
        0x72, 0x89, 0xce, 0x58,
      ])
    );
    assert.equal(buf.readUUID(false), '12ba1036085a49c29fbd24517289ce58');
  });
});
