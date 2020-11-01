#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import 'loud-rejection/register'
import * as yargs from 'yargs'
import { kpy, kpySync } from '../kpy'

runScript(async () => {
  const {
    _: [baseDir, ...inputPatterns],
    ...opt
  } = yargs.demandCommand(2).options({
    silent: {
      type: 'boolean',
      descr: 'Suppress all text output', // todo: desc!
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
    async: {
      type: 'boolean',
      descr: 'Use kpy (async) instead of kpySync (experimental)',
    },
  }).argv

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

  const kpyOpt = {
    baseDir,
    inputPatterns,
    outputDir,
    ...opt,
    noOverwrite: !opt.overwrite,
  }

  if (opt.async) {
    await kpy(kpyOpt)
  } else {
    kpySync(kpyOpt)
  }
})
