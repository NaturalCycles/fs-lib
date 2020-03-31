#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import 'loud-rejection/register'
import * as yargs from 'yargs'
import { del } from '../del'

runScript(async () => {
  const { _: patterns, ...opt } = yargs.demandCommand(1).options({
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

  await del({ patterns, ...opt })
})
