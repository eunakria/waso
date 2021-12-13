# waso-sass

<a href="https://npmjs.org/package/waso-sass"><img src="https://img.shields.io/npm/v/waso-sass.svg" alt="NPM Version"/></a>

Waso integration for the Dart Sass compiler. Transform Sass and SCSS files into CSS files.

## Usage

```js
const { Waso, Task } = require('waso')
const sass = require('waso-sass')

// ...

new Task([
	// ...
	sass(),
])
```
