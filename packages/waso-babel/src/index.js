const path = require('path')

const babel = require('@babel/core')

module.exports = function wasoBabel(options) {
	return async function*(files) {
		for await (const file of files) {
			const { code, map } = await babel.transform(file.content, {
				filename: file.path,
				...options,
			})
			yield {
				path: file.path,
				content: code,
			}
			if (map) {
				yield {
					path: file.path + '.map',
					content: JSON.stringify(map),
				}
			}
		}
	}
}
