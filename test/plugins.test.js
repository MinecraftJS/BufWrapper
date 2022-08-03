// @ts-check

const { BufWrapper } = require('../dist');
const { assert } = require('chai');

const CStringPlugin = {
  /**
   * Write a CString (string terminating with a null byte `0x00`) to the buffer
   * @param {string} string String to write
   */
  writeCString(string) {
    const buffer = Buffer.alloc(Buffer.byteLength(string) + 1);
    buffer.write(string);
    this.writeToBuffer(buffer);
  },

  /**
   * Read a CString (string terminating with a null byte `0x00`) from the buffer
   * @returns The read string
   */
  readCString() {
    let cursor = this.offset;
    let length = 0;
    while (this.buffer[cursor] !== 0x00) {
      length++;
      cursor++;
    }
    const bytes = this.buffer.slice(this.offset, length);
    this.offset += length + 1;
    return bytes.toString();
  },
};

describe('Plugins', () => {
  it('CString Write', () => {
    const buf = new BufWrapper(null, {
      plugins: { CStringPlugin },
    });

    buf.plugins.CStringPlugin.writeCString('Hello World!');

    assert.equal(buf.buffer.toString('hex'), '48656c6c6f20576f726c642100');
  });

  it('CString Read', () => {
    const buf = new BufWrapper(
      Buffer.from('48656c6c6f20576f726c642100', 'hex'),
      {
        plugins: { CStringPlugin },
      }
    );

    assert.equal(buf.plugins.CStringPlugin.readCString(), 'Hello World!');
  });
});
