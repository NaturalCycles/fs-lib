import * as c from 'ansi-colors'
import cpFile from 'cp-file'
import globby from 'globby'
import * as path from 'path'
import * as yargs from 'yargs'

export interface KpyOptions {
  baseDir: string
  inputPatterns: string[]
  outputDir: string
  progress?: boolean
  dontOverwrite?: boolean
}

export async function kpyCLI (): Promise<void> {
  const { _: args, progress, overwrite } = yargs.demandCommand(2).options({
    progress: {
      type: 'boolean',
    },
    overwrite: {
      type: 'boolean',
      default: true,
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
    progress,
    overwrite,
  })*/

  await kpy({
    baseDir,
    inputPatterns,
    outputDir,
    progress,
    dontOverwrite: !overwrite,
  })
}

export async function kpy (opt: KpyOptions): Promise<void> {
  let { baseDir, inputPatterns, outputDir, progress, dontOverwrite } = opt

  // Default pattern
  if (!inputPatterns.length) inputPatterns = ['**']

  const filenames = await globby(inputPatterns, {
    cwd: baseDir,
  })

  // console.log({filenames})

  await Promise.all(
    filenames.map(async filename => {
      const srcFilename = path.resolve(baseDir, filename)
      const destFilename = path.resolve(outputDir, filename)

      await cpFile(srcFilename, destFilename, {
        overwrite: !dontOverwrite,
      })

      if (progress) {
        console.log(c.grey(`${filename}`))
      }
      // console.log({srcFilename, destFilename})
    }),
  )

  if (progress) {
    console.log(c.grey(`copied ${c.grey.bold('' + filenames.length)} files to ${outputDir}`))
  }
}
