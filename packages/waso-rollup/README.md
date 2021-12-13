# waso-rollup

<a href="https://npmjs.org/package/waso-rollup"><img src="https://img.shields.io/npm/v/waso-rollup.svg" alt="NPM Version"/></a>

Waso integration for Rollup. Bundle JavaScript files.

## Usage

By default, waso-rollup will try to find and read your existing `rollup.config.js` file. If that's what you want, you can call it with no arguments.

```js
const { Waso, Task } = require('waso')
const rollup = require('waso-rollup')

// ...

new Task([
	// ...
	rollup(),
])
```

If you want to specify a config inline, provide the options for Rollup and its bundle generator in the `rollup` and `bundle` properties respectively.

```js
const { Waso, Task } = require('waso')
const rollup = require('waso-rollup')

// ...

new Task([
	// ...
	rollup({
		rollup: {,
			// plugins, external, etc.
		},
		bundle: {
			// input, output
		},
	}),
])
```
