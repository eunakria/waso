const postcss = require('postcss')

module.exports = function wasoPostcss(opts) {
	return async function *(files) {
		let instance = postcss(opts)
		for await (const file of files) {
			let result = await instance.process(file.content, {
				from: file.path,
				to: file.path,
			})
			file.content = result.css
			yield file
		}
	}
}
