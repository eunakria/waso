const fs = require('fs')
const path = require('path')

const { rollup } = require('rollup')

module.exports = function wasoRollup(opts) {
	if (opts !== undefined) {
		opts = Object.assign({ rollup: {}, bundle: {} }, opts)
	}
	
	else {
		// Try to load rollup.config.js
		let searchPath = path.join(process.cwd(), 'rollup.config.js')
		let config = null
		while (config === null) {
			if (fs.existsSync(searchPath)) {
				config = require(searchPath)
			} else {
				searchPath = path.dirname(searchPath)
			}

			if (searchPath === '/') {
				throw new Error(
					'Could not find rollup.config.js and no options were provided'
				)
			}
		}

		let configBase = { ...config }
		delete configBase.input
		delete configBase.output
		opts = { rollup: configBase, bundle: config.output }
	}

	return async function* rollupTransformer(files) {
		for await (let file of files) {
			opts.rollup.input = file.path
			let bundle = await rollup(opts.rollup)
			let res = await bundle.generate(opts.bundle)
			file.content = res.output[0].code
			yield file
		}
	}
}
