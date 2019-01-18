const rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const { terser } = require('rollup-plugin-terser');

const dev = process.argv.slice(2).includes('--watch');

const inputOptions = {
  input: './src/index.js',
  plugins: dev
    ? [
      commonjs(),
    ]
    : [
      commonjs(),
      terser(),
    ],
};

const outputOptions = {
  format: 'cjs',
  file: './dist/index.js',
};

const watchOptions = {
  ...inputOptions,
  output: [outputOptions],
  watch: {},
};

async function build() {
  if (dev) {
    const rollupWatcher = rollup.watch(watchOptions);
    rollupWatcher.on('event', (event) => {
      if (event.code === 'ERROR') {
        console.log(`${event.error.loc.file} (${event.error.loc.line}, ${event.error.loc.column})`);
        console.log(`${event.error.frame})`);
        console.log(event.error.stack);
      }
    });
  } else {
    const rollupBundler = await rollup.rollup(inputOptions);
    await rollupBundler.write(outputOptions);
    console.log('Package generation complete!');
  }
}
build();
