const { BufWrapper } = require('../dist');
const { assert } = require('chai');

const CStringPlugin = {
  /**
   * @param {BufWrapper} buf
   * @param {String} string
   */
  writeCString(buf, string) {
    const buffer = Buffer.alloc(Buffer.byteLength(string) + 1);
    buffer.write(string);
    buf.writeToBuffer(buffer);
  },

  /**
   * @param {BufWrapper} buf
   */
  readCString(buf) {
    let cursor = buf.offset;
    let length = 0;
    while (buf.buffer[cursor] !== 0x00) {
      length++;
      cursor++;
    }
    const bytes = buf.buffer.slice(buf.offset, length);
    buf.offset += length + 1;
    return bytes.toString();
  },
};

describe('Plugins', () => {
  it('CString Write', () => {
    const buf = new BufWrapper(null, {
      plugins: { CStringPlugin },
    });

    buf.plugins.CStringPlugin.writeCString(buf, 'Hello World!');

    assert.equal(buf.buffer.toString('hex'), '48656c6c6f20576f726c642100');
  });

  it('CString Read', () => {
    const buf = new BufWrapper(
      Buffer.from('48656c6c6f20576f726c642100', 'hex'),
      {
        plugins: { CStringPlugin },
      }
    );

    assert.equal(buf.plugins.CStringPlugin.readCString(buf), 'Hello World!');
  });
});
