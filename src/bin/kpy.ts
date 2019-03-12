#!/usr/bin/env node

import { kpyCLI } from '../kpy'

kpyCLI().catch(err => {
  console.error(err)
  process.exit(1)
})
