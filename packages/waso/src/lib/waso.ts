import fs from 'fs'

import C from 'ansi-colors'
import Glob from 'glob'

import Transformers from './transformers'

type TaskList = { [key: string]: Task }

export interface Logger {
	info(...args: any[]): void
	error(...args: any[]): void
	warn(...args: any[]): void
}

const DefaultLogger = {
	info(...args: any[]) {
		console.log(C.blue(`[* ${this.now()}]`), ...args)
	},

	error(...args: any[]) {
		console.error(C.red(`[* ${this.now()}]`), ...args)
	},

	warn(...args: any[]) {
		console.warn(C.yellow(`[* ${this.now()}]`), ...args)
	},

	now() {
		const pad = (n: number) => n < 10 ? `0${n}` : n
		let d = new Date()
		return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
	},
}

/**
 * The main class for the Waso task runner.
 */
class Waso {
	tasks: TaskList
	logger: Logger

	private alreadyPrintedErrors: boolean

	constructor(tasks: TaskList, logger = DefaultLogger) {
		this.tasks = tasks
		this.logger = logger
		this.alreadyPrintedErrors = false
	}

	get exportedTasks() {
		return Object.keys(this.tasks).filter(i => !i.startsWith('_'))
	}

	async run(taskName: string = 'default') {
		this.logger.info(
			C.bold(`Starting task ${C.green(taskName)}`)
		)
		let startTime = performance.now()

		try {
			await this.tasks[taskName].run(this)
		} catch (ex) {
			this.logger.error(C.bold.red(`Task ${C.green(taskName)} failed`))
			if (!this.alreadyPrintedErrors) {
				this.logger.error((ex as Error).stack)
				this.alreadyPrintedErrors = true
			}
			throw ex
		}

		let time = Math.round((performance.now() - startTime) / 10) / 100
		this.logger.info(C.bold(
			`Finished task ${C.blue(taskName)} in ` +
			C.blue(String(time) + 's')
		))
	}

	public static source = Transformers.source
	public static incremental = Transformers.incremental
	public static renamer = Transformers.renamer
	public static flatten = Transformers.flatten
	public static target = Transformers.target
	public static concat = Transformers.concat
}

export type File = {
	path: string
	content: Buffer | string
}
export type Options = {
	logger: Logger | null
	sourceGlob: string[]
}
type Transformer =
	(input: AsyncGenerator<File>, options?: Options) => AsyncGenerator<File>

class Task {
	private wasoInstance: Waso | null
	private steps: Transformer[]
	private options: Options
	private action: (() => Promise<void>) | null

	constructor(steps: Transformer[] = []) {
		this.wasoInstance = null
		this.steps = steps
		this.options = {
			logger: null,
			sourceGlob: [],
		}
		this.action = null
	}

	static parallel(tasks: string[]) {
		let task = new Task()
		task.action = async () => {
			let waso = task.wasoInstance!
			await Promise.all(tasks.map(t => waso.run(t)))
		}
		return task
	}

	static series(tasks: string[]) {
		let task = new Task()

		task.action = async () => {
			let waso = task.wasoInstance!
			await tasks.reduce(
				(p, t) => p.then(() => waso.run(t)),
				Promise.resolve()
			)
		}
		return task
	}

	async run(waso: Waso) {
		this.wasoInstance = waso
		this.options.logger = waso.logger

		if (this.action !== null) {
			await this.action()
			return
		}

		// Compose all the steps such that each generator's output is piped
		// into the next one
		let parent = this
		let fn = this.steps.reduce(
			(acc, cur) =>
			async function* (input: AsyncGenerator<File>) {
				yield* cur(acc(input), parent.options)
			},
			async function* () { }
		)

		// Run it with an input of an empty iterator
		let nullGenerator: () => AsyncGenerator<File> = async function* () {}
		for await ( let _ of fn(nullGenerator()) ) {}

		return
	}
}

export { Waso, Task }
