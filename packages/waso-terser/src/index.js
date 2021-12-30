const terser = require('terser')

module.exports = function wasoTerser(opts = {}) {
	return async function *terserTransformer(files) {
		// Terser can handle multiple input files, so if the user wants to
		// pass all input files at once, collect the inputs and pass them
		// at once to Terser.
		if ('squash' in opts && opts.squash) {
			delete opts.squash
			let inputs = {}
			for await (let file of files) {
				inputs[file.path] = file.content.toString()
			}

			let output = await terser.minify(inputs, opts)
			yield {
				path: 'js',
				content: output.code
			}
			if (output.map) {
				yield {
					path: 'js.map',
					content: output.map
				}
			}
		}

		// Otherwise, handle each file individually.
		else {
			for await (let file of files) {
				let output = await terser.minify({
					[file.path]: file.content.toString(),
				}, opts)

				file.content = output.code
				yield file

				if (output.map !== undefined) {
					yield {
						path: file.path + '.map',
						content: output.map,
					}
				}
			}
		}
	}
}
