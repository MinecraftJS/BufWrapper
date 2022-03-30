# BufWrapper

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/MinecraftJS/BufWrapper/Build?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/MinecraftJS/BufWrapper?style=for-the-badge)
![npm (scoped)](https://img.shields.io/npm/v/@minecraft-js/bufwrapper?style=for-the-badge)

Encode and decode data using buffers

# Features

Encore and decode:

- Varint
- String
- Int
- Long
- Array of strings

# Documentation

## Installation

Install the package:

```bash
$ npm install @minecraft-js/bufwrapper
```

And then import it in your JavaScript/TypeScript file

```ts
const BufWrapper = require('@minecraft-js/bufwrapper'); // CommonJS

import BufWrapper from '@minecraft-js/bufwrapper'; // ES6
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

const buf = new BufWrapper();
buf.readInt(); // 42
buf.readString(); // 'Hello World'
buf.readLong(); // 123456789
```
