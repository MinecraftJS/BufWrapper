const BufWrapper = require('../dist').default;

console.time('oneConcat = false ');
const buf1 = new BufWrapper(null, { oneConcat: false });
for (let i = 0; i < 150000; i++) {
  buf1.writeInt(i);
}
console.timeEnd('oneConcat = false ');

console.time('oneConcat = true  ');
const buf2 = new BufWrapper(null, { oneConcat: true });
for (let i = 0; i < 150000; i++) {
  buf2.writeInt(i);
}
buf2.finish();
console.timeEnd('oneConcat = true  ');
