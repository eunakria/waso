# waso-terser

<a href="https://npmjs.org/package/waso-terser"><img src="https://img.shields.io/npm/v/waso-terser.svg" alt="NPM Version"/></a>

Waso integration for Terser. Minify JavaScript files.

## Usage

By default, waso-terser will minify each file individually, with a separate call to Terser. Arguments can optionally be passed to Terser as an argument.

`waso-terser` does **not** interpolate `min` into the output filename.

```js
const { Waso, Task } = require('waso')
const terser = require('waso-terser')

// ...

new Task([
	// ...
	terser(),

	// or...
	terser({
		// options
	}),
])
```

To pass all inputs together in a single call to Terser, the `squash: true` option can be set.

The output files will be named `js` and `js.map`.

```js
const { Waso, Task } = require('waso')
const terser = require('waso-terser')

new Task([
	// ...
	terser({
		squash: true,
	}),
])
```
