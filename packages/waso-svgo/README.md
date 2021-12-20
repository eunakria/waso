# waso-svgo

<a href="https://npmjs.org/package/waso-svgo"><img src="https://img.shields.io/npm/v/waso-svgo.svg" alt="NPM Version"/></a>

Waso integration for SVGO. Compress SVG files.

## Usage

waso-svgo has a single, optional argument representing the options to pass to SVGO.

```js
const { Waso, Task } = require('waso')
const svgo = require('waso-svgo')

// ...

new Task([
	// ...
	svgo({
		reusePaths: true,
	}),
])
```
