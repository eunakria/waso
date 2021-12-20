const { optimize } = require('svgo')

module.exports = function wasoSvgo(opts = {}) {
	return async function* svgoTransformer(files) {
		for await (const file of files) {
			file.content = optimize(file.content, opts).data
			yield file
		}
	}
}
