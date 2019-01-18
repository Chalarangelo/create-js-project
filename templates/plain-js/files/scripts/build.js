const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const Parcel = require('parcel-bundler');

const dev = process.argv.slice(2).includes('--watch');

const rollupInputOptions = {
  input: './src/index.js',
  plugins: dev
    ? [
      resolve(),
      commonjs(),
    ]
    : [
      resolve(),
      commonjs(),
      terser(),
    ],
  external: [
    'http', 'fs', 'path',
  ],
};

const rollupOutputOptions = {
  format: 'cjs',
  file: './dist/index.js',
};

const rollupWatchOptions = {
  ...rollupInputOptions,
  output: [rollupOutputOptions],
  watch: {},
};

const parcelEntryFiles = './src/public/index.html';

const parcelOptions = {
  outDir: './dist/public',
  outFile: 'index.html',
  cache: false,
  minify: true,
  target: 'browser',
  sourceMaps: false,
  contentHash: false,
  watch: dev,
};

async function build() {
  if (dev) {
    const rollupWatcher = rollup.watch(rollupWatchOptions);
    rollupWatcher.on('event', (event) => {
      if (event.code === 'ERROR') {
        console.log(`${event.error.loc.file} (${event.error.loc.line}, ${event.error.loc.column})`);
        console.log(`${event.error.frame}`);
        console.log(event.error.stack);
      }
    });

    const parcelBundler = new Parcel(parcelEntryFiles, parcelOptions);
    parcelBundler.bundle();
  } else {
    const rollupBundler = await rollup.rollup(rollupInputOptions);
    await rollupBundler.write(rollupOutputOptions);

    const parcelBundler = new Parcel(parcelEntryFiles, parcelOptions);
    await parcelBundler.bundle();

    console.log('Package generation complete!');
  }
}
build();
