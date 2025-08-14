function uuid(){
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return (crypto as any).randomUUID()
  // fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  })
}

export type LaunchOptions = {
  engine?: 'chromium'|'camoufox'
  headless?: boolean
  target?: string | null
  cookies?: any[]
  viewport?: [number, number]
  headers?: Record<string,string>
  proxy?: { server: string; username?: string; password?: string; protocol?: string }
}

export async function launchSteps(steps: any[], opts: LaunchOptions = {}){
  const run_id = uuid()
  const payload: any = {
    engine: opts.engine || 'chromium',
    launchConfig: {
      headless: !!opts.headless,
      viewport: opts.viewport || [1280, 800],
      headers: opts.headers || {},
      proxy: opts.proxy || undefined,
      fingerprint: {},
    },
    cookies: Array.isArray(opts.cookies) ? opts.cookies : [],
    target: opts.target || null,
    steps: steps || [],
  }
  const resp = await fetch('http://127.0.0.1:4000/launch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ run_id, payload })
  })
  if (!resp.ok){
    const text = await resp.text()
    throw new Error(`Launch failed: ${resp.status} ${text}`)
  }
  return { run_id }
}