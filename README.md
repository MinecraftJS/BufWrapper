# BufWrapper

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/MinecraftJS/BufWrapper/Build?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/MinecraftJS/BufWrapper?style=for-the-badge)
![npm (scoped)](https://img.shields.io/npm/v/@minecraft-js/bufwrapper?style=for-the-badge)

Encode and decode data using buffers

# Features

Encode and decode:

- Varint
- String
- Int
- Long
- Array of strings
- Array of ints
- UUID
- Byte
- Boolean
- Float
- Short
- Double

⚠️ They are all signed and big endian (As Java does)

# Documentation

## Installation

Install the package:

```bash
$ npm install @minecraft-js/bufwrapper
```

And then import it in your JavaScript/TypeScript file

```ts
const { BufWrapper } = require('@minecraft-js/bufwrapper'); // CommonJS

import { BufWrapper } from '@minecraft-js/bufwrapper'; // ES6
```

## Writing a buffer

First, instantiate a new BufWrapper

```js
const buf = new BufWrapper();
```

And then you can use any method to write data into it

```js
buf.writeInt(42);
buf.writeString('Hello World');
buf.writeLong(123456789);
```

## Reading a buffer

To read a buffer content, you need to instantiate a new BufWrapper and pass the buffer to the constructor

```js
// Buffer with dummy data
const buffer = Buffer.from(
  '0000002a0b48656c6c6f20576f726c6400000000075bcd15',
  'hex'
);

const buf = new BufWrapper(buffer);
buf.readInt(); // 42
buf.readString(); // 'Hello World'
buf.readLong(); // 123456789
```

## Note on the speed

By default the library can be slow if you are writing a lot of data.
The writing process can be optimized by using the `oneConcat` option.

This option requires an additional call after writing the data.

```js
const buf = new BufWrapper(null, { oneConcat: true });
buf.writeInt(42);
buf.writeString('Hello World');
buf.writeLong(123456789);

// The call required
buf.finish();
```

Before you call the `BufWrapper#finish` method, the `BufWrapper#buffer` property will be an empty buffer.

You can see by yourself the speed upgrade by running the `test/time.js` file. Here is
what I got on my computer when writing 150,000 integers

```
$ node test/time.js
oneConcat = false : 7.261s
oneConcat = true  : 63.869ms
```

See more here: https://minecraftjs.github.io/BufWrapper/

# Benchmarks

Computer specs: Ryzen 5 3600 - 16GB at 2100MHz

```
--- Boolean --- (true)
Writing Boolean x 1,691,636 ops/sec ±0.75% (94 runs sampled)
Reading Boolean x 12,444,612 ops/sec ±0.95% (90 runs sampled)

--- Bytes --- (56c6cdd8ac7f12836033752c2b82e37b83c5e4a0eb38dcede3a6e49ce3633b1e)
Writing Bytes x 1,379,566 ops/sec ±0.99% (92 runs sampled)
Reading Bytes x 7,333,770 ops/sec ±0.88% (90 runs sampled)

--- Double --- (1.797693134862316e+154)
Writing Double x 1,976,603 ops/sec ±1.19% (94 runs sampled)
Reading Double x 12,142,118 ops/sec ±1.08% (93 runs sampled)

--- Float --- (1.701411733e+38)
Writing Float x 2,037,995 ops/sec ±0.24% (94 runs sampled)
Reading Float x 12,814,483 ops/sec ±0.98% (89 runs sampled)

--- Int --- (1073741823)
Writing Int x 2,013,405 ops/sec ±0.38% (97 runs sampled)
Reading Int x 14,167,639 ops/sec ±0.73% (92 runs sampled)

--- Long --- (4611686018427387903)
Writing Long x 1,215,060 ops/sec ±0.16% (96 runs sampled)
Reading Long x 3,356,783 ops/sec ±0.45% (92 runs sampled)

--- Short --- (16383)
Writing Short x 1,902,872 ops/sec ±0.39% (95 runs sampled)
Reading Short x 12,839,740 ops/sec ±0.95% (92 runs sampled)

--- String --- (Hello World!)
Writing String x 783,409 ops/sec ±0.46% (95 runs sampled)
Reading String x 3,834,405 ops/sec ±0.57% (91 runs sampled)

--- UUID --- (1eecd0cf-234a-41fa-b1c2-6523a9558442)
Writing UUID x 703,453 ops/sec ±0.11% (92 runs sampled)
Reading UUID x 1,568,455 ops/sec ±0.53% (93 runs sampled)

--- VarInt --- (42)
Writing VarInt x 1,487,426 ops/sec ±0.42% (95 runs sampled)
Reading VarInt x 10,789,658 ops/sec ±1.63% (86 runs sampled)
```
