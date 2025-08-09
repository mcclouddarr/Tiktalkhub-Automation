export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(env) })
    }

    if (request.method === 'POST' && url.pathname === '/plan') {
      try {
        const body = await request.json()
        const { target, campaign } = body || {}
        const model = env.VANTA_MODEL || '@cf/meta/llama-3.1-8b-instruct'
        const prompt = `Return ONLY a JSON array of Playwright actions (no prose). Target: ${target}. Platform: ${campaign?.traffic_source}. Keep it short and safe.`
        let steps = []
        try {
          const aiResp = await env.AI.run(model, {
            messages: [
              { role: 'system', content: 'Return only a JSON array. No prose.' },
              { role: 'user', content: prompt }
            ]
          })
          steps = parseSteps(aiResp?.response)
        } catch (e) {
          steps = rulesPlan({ target, campaign })
        }
        return json({ ok: true, steps }, env)
      } catch (e) {
        return json({ ok: false, error: String(e) }, env, 500)
      }
    }

    if (request.method === 'POST' && url.pathname === '/retrain') {
      // Placeholder retrain endpoint
      return json({ ok: true }, env)
    }

    return new Response('Not found', { status: 404, headers: corsHeaders(env) })
  }
}

function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env.ACCESS_CONTROL_ALLOW_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  }
}

function json(data, env, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders(env) })
}

function parseSteps(text) {
  if (!text) return []
  // Try direct JSON
  try { return JSON.parse(text) } catch {}
  // Try to extract first JSON array
  const match = text.match(/\[([\s\S]*?)\]/)
  if (match) {
    try { return JSON.parse(match[0]) } catch {}
  }
  return []
}

function rulesPlan(ctx){
  const steps=[]
  const target = (ctx.target || '').toLowerCase()
  if (target.includes('youtube')){
    steps.push({ action: 'open', url: 'https://youtube.com' })
    steps.push({ action: 'wait', ms: 2000 })
    steps.push({ action: 'scroll' })
    steps.push({ action: 'wait', ms: 1500 })
  } else if (target.includes('tiktok')){
    steps.push({ action: 'open', url: 'https://www.tiktok.com' })
    steps.push({ action: 'wait', ms: 2500 })
    steps.push({ action: 'scroll' })
  } else {
    steps.push({ action: 'open', url: ctx.target || 'https://example.com' })
    steps.push({ action: 'wait', ms: 1200 })
  }
  return steps
}