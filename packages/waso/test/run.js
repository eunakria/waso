const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')

const { archiveFromStream } = require('node-hrx')

main()
async function main() {
	process.chdir(__dirname)
	if (!fs.existsSync('node_modules')) {
		childProcess.execSync('npm install')
	}

	if (fs.existsSync('current')) {
		removeCurrent()
	}

	for (let fixture of fs.readdirSync('fixtures')) {
		if (!fixture.endsWith('.hrx')) { continue }
		console.log(`Testing ${fixture}`)

		let archive = await archiveFromStream(
			fs.createReadStream(path.join('fixtures', fixture))
		)

		expandArchive(archive, 'current')
		if (fs.existsSync('current/SKIP')) {
			console.log('Skipping')
			removeCurrent()
			continue
		}
		await require('./current/run.js')
		removeCurrent()
	}
}

function expandArchive(archive, output) {
	fs.mkdirSync(output)
	for (let entry of archive) {
		let out = path.join(output, entry)
		if (archive.get(entry).isDirectory()) {
			expandArchive(archive.get(entry), out)
		} else {
			fs.writeFileSync(out, archive.get(entry).body)
		}
	}
}

function removeCurrent() {
	fs.rmSync('current', { recursive: true, force: true })
}
