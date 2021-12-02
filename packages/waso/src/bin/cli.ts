#!/usr/bin/env node
import fs from 'fs'

// Find waso.config.js
let searchDir = process.cwd()
let wasoConfig = null
while (wasoConfig === null) {
	const configPath = `${searchDir}/waso.config.js`
	if (fs.existsSync(configPath)) {
		wasoConfig = require(configPath)
	} else {
		searchDir = `${searchDir}/..`
	}

	if (searchDir === '/') {
		throw new Error('Could not find waso.config.js')
	}
}

wasoConfig.run().catch((_err: Error) => {
	// Since Waso already logs errors, we don't need to print it here.
	// However, we do need to exit with a non-zero code.
	process.exit(1)
})
