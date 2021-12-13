# waso-babel

<a href="https://npmjs.org/package/waso-babel"><img src="https://img.shields.io/npm/v/waso-babel.svg" alt="NPM Version"/></a>

Waso integration for Babel. Transform JavaScript files.

## Usage

waso-babel honors existing babel.config.js, .babelrc, etc. files, but will also load configuraton options passed directly as an argument.

```js
const { Waso, Task } = require('waso')
const babel = require('waso-babel')

// ...

new Task([
	// ...
	babel({
		sourceMaps: true,
		presets: [
			'@babel/preset-env',
		],
	}),
])
```
