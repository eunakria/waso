# Waso

<a href="https://npmjs.org/package/waso"><img src="https://img.shields.io/npm/v/waso.svg" alt="NPM Version"/></a>

⚠ **This software is a work in progress.** ⚠\
It's not yet ready for production use, but feel free to give it a try and contribute with issues and pull requests!

---

<div align="center">
	<img src="logo.png" alt="Logo">
</div>

Waso (/ˈwaso/, from the [toki pona](https://tokipona.org/) word for "bird") is a refined task runner inspired by [Gulp](https://gulpjs.com/), [Grunt](https://gruntjs.com/), and [Taskr](https://github.com/lukeed/taskr/).

It is designed to revive the fluid nature of Makefiles in modern Node.js projects, and provide a more versatile asset pipeline than the convoluted systems that tools like Webpack and Parcel offer.

## Usage

Waso starts with a `waso.config.js` file in your project's root directory. It is a JavaScript file that exports an instance of the Waso class.

```js
const { Waso, Task } = require('waso')

const sass = require('waso-sass')
const postcss = require('waso-postcss')
const rollup = require('waso-rollup')

const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

module.exports = new Waso({
	_js: new Task([
		Waso.source('src/js/index.js'),
		Waso.incremental({
			target: 'dist/js/',
		}),
		rollup(),
		Waso.target('dist/js/'),
	]),

	_css: new Task([
		Waso.source('src/css/index.scss'),
		Waso.incremental({
			target: 'dist/js/',
			renamer: () => 'index.css',
		}),
		sass(),
		postcss([
			autoprefixer(),
			cssnano(),
		]),
		Waso.target('dist/css/'),
	]),

	default: Task.series([ '_js', '_css' ]),
})
```

From there, all it takes is to run `npx waso` to build your project.

### Transformers

Waso is driven by small scripts called transformers, generators which take an input list of files and yield modified versions of them. Transformers can be written manually, but a few are provided out of the box as packages in the Waso monorepo.

| Package | Description |
| ------- | ----------- |
| [waso-babel](/packages/waso-babel) <a href="https://npmjs.org/package/waso-babel"><img src="https://img.shields.io/npm/v/waso-babel.svg" alt="NPM Version"/></a> | Transform JavaScript files with Babel. |
| [waso-postcss](/packages/waso-postcss) <a href="https://npmjs.org/package/waso-postcss"><img src="https://img.shields.io/npm/v/waso-postcss.svg" alt="NPM Version"/></a> | Apply PostCSS transformations to CSS files. |
| [waso-rollup](/packages/waso-rollup) <a href="https://npmjs.org/package/waso-rollup"><img src="https://img.shields.io/npm/v/waso-rollup.svg" alt="NPM Version"/></a> | Bundle JavaScript files with Rollup. |
| [waso-sass](/packages/waso-sass) <a href="https://npmjs.org/package/waso-sass"><img src="https://img.shields.io/npm/v/waso-sass.svg" alt="NPM Version"/></a> | Transform Sass and SCSS files into CSS files. |
| [waso-svgo](/packages/waso-svgo) <a href="https://npmjs.org/package/waso-svgo"><img src="https://img.shields.io/npm/v/waso-svgo.svg" alt="NPM Version"/></a> | Compress SVG files with SVGO. |
| [waso-terser](/packages/waso-terser) <a href="https://npmjs.org/package/waso-terser"><img src="https://img.shields.io/npm/v/waso-terser.svg" alt="NPM Version"/></a> | Minify JavaScript files with Terser. |
| [waso-typescript](/packages/waso-typescript) <a href="https://npmjs.org/package/waso-typescript"><img src="https://img.shields.io/npm/v/waso-typescript.svg" alt="NPM Version"/></a> | Transform TypeScript files into JavaScript files. |

## Interested?

Get started by installing Waso with `npm i -D waso`. From there, check out the [examples](docs/examples.md) or [documentation](docs/waso.md). (TODO)
