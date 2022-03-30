const { assert } = require('chai');
const BufWrapper = require('../dist').default;

describe('String Array', () => {
  it('Write 1', () => {
    const buf = new BufWrapper();
    buf.writeStringArray(['Hello', 'World']);
    assert.equal(buf.buffer.toString('hex'), '020548656c6c6f05576f726c64');
  });

  it('Write 2', () => {
    const buf = new BufWrapper();
    buf.writeStringArray(['Foo', 'Bar', 'Baz']);
    assert.equal(buf.buffer.toString('hex'), '0303466f6f034261720342617a');
  });

  it('Read 1', () => {
    const buf = new BufWrapper(
      Buffer.from([
        0x02, 0x05, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x05, 0x57, 0x6f, 0x72, 0x6c,
        0x64,
      ])
    );
    const decoded = buf.readStringArray();
    assert.equal(decoded.length, 2);
    assert.equal(decoded[0], 'Hello');
    assert.equal(decoded[1], 'World');
  });

  it('Read 2', () => {
    const buf = new BufWrapper(
      Buffer.from([
        0x03, 0x03, 0x46, 0x6f, 0x6f, 0x03, 0x42, 0x61, 0x72, 0x03, 0x42, 0x61,
        0x7a,
      ])
    );
    const decoded = buf.readStringArray();
    assert.equal(decoded.length, 3);
    assert.equal(decoded[0], 'Foo');
    assert.equal(decoded[1], 'Bar');
    assert.equal(decoded[2], 'Baz');
  });
});
