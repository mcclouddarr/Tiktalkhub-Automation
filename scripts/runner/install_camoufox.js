#!/usr/bin/env node
/* eslint-disable */
import { spawnSync } from 'child_process'

function run(cmd, args, opts={}){
  const r = spawnSync(cmd, args, { stdio: 'inherit', ...opts })
  if (r.status !== 0) process.exit(r.status || 1)
}

const py = process.env.CAMOUFOX_PYTHON || 'python3'
console.log('Installing camoufox...')
run(py, ['-m','pip','install','-U','camoufox[geoip]'])
console.log('Fetching camoufox browser...')
run('bash', ['-lc', `${py} -m camoufox fetch`])
console.log('Camoufox setup complete.')