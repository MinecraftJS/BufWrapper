const { assert } = require('chai');
const BufWrapper = require('../dist').default;

describe('String', () => {
  it('Write 1', () => {
    const buf = new BufWrapper();
    buf.writeString('Hello World');
    assert.equal(buf.buffer.toString('hex'), '0b48656c6c6f20576f726c64');
  });

  it('Write 2', () => {
    const buf = new BufWrapper();
    buf.writeString('Foo Bar');
    assert.equal(buf.buffer.toString('hex'), '07466f6f20426172');
  });

  it('Read 1', () => {
    const buf = new BufWrapper(
      Buffer.from([
        0x0b, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64,
      ])
    );
    assert.equal(buf.readString(), 'Hello World');
  });

  it('Read 2', () => {
    const buf = new BufWrapper(
      Buffer.from([0x07, 0x46, 0x6f, 0x6f, 0x20, 0x42, 0x61, 0x72])
    );
    assert.equal(buf.readString(), 'Foo Bar');
  });
});
