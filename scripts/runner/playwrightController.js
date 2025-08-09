/* eslint-disable */
import { createClient } from '@supabase/supabase-js'
import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = SUPABASE_URL && SERVICE_KEY ? createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } }) : null

async function log(runId, level, message, data){
  if (!supabase) return console.log(`[${level}]`, message, data || '')
  await supabase.from('task_logs').insert({ run_id: runId, level, message, data: data || null })
}

function proxyFromLaunchConfig(launchConfig){
  const p = launchConfig?.proxy
  if (!p) return undefined
  const server = `${p.protocol || 'http'}://${p.server || p.host}:${p.port}`
  return { server, username: p.username || undefined, password: p.password || undefined }
}

function buildInitScript(fp){
  const languages = (fp.languages && JSON.stringify(fp.languages)) || '["en-US","en"]'
  const hw = fp.hardwareConcurrency ?? 8
  const mem = fp.deviceMemory ?? 8
  const tz = fp.timezoneOffset ?? 0
  return `
    Object.defineProperty(navigator, 'languages', { get: () => ${languages} });
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => ${hw} });
    Object.defineProperty(navigator, 'deviceMemory', { get: () => ${mem} });
    try { Intl.DateTimeFormat = class extends Intl.DateTimeFormat { resolvedOptions(){ return { timeZone: '${tz}' } } } } catch(e) {}
  `
}

async function applyCookies(context, preCookies, target){
  if (!Array.isArray(preCookies) || preCookies.length === 0) return
  await context.addCookies(preCookies.map(c => ({ ...c, url: target.startsWith('http') ? target : `https://${c.domain}` })))
}

async function runSteps(page, steps, runId){
  if (!Array.isArray(steps)) return
  for (const step of steps){
    try {
      if (step.action === 'open' && step.url){ await page.goto(step.url, { waitUntil: 'domcontentloaded' }); await log(runId, 'info', 'open', { url: step.url }) }
      if (step.action === 'click' && step.selector){ await page.click(step.selector, { timeout: (step.timeout || 10000) }); await log(runId, 'info', 'click', { selector: step.selector }) }
      if (step.action === 'type' && step.selector && typeof step.text === 'string'){ await page.fill(step.selector, step.text, { timeout: (step.timeout || 10000) }); await log(runId, 'info', 'type', { selector: step.selector }) }
      if (step.action === 'wait' && step.ms){ await page.waitForTimeout(step.ms); await log(runId, 'info', 'wait', { ms: step.ms }) }
      if (step.action === 'scroll'){ await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await log(runId, 'info', 'scroll', {}) }
    } catch(e){ await log(runId, 'warn', 'step_failed', { step, error: String(e) }) }
  }
}

export async function launchSession({ run_id, launchConfig, cookies, target, steps = [] }){
  const outDir = path.resolve(process.cwd(), 'runner_artifacts')
  fs.mkdirSync(outDir, { recursive: true })

  const proxy = proxyFromLaunchConfig(launchConfig)
  const browser = await chromium.launch({ headless: !!launchConfig.headless, proxy })
  const context = await browser.newContext({
    userAgent: launchConfig.headers?.['User-Agent'] || launchConfig.userAgent || undefined,
    viewport: Array.isArray(launchConfig.viewport) ? { width: launchConfig.viewport[0], height: launchConfig.viewport[1] } : undefined,
    recordVideo: { dir: outDir },
  })

  // fingerprint init
  try { await context.addInitScript(buildInitScript(launchConfig.fingerprint || {})) } catch(e) {}

  // tracing
  await context.tracing.start({ screenshots: true, snapshots: true })

  // page
  const page = await context.newPage()
  try{
    await applyCookies(context, cookies, target || 'https://example.com')
    if (target){ await page.goto(target, { waitUntil: 'domcontentloaded' }) }
    await runSteps(page, steps, run_id)

    await log(run_id, 'info', 'session_complete')
  } catch(e){
    await log(run_id, 'error', 'session_error', { error: String(e) })
    throw e
  } finally {
    const traceFile = path.join(outDir, `trace-${run_id}.zip`)
    await context.tracing.stop({ path: traceFile })
    await browser.close()
  }
}