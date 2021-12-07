#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

import yargs from 'yargs/yargs'
import { Waso } from '../lib/waso'

let args = yargs(process.argv.slice(2))
	.positional('task', {
		describe: 'The task to run',
		default: 'default',
	})
	.option('config', {
		alias: 'c',
		describe: 'The path to a custom config file',
	})
	.option('quiet', {
		alias: 'q',
		describe: 'Only output errors',
	})
	.parseSync()

const error = (...args: any[]) => new Waso({}).logger.error(...args)

let wasoConfig
if (args.config !== undefined) {
	try {
		wasoConfig = require(path.resolve(args.config as string))
	} catch (e) {
		error(`Could not load config file ${args.config}`)
		process.exit(1)
	}
}

else {
	// Find waso.config.js
	let searchDir = process.cwd()
	wasoConfig = null
	while (wasoConfig === null) {
		const configPath = `${searchDir}/waso.config.js`
		if (fs.existsSync(configPath)) {
			try {
				wasoConfig = require(configPath)
			} catch (e) {
				error(`Could not load waso.config.js in ${searchDir}`)
				process.exit(1)
			}
		} else {
			searchDir = path.dirname(searchDir)
		}

		if (searchDir === path.dirname(searchDir)) {
			error('Could not find waso.config.js')
			process.exit(1)
		}
	}
}

if (!(wasoConfig instanceof Waso)) {
	error('Config file must export an instance of Waso')
	process.exit(1)
}
if (args.quiet) {
	wasoConfig.logger.info = () => {}
	wasoConfig.logger.warn = () => {}
}
wasoConfig.run().catch((_err: Error) => {
	// Since Waso already logs errors, we don't need to print it here.
	// However, we do need to exit with a non-zero code.
	process.exit(1)
})
