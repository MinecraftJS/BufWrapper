import * as varint from 'varint';

export default class BufWrapper {
  /**
   * The wrapped NodeJS buffer
   */
  public buffer: Buffer;
  private offset: number;

  /**
   * Create a new buffer wrapper instance
   * @param buffer The NodeJS buffer to wrap, optional
   */
  public constructor(buffer?: Buffer) {
    this.buffer = buffer || Buffer.alloc(0);
    this.offset = 0;
  }

  /**
   * Write a varint to the buffer
   * @param value The value to write (number)
   * @example
   * ```javascript
   * const buf = new BufWrapper();
   * buf.writeVarInt(300);
   * console.log(buf.buffer); // <Buffer ac 02>
   * ```
   */
  public writeVarInt(value: number): void {
    const encoded = varint.encode(value);
    this.buffer = Buffer.concat([this.buffer, Buffer.from(encoded)]);
  }

  /**
   * Read a varint from the buffer
   * @returns The varint value read from the buffer
   * @example
   * ```javascript
   * const buffer = Buffer.from([0xac, 0x02]);
   * const buf = new BufWrapper(buffer);
   * const decoded = buf.readVarInt();
   * console.log(decoded); // 300
   * ```
   */
  public readVarInt(): number {
    const value = varint.decode(this.buffer, this.offset);
    this.offset += varint.decode.bytes;
    return value;
  }

  /**
   * Write a string to the buffer
   * @param value The value to write (string)
   * @example
   * ```javascript
   * const buf = new BufWrapper();
   * buf.writeString('Hello World');
   * console.log(buf.buffer); // <Buffer 0b 48 65 6c 6c 6f 20 57 6f 72 6c 64>
   * ```
   */
  public writeString(value: string): void {
    this.writeVarInt(value.length);
    this.buffer = Buffer.concat([this.buffer, Buffer.from(value)]);
  }

  /**
   * Read a string from the buffer
   * @returns The string value read from the buffer
   * @example
   * ```javascript
   * const buffer = Buffer.from([0x0b, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f, 0x72, 0x6c, 0x64]);
   * const buf = new BufWrapper(buffer);
   * const decoded = buf.readString();
   * console.log(decoded); // Hello World
   * ```
   */
  public readString(): string {
    const length = this.readVarInt();
    const value = this.buffer.toString(
      'utf8',
      this.offset,
      this.offset + length
    );
    this.offset += length;
    return value;
  }

  /**
   * Write an integer to the buffer
   * @param value The value to write (number)
   * @example
   * ```javascript
   * const buf = new BufWrapper();
   * buf.writeInt(123);
   * console.log(buf.buffer); // <Buffer 00 00 00 7b>
   * ```
   */
  public writeInt(value: number): void {
    const buf = Buffer.alloc(4);
    buf.writeInt32BE(value);
    this.buffer = Buffer.concat([this.buffer, buf]);
  }

  /**
   * Read an integer from the buffer
   * @returns The integer value read from the buffer
   * @example
   * ```javascript
   * const buffer = Buffer.from([0x00, 0x00, 0x00, 0x7b]);
   * const buf = new BufWrapper(buffer);
   * const decoded = buf.readInt();
   * console.log(decoded); // 123
   * ```
   */
  public readInt(): number {
    const value = this.buffer.readInt32BE(this.offset);
    this.offset += 4;
    return value;
  }

  /**
   * Write a long to the buffer
   * @param value The value to write (number)
   * @example
   * ```javascript
   * const buf = new BufWrapper();
   * buf.writeLong(123456789);
   * console.log(buf.buffer); // <Buffer 00 00 00 00 07 5b cd 15>
   * ```
   */
  public writeLong(value: number | bigint): void {
    const buf = Buffer.alloc(8);
    buf.writeBigInt64BE(BigInt(value));
    this.buffer = Buffer.concat([this.buffer, buf]);
  }

  /**
   * Read a long from the buffer
   * @param asBigint If true, the value will be returned as a bigint. Otherwise, it will be returned as a number.
   * @returns The long value read from the buffer
   * @example
   * ```javascript
   * const buffer = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x07, 0x5b, 0xcd, 0x15]);
   * const buf = new BufWrapper(buffer);
   * const decoded = buf.readLong();
   * console.log(decoded); // 123456789
   * ```
   */
  public readLong(asBigint = false): number | bigint {
    const value = this.buffer.readBigInt64BE(this.offset);
    this.offset += 8;
    return asBigint ? value : Number(value);
  }

  /**
   * Write an array of strings to the buffer
   * @param value The value to write (string[])
   * @example
   * ```javascript
   * const buf = new BufWrapper();
   * buf.writeStringArray(['Hello', 'World']);
   * console.log(buf.buffer); // <Buffer 02 05 48 65 6c 6c 6f 05 57 6f 72 6c 64>
   * ```
   */
  public writeStringArray(value: string[]): void {
    this.writeVarInt(value.length);
    value.forEach((v) => this.writeString(v));
  }

  /**
   * Read an array of strings from the buffer
   * @returns The array read from the buffer
   * @example
   * ```javascript
   * const buffer = Buffer.from([0x02, 0x05, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x05, 0x57, 0x6f, 0x72, 0x6c, 0x64]);
   * const buf = new BufWrapper(buffer);
   * const decoded = buf.readStringArray();
   * console.log(decoded); // ['Hello', 'World']
   * ```
   */
  public readStringArray(): string[] {
    const length = this.readVarInt();
    const value: string[] = [];
    for (let i = 0; i < length; i++) {
      value.push(this.readString());
    }
    return value;
  }

  /**
   * Write an array of ints to the buffer
   * @param value The value to write (number[])
   * @example
   * ```javascript
   * const buf = new BufWrapper();
   * buf.writeIntArray([1, 2, 3]);
   * console.log(buf.buffer); // <Buffer 03 00 00 00 01 00 00 00 02 00 00 00 03>
   * ```
   */
  public writeIntArray(value: number[]): void {
    this.writeVarInt(value.length);
    value.forEach((v) => this.writeInt(v));
  }

  /**
   * Read an array of ints from the buffer
   * @returns The array read from the buffer
   * @example
   * ```javascript
   * const buffer = Buffer.from([ 0x03, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03 ]);
   * const buf = new BufWrapper(buffer);
   * const decoded = buf.readIntArray();
   * console.log(decoded); // [ 1, 2, 3 ]
   * ```
   */
  public readIntArray(): number[] {
    const length = this.readVarInt();
    const value: number[] = [];
    for (let i = 0; i < length; i++) {
      value.push(this.readInt());
    }
    return value;
  }

  /**
   * Write an UUID to the buffer
   * @param value The value to write (string, uuid with dashes or not)
   * @example
   * ```javascript
   * const buf = new BufWrapper();
   * buf.writeUUID('c09b74b4-8c14-44cb-b567-6576a2daf1f9');
   * console.log(buf.buffer); // <Buffer C0 9B 74 B4 8C 14 44 CB B5 67 65 76 A2 DA F1 F9>
   * ```
   */
  public writeUUID(value: string): void {
    const buf = Buffer.alloc(16);
    buf.write(value.replace(/-/g, ''), 0, 'hex');
    this.buffer = Buffer.concat([this.buffer, buf]);
  }

  /**
   * Read an UUID from the buffer
   * @param {boolean} [dashes] If true, the UUID will be returned with dashes. Otherwise, it will be returned without dashes. Defaults to true.
   * @returns The UUID read from the buffer
   * @example
   * ```javascript
   * const buffer = Buffer.from([ 0xC0, 0x9B, 0x74, 0xB4, 0x8C, 0x14, 0x44, 0xCB, 0xB5, 0x67, 0x65, 0x76, 0xA2, 0xDA, 0xF1, 0xF9 ]);
   * const buf = new BufWrapper(buffer);
   * const decoded = buf.readUUID();
   * console.log(decoded); // c09b74b4-8c14-44cb-b567-6576a2daf1f9
   * ```
   */
  public readUUID(dashes = true): string {
    const value = this.buffer.toString('hex', this.offset, this.offset + 16);
    this.offset += 16;
    return dashes
      ? value.substr(0, 8) +
          '-' +
          value.substr(8, 4) +
          '-' +
          value.substr(12, 4) +
          '-' +
          value.substr(16, 4) +
          '-' +
          value.substr(20)
      : value;
  }
}
