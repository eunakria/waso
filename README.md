# Waso

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
const Waso = require('waso')

const sass = require('waso-sass')
const postcss = require('waso-postcss')
const rollup = require('waso-rollup')

const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

module.exports = new Waso({
	_js: new Task()
		.source('src/js/index.js')
		.pipe(Waso.incremental({
			target: 'dist/js/',
		}))
		.pipe(rollup())
		.pipe(Waso.target('dist/js/')),

	_css: new Task()
		.source('src/css/index.scss')
		.pipe(Waso.incremental({
			target: 'dist/js/',
			renamer: () => 'index.css',
		}))
		.pipe(sass())
		.pipe(postcss([
			autoprefixer(),
			cssnano(),
		]))
		.pipe(Waso.target('dist/css/')),

	default: new Task()
		.series([ '_js', '_css' ]),
})
```

From there, all it takes is to run `npx waso` to build your project.

### Transformers

Waso is driven by small scripts called transformers, generators which take an input list of files and yield modified versions of them. Transformers can be written manually, but a few are provided out of the box as packages in the Waso monorepo.

| Package | Description |
| ------- | ----------- |
| [waso-sass](/packages/waso-sass) | Transform Sass and SCSS files into CSS files. |
| [waso-postcss](/packages/waso-postcss) | Apply PostCSS transformations to CSS files. |
| [waso-rollup](/packages/waso-rollup) | Bundle JavaScript files with Rollup. |

## Interested?

Get started by installing Waso with `npm i -D waso`. From there, check out the [examples](docs/examples.md) or [documentation](docs/waso.md). (TODO)
