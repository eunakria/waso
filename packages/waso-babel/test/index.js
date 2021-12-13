const fs = require('fs')

const test = require('tape')

const { Waso, Task } = require('waso')
const babel = require('../src/index')


main()
async function main() {
	let originalDir = process.cwd()
	process.chdir(__dirname)

	await new Promise(resolve => {
		test('waso babel', async t => {
			t.plan(6)

			let config = new Waso({
				default: new Task([
					Waso.source('fixtures/test1.js'),
					babel({
						sourceMaps: true,
						presets: [
							'@babel/preset-env',
						],
					}),
					Waso.target('dist/'),
				])
			})

			try {
				await config.run()
				t.pass('Compile test1.js ran successfully')
			} catch (err) {
				t.fail('Compile test1.js failed')
			}

			const test1Map = fs.readFileSync('dist/test1.js.map', 'utf8')
			const mapData = JSON.parse(test1Map)
			t.equal(typeof mapData, 'object', 'Source map is generated')

			const test1 = require('./dist/test1.js')
			t.equal(test1(1, 2), 3, 'test1.js output is valid')

			config = new Waso({
				default: new Task([
					Waso.source('fixtures/test{2,3}.js'),
					babel({
						sourceMaps: false,
						presets: [
							'@babel/preset-env',
						],
					}),
					Waso.target('dist/'),
				])
			})

			try {
				await config.run()
				t.pass('Compile test2.js and test3.js ran successfully')
			} catch (err) {
				t.fail('Compile test2.js and test3.js failed')
			}

			const test2 = require('./dist/test2.js')
			t.equal(test2(2, 3), 18, 'test2.js output is valid')

			t.notOk(fs.existsSync('dist/test2.js.map'), 'Source map is not generated')

			fs.rmSync('dist', { recursive: true, force: true })
		}).on('end', () => {
			process.chdir(originalDir)
			resolve()
		})
	})
}
