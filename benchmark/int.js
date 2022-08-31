const { Suite } = require('benchmark');
const { BufWrapper } = require('../dist');

const x = ['Int', 1073741823];

x[2] = new BufWrapper();
x[2][`write${x[0]}`](x[1]);

console.log(`\n--- ${x[0]} --- (${x[1]})`);

const buf = new BufWrapper(null, { oneConcat: true });

new Suite()
  .add(`Writing ${x[0]}`, () => {
    buf[`write${x[0]}`](x[1]);
  })
  .on('complete', (event) => {
    console.log(event.target.toString());
  })
  .run();

new Suite()
  .add(`Reading ${x[0]}`, () => {
    x[2][`read${x[0]}`]();
    x[2].offset = 0;
  })
  .on('complete', (event) => {
    console.log(event.target.toString());
  })
  .run();
