const path = require('path')

const sass = require('sass')

module.exports = function wasoSass(opts = {}) {
	return async function* sassTransformer(files) {
		for await (const file of files) {
			let res = sass.renderSync({
				data: file.content.toString(),
				includePaths: [ path.dirname(file.path) ],
				...opts,
			})
			file.path = file.path.replace(/\.s[ca]ss$/, '.css')
			file.content = res.css
			yield file
		}
	}
}
