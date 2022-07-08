import * as varint from 'varint';

export class BufWrapper<Plugins extends BufWrapperPlugins = BufWrapperPlugins> {
  /**
   * The wrapped NodeJS buffer
   */
  public buffer: Buffer;
  /**
   * Current offset (used for reading)
   */
  public offset: number;
  /**
   * Options that apply to the current `BufWrapper` instance
   * */
  public options?: BufWrapperOptions<Plugins>;
  /**
   * Installed plugins so you can access them from this object
   */
  public plugins?: Plugins;

  /** List of buffers, used for the `oneConcat` option */
  private buffers: Buffer[];

  /**
   * Create a new buffer wrapper instance
   * @param buffer The NodeJS buffer to wrap, optional
   * @param options Options to apply to the buffer wrapper, optional
   */
  public constructor(buffer?: Buffer, options?: BufWrapperOptions<Plugins>) {
    this.buffer = buffer || Buffer.alloc(0);
    this.offset = 0;
    this.buffers = [];
    this.options = options;

    if (options?.plugins) {
      this.plugins = {} as Plugins;

      for (const plugin of Object.keys(options.plugins)) {
        // @ts-ignore
        if (!this.plugins[plugin]) this.plugins[plugin] = {};

        for (const method of Object.keys(options.plugins[plugin]))
          if (!this.plugins[plugin][method])
            this.plugins[plugin][method] =
              options.plugins[plugin][method].bind(this);
      }
    }
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
    this.writeToBuffer(Buffer.from(encoded));
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
   * Write a string to the buffer (will use the ut8 encoding)
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
    this.writeToBuffer(Buffer.from(value));
  }

  /**
   * Read a string from the buffer (will use the ut8 encoding)
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
    this.writeToBuffer(buf);
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
    this.writeToBuffer(buf);
  }

  /**
   * Read a long from the buffer
   * @returns The long value read from the buffer
   * @example
   * ```javascript
   * const buffer = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x07, 0x5b, 0xcd, 0x15]);
   * const buf = new BufWrapper(buffer);
   * const decoded = buf.readLong();
   * console.log(decoded); // 123456789
   * ```
   */
  public readLong(): number {
    const value = this.buffer.readBigInt64BE(this.offset);
    this.offset += 8;
    return Number(value);
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
    this.writeToBuffer(buf);
  }

  /**
   * Read an UUID from the buffer
   * @param dashes If true, the UUID will be returned with dashes. Otherwise, it will be returned without dashes. Defaults to true.
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

  /**
   * Write raw bytes to the buffer
   * @param value The value to write (a buffer or an array of bytes)
   * @example
   * ```javascript
   * const buf = new BufWrapper();
   * buf.writeBytes([ 0x01, 0x02, 0x03 ]);
   * console.log(buf.buffer); // <Buffer 01 02 03>
   * ```
   */
  public writeBytes(value: Buffer | number[]): void {
    this.writeToBuffer(Buffer.from(value));
  }

  /**
   * Read raw bytes from the buffer
   * @param length The number of bytes to read
   * @returns The bytes read from the buffer
   * @example
   * ```javascript
   * const buffer = Buffer.from([ 0x01, 0x02, 0x03 ]);
   * const buf = new BufWrapper(buffer);
   * const decoded = buf.readBytes(3);
   * console.log(decoded); // <Buffer 01 02 03>
   * ```
   */
  public readBytes(length: number): Buffer {
    const value = this.buffer.slice(this.offset, this.offset + length);
    this.offset += length;
    return value;
  }

  /**
   * Write a boolean to the buffer
   * @param value The value to write (boolean)
   * @example
   * ```javascript
   * const buf = new BufWrapper();
   * buf.writeBoolean(true);
   * console.log(buf.buffer); // <Buffer 01>
   * ```
   */
  public writeBoolean(value: boolean): void {
    this.writeToBuffer(Buffer.from([value ? 1 : 0]));
  }

  /**
   * Read a boolean from the buffer
   * @returns The boolean read from the buffer
   * @example
   * ```javascript
   * const buffer = Buffer.from([ 0x01 ]);
   * const buf = new BufWrapper(buffer);
   * const decoded = buf.readBoolean();
   * console.log(decoded); // true
   * ```
   */
  public readBoolean(): boolean {
    const value = this.buffer.readUInt8(this.offset) === 1;
    this.offset += 1;
    return value;
  }

  /**
   * Write a float to the buffer
   * @param value The value to write (number)
   * @example
   * ```javascript
   * const buf = new BufWrapper();
   * buf.writeFloat(12.34);
   * console.log(buf.buffer); // <Buffer 41 45 70 a4>
   * ```
   */
  public writeFloat(value: number): void {
    const buf = Buffer.alloc(4);
    buf.writeFloatBE(value);
    this.writeToBuffer(buf);
  }

  /**
   * Read a float from the buffer
   * @returns The float read from the buffer
   * @example
   * ```javascript
   * const buffer = Buffer.from([ 0x41, 0x45, 0x70, 0xa4 ]);
   * const buf = new BufWrapper(buffer);
   * const decoded = buf.readFloat();
   * console.log(decoded); // 12.34000015258789
   * ```
   */
  public readFloat(): number {
    const value = this.buffer.readFloatBE(this.offset);
    this.offset += 4;
    return value;
  }

  /**
   * Write a short to the buffer
   * @param value The value to write (number)
   * @example
   * ```javascript
   * const buf = new BufWrapper();
   * buf.writeShort(42);
   * console.log(buf.buffer); // <Buffer 00 2a>
   * ```
   */
  public writeShort(value: number): void {
    const buf = Buffer.alloc(2);
    buf.writeUInt16BE(value);
    this.writeToBuffer(buf);
  }

  /**
   * Read a float from the buffer
   * @returns The float read from the buffer
   * @example
   * ```javascript
   * const buffer = Buffer.from([ 0x00, 0x2a ]);
   * const buf = new BufWrapper(buffer);
   * const decoded = buf.readShort();
   * console.log(decoded); // 42
   * ```
   */
  public readShort(): number {
    const value = this.buffer.readInt16BE(this.offset);
    this.offset += 2;
    return value;
  }

  /**
   * When the `BufWrapperOptions#oneConcat` is set to `true`
   * you must call this method to concatenate all buffers
   * into one. If the option is `undefined` or set to `false`,
   * this method will throw an error.
   *
   * This method will also set the `BufWrapper#buffer` to the
   * concatenated buffer.
   * @returns The concatenated buffer.
   */
  public finish(): Buffer {
    if (this.options?.oneConcat !== true)
      throw new Error(
        "Can't call BufWrapper#finish without oneConcat option set to true"
      );

    const buf = Buffer.concat([...this.buffers]);
    this.buffer = buf;
    return buf;
  }

  /**
   * Concat the given buffers into the main buffer
   * if `BufWrapperOptions#oneConcat` is `false` or `undefined`.
   * Otherwise, it will push the buffer to the `BufWrapper#buffers`
   * array.
   * @param value The buffers to write (array of buffers)
   */
  public writeToBuffer(...buffers: Buffer[]): void {
    if (this.options?.oneConcat === true) this.buffers.push(...buffers);
    else this.buffer = Buffer.concat([this.buffer, ...buffers]);
  }
}

/** Type used as default value for the `BufWrapper#plugins` property */
export type BufWrapperPlugins = {
  [key: string]: {
    [key: string]: (...args: any[]) => any;
  };
};

export interface BufWrapperOptions<Plugins> {
  /**
   * Whether or not to run the `Buffer#concat` method when writing.
   * When set to `true`, you will have to call the `BufWrapper#finish`
   * method to get the final buffer. (Making this true and calling)
   * the `BufWrapper#finish` will increase performance.
   * When set to `false`, the `BufWrapper#finish` method will throw an error
   * and the `Buffer#concat` will be run every time you write something
   * to the buffer.
   */
  oneConcat?: boolean;
  /**
   * Plugins you want to install on the BufferWrapper intance
   * you are about to create
   * @exemple
   * ```javascript
   * // Plugin we are creating
   * const BufWrapperPlugin = {
   *   writeCustomType(data) {
   *     // You can access the BufWrapper
   *     // instance with the `this` keyword
   *   },
   *   readCustomType() {
   *     // Do stuff
   *     return someValue;
   *   }
   * }
   *
   * // Setting the first argument as null
   * // since we don't have any data yet
   * const buf = new BufWrapper(null, {
   *   plugins: { BufWrapperPlugin }
   * });
   *
   * // Call the plugin's method
   * buf.plugins.BufWrapperPlugin.writeCustomType(yourData);
   * buf.plugins.BufWrapperPlugin.readCustomType();
   * ```
   */
  plugins?: Plugins;
}
