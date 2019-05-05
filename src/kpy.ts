import * as c from 'ansi-colors'
import * as cpFile from 'cp-file'
import * as fs from 'fs-extra'
import globby from 'globby'
import * as moveFile from 'move-file'
import * as path from 'path'
import * as yargs from 'yargs'

export interface KpyOptions {
  baseDir: string
  inputPatterns?: string[]
  outputDir: string
  silent?: boolean
  verbose?: boolean
  noOverwrite?: boolean
  dotfiles?: boolean
  flat?: boolean
  dry?: boolean
  move?: boolean
}

export async function kpyCommand (): Promise<void> {
  const { _: args, silent, verbose, overwrite, dotfiles, flat, dry, move } = yargs
    .demandCommand(2)
    .options({
      silent: {
        type: 'boolean',
        descr: 'Suppress all text output',
      },
      verbose: {
        type: 'boolean',
        descr: 'Report progress on every file',
      },
      overwrite: {
        type: 'boolean',
        default: true,
      },
      dotfiles: {
        type: 'boolean',
      },
      flat: {
        type: 'boolean',
      },
      dry: {
        type: 'boolean',
      },
      move: {
        type: 'boolean',
        descr: 'Move files instead of copy',
      },
    }).argv

  const [baseDir, ...inputPatterns] = args
  const outputDir = inputPatterns.pop()!

  /*
  console.log({
    argv: process.argv,
    baseDir,
    inputPatterns,
    outputDir,
    silent,
    overwrite,
  })*/

  await kpy({
    baseDir,
    inputPatterns,
    outputDir,
    silent,
    verbose,
    noOverwrite: !overwrite,
    dotfiles,
    flat,
    dry,
    move,
  })
}

export async function kpy (opt: KpyOptions): Promise<void> {
  let {
    baseDir,
    inputPatterns,
    outputDir,
    silent,
    verbose,
    noOverwrite,
    dotfiles,
    flat,
    dry,
    move,
  } = opt

  // Default pattern
  inputPatterns = inputPatterns || []
  if (!inputPatterns.length) inputPatterns = ['**']

  baseDir = baseDir || '.' // default to cwd
  outputDir = outputDir || '.' // default to cwd

  if (!fs.existsSync(baseDir)) {
    console.log(`kpy: baseDir doesn't exist: ${baseDir}`)
    return
  }

  const filenames = await globby(inputPatterns, {
    cwd: baseDir,
    dot: dotfiles,
  })

  // console.log({filenames})
  if (!silent) {
    console.log(
      c.grey(
        `Will ${move ? 'move' : 'copy'} ${
          filenames.length
        } files from ${baseDir} to ${outputDir} (${inputPatterns.join(' ')})`,
      ),
    )
  }

  await Promise.all(
    filenames.map(async filename => {
      const basename = path.basename(filename)
      const srcFilename = path.resolve(baseDir, filename)
      const destFilename = path.resolve(outputDir, flat ? basename : filename)

      if (!dry) {
        if (move) {
          await moveFile(srcFilename, destFilename, {
            overwrite: !noOverwrite,
          })
        } else {
          await cpFile(srcFilename, destFilename, {
            overwrite: !noOverwrite,
          })
        }
      }

      if (verbose) {
        console.log(c.grey(`  ${filename}`))
      }

      // console.log({filename, basename, srcFilename, destFilename})
    }),
  )

  if (!silent && filenames.length) {
    console.log(
      c.grey(
        `${move ? 'Moved' : 'Copied'} ${c.grey.bold('' + filenames.length)} files to ${outputDir}`,
      ),
    )
  }
}
