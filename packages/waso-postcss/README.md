# waso-postcss

<a href="https://npmjs.org/package/waso-postcss"><img src="https://img.shields.io/npm/v/waso-postcss.svg" alt="NPM Version"/></a>

Waso integration with for PostCSS. Apply transformations to CSS files.

## Usage

More or less the same as the default PostCSS API; specify the plugins to use as an array.

```js
const { Waso, Task } = require('waso')
const postcss = require('waso-postcss')

const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

// ...

new Task([
	// ...
	postcss([
		autoprefixer(),
		cssnano(),
	]),
])
```
