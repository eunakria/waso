const fs = require('fs')

const test = require('tape')

const { Waso, Task } = require('waso')
const terser = require('../src/index')

main()
async function main() {
	let originalDir = process.cwd()
	process.chdir(__dirname)

	console.log(process.cwd())

	await new Promise(resolve => {
		test('waso terser', async t => {
			t.plan(4)

			let config = new Waso({
				singleFile: new Task([
					Waso.source('fixtures/test1.js'),
					terser(),
					Waso.target('dist/'),
				]),

				multipleFiles: new Task([
					Waso.source('fixtures/test{2,3}.js'),
					terser(),
					Waso.target('dist/'),
				]),

				squashed: new Task([
					Waso.source('fixtures/test{2,3}.js'),
					terser({
						squash: true,
					}),
					Waso.target('dist/'),
				]),

				withMap: new Task([
					Waso.source('fixtures/test1.js'),
					terser({
						sourceMap: true,
					}),
					Waso.target('dist/'),
				]),
			})

			clearDist()
			await config.run('singleFile')
			t.ok(
				fs.existsSync('dist/test1.js'),
				'Compile test1.js ran successfully'
			)

			clearDist()
			await config.run('multipleFiles')
			t.ok(
				fs.existsSync('dist/test2.js') && fs.existsSync('dist/test3.js'),
				'Compile test2.js and test3.js ran successfully'
			)

			clearDist()
			await config.run('squashed')
			t.ok(
				fs.existsSync('dist/js'),
				'Squash and compile ran successfully'
			)

			clearDist()
			await config.run('withMap')
			t.ok(
				fs.existsSync('dist/test1.js') && fs.existsSync('dist/test1.js.map'),
				'Compile test1.js with source map ran successfully'
			)

			fs.rmSync('dist', { recursive: true, force: true })
		}).on('end', () => {
			process.chdir(originalDir)
			resolve()
		})
	})
}

function clearDist() {
	fs.rmSync('dist', { recursive: true, force: true })
	fs.mkdirSync('dist', { recursive: true })
}
