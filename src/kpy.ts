import { _since } from '@naturalcycles/js-lib'
import { boldWhite, dimGrey, grey, yellow } from '@naturalcycles/nodejs-lib/dist/colors'
import * as cpFile from 'cp-file'
import * as fs from 'fs-extra'
import * as globby from 'globby'
import * as moveFile from 'move-file'
import * as path from 'path'

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

export async function kpy(opt: KpyOptions): Promise<void> {
  const started = Date.now()

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
    console.log(`kpy: baseDir doesn't exist: ${boldWhite(baseDir)}`)
    return
  }

  await fs.ensureDir(outputDir)

  const filenames = await globby(inputPatterns, {
    cwd: baseDir,
    dot: dotfiles,
  })

  // console.log({filenames})
  if (!silent) {
    console.log(
      `Will ${move ? 'move' : 'copy'} ${yellow(filenames.length)} files from ${dimGrey(
        baseDir,
      )} to ${dimGrey(outputDir)} (${dimGrey(inputPatterns.join(' '))})`,
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
        console.log(grey(`  ${filename}`))
      }

      // console.log({filename, basename, srcFilename, destFilename})
    }),
  )

  if (!silent && filenames.length) {
    console.log(
      `${move ? 'Moved' : 'Copied'} ${yellow(filenames.length)} files to ${dimGrey(
        outputDir,
      )} ${dimGrey(_since(started))}`,
    )
  }
}
