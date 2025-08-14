/* eslint-disable */
import { spawn } from 'child_process'
import { connect } from 'playwright'

function wait(ms){ return new Promise(r => setTimeout(r, ms)) }

export async function startCamoufoxServer({ port, wsPath = '/playwright', proxy, geoip = true, pythonPath, env = {} }){
  const py = pythonPath || process.env.CAMOUFOX_PYTHON || 'python3'
  const args = ['-m', 'camoufox', 'server', '--port', String(port), '--ws-path', wsPath]
  if (geoip) args.push('--geoip')
  if (proxy?.server) {
    args.push('--proxy', proxy.server)
    if (proxy.username) args.push('--proxy-username', proxy.username)
    if (proxy.password) args.push('--proxy-password', proxy.password)
  }
  const child = spawn(py, args, { stdio: 'inherit', env: { ...process.env, ...env } })
  const endpoint = `ws://127.0.0.1:${port}${wsPath}`
  // simple readiness wait; in production switch to log-based detection
  await wait(1500)
  return { child, endpoint }
}

export async function runWithCamoufox({ wsEndpoint, launchConfig, cookies, target, steps, log }){
  const browser = await connect({ wsEndpoint })
  const context = await browser.newContext({
    userAgent: launchConfig.headers?.['User-Agent'] || launchConfig.userAgent || undefined,
    viewport: Array.isArray(launchConfig.viewport) ? { width: launchConfig.viewport[0], height: launchConfig.viewport[1] } : undefined,
  })
  const page = await context.newPage()
  if (Array.isArray(cookies) && cookies.length) {
    try {
      const url = target && target.startsWith('http') ? target : 'https://example.com'
      await context.addCookies(cookies.map(c => ({ ...c, url })))
    } catch {}
  }
  if (target) await page.goto(target, { waitUntil: 'domcontentloaded' })
  if (Array.isArray(steps)) {
    for (const step of steps) {
      try {
        if (step.action === 'open' && step.url) { await page.goto(step.url, { waitUntil: 'domcontentloaded' }); await log('info','open',{ url: step.url }) }
        if (step.action === 'click' && step.selector) { await page.click(step.selector, { timeout: (step.timeout || 10000) }); await log('info','click',{ selector: step.selector }) }
        if (step.action === 'type' && step.selector && typeof step.text === 'string') { await page.fill(step.selector, step.text, { timeout: (step.timeout || 10000) }); await log('info','type',{ selector: step.selector }) }
        if (step.action === 'wait' && step.ms) { await page.waitForTimeout(step.ms); await log('info','wait',{ ms: step.ms }) }
        if (step.action === 'scroll') { await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await log('info','scroll',{}) }
      } catch(e){ await log('warn','step_failed', { step, error: String(e) }) }
    }
  }
  await browser.close()
}