import { pMap } from '@naturalcycles/promise-lib'
import globby from 'globby'
import { promisify } from 'util'
import * as yargs from 'yargs'
const rimraf = promisify(require('rimraf'))

export interface DelOptions {
  /**
   * Globby patterns.
   */
  patterns: string[]

  /**
   * @default 0 (infinite)
   */
  concurrency?: number

  verbose?: boolean

  silent?: boolean

  debug?: boolean

  dry?: boolean
}

const DEF_OPT: DelOptions = {
  patterns: [],
  concurrency: Number.POSITIVE_INFINITY,
}

export async function delCommand (): Promise<void> {
  const { _: patterns, verbose, silent, debug, dry, concurrency } = yargs.demandCommand(1).options({
    verbose: {
      type: 'boolean',
    },
    silent: {
      type: 'boolean',
    },
    debug: {
      type: 'boolean',
    },
    dry: {
      type: 'boolean',
    },
    concurrency: {
      type: 'number',
    },
  }).argv

  await del({ patterns, concurrency, verbose, silent, debug, dry })
}

/**
 * Delete files that match input patterns.
 */
export async function del (_opt: DelOptions): Promise<void> {
  const d = Date.now()
  const opt = {
    ...DEF_OPT,
    ..._opt,
    concurrency: _opt.concurrency || DEF_OPT.concurrency,
  }
  const { patterns, concurrency, verbose, silent, debug, dry } = opt

  if (debug) {
    console.log(opt)
  }

  const filenames = await globby(patterns, {
    dot: true,
    onlyFiles: false,
  })

  if (verbose || dry) console.log(`Will delete ${filenames.length} files:`, filenames)
  if (dry) return

  await pMap(
    filenames,
    async filepath => {
      await rimraf(filepath, { glob: false })
    },
    { concurrency },
  )

  if (!silent) console.log(`del deleted ${filenames.length} files in ${Date.now() - d} ms`)
}
