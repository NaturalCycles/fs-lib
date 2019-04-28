#!/usr/bin/env node

import { delCommand } from '../del'

delCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
