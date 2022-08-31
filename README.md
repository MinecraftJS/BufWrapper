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
Writing Boolean x 2,180,209 ops/sec ±17.18% (72 runs sampled)
Reading Boolean x 12,197,094 ops/sec ±1.01% (91 runs sampled)

--- Bytes --- (d7413d4d91ad68c41384aabd7b3b0c0f824fae0edeebe004dedb53aeffad8e19)
Writing Bytes x 1,854,788 ops/sec ±17.30% (71 runs sampled)
Reading Bytes x 7,043,744 ops/sec ±0.53% (90 runs sampled)

--- Double --- (1.797693134862316e+154)
Writing Double x 1,707,544 ops/sec ±34.77% (63 runs sampled)
Reading Double x 11,385,573 ops/sec ±1.36% (90 runs sampled)

--- Float --- (1.701411733e+38)
Writing Float x 1,862,668 ops/sec ±14.34% (74 runs sampled)
Reading Float x 11,960,613 ops/sec ±1.24% (88 runs sampled)

--- Int --- (1073741823)
Writing Int x 1,698,834 ops/sec ±26.28% (68 runs sampled)
Reading Int x 13,448,500 ops/sec ±1.16% (95 runs sampled)

--- Long --- (4611686018427387903)
Writing Long x 1,056,670 ops/sec ±15.26% (74 runs sampled)
Reading Long x 3,333,928 ops/sec ±0.45% (91 runs sampled)

--- Short --- (16383)
Writing Short x 1,717,828 ops/sec ±33.78% (64 runs sampled)
Reading Short x 12,081,685 ops/sec ±1.93% (90 runs sampled)

--- String --- (Hello World!)
Writing String x 884,477 ops/sec ±11.15% (76 runs sampled)
Reading String x 4,017,393 ops/sec ±0.82% (88 runs sampled)

--- UUID --- (9d4ee772-e3ad-41e5-a3d9-9d549af83716)
Writing UUID x 839,293 ops/sec ±4.30% (82 runs sampled)
Reading UUID x 1,573,052 ops/sec ±0.46% (97 runs sampled)

--- VarInt --- (42)
Writing VarInt x 1,737,641 ops/sec ±3.09% (81 runs sampled)
Reading VarInt x 10,303,053 ops/sec ±1.66% (80 runs sampled)
```
