/* eslint-disable */
import http from 'http'
import fetch from 'node-fetch'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const PROVIDER = process.env.VANTA_PROVIDER || (OPENAI_API_KEY ? 'openai' : 'rules')

async function callOpenAI(prompt){
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.VANTA_MODEL || 'gpt-4o-mini',
      messages: [ { role: 'system', content: 'You generate human-like browser action sequences for Playwright.' }, { role: 'user', content: prompt } ],
      temperature: 0.4
    })
  })
  const json = await resp.json()
  const text = json?.choices?.[0]?.message?.content || '[]'
  try { return JSON.parse(text) } catch { return [] }
}

function rulesPlan(ctx){
  const steps=[]
  if (ctx.target?.includes('youtube')){
    steps.push({ action: 'open', url: 'https://youtube.com' })
    steps.push({ action: 'wait', ms: 2000 })
    steps.push({ action: 'scroll' })
    steps.push({ action: 'click', selector: '#video-title' })
    steps.push({ action: 'wait', ms: 60000 })
  } else if (ctx.target?.includes('tiktok')){
    steps.push({ action: 'open', url: 'https://www.tiktok.com' })
    steps.push({ action: 'wait', ms: 3000 })
    steps.push({ action: 'scroll' })
    steps.push({ action: 'wait', ms: 5000 })
  } else {
    steps.push({ action: 'open', url: ctx.target || 'https://example.com' })
    steps.push({ action: 'wait', ms: 1500 })
  }
  steps.push({ action: 'wait', ms: 1200 })
  return steps
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/plan'){
    try{
      const chunks=[]; for await (const c of req) chunks.push(c)
      const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'))
      const { persona_id, campaign, target } = body || {}
      let steps
      if (PROVIDER === 'openai'){
        const prompt = `Generate a short JSON array of Playwright actions for a human-like session. Target: ${target}. Platform: ${campaign?.traffic_source}.`
        steps = await callOpenAI(prompt)
      } else {
        steps = rulesPlan({ target, campaign })
      }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true, steps }))
    } catch(e){
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: String(e) }))
    }
    return
  }
  res.writeHead(404)
  res.end()
})

const PORT = process.env.VANTA_PORT || 4100
server.listen(PORT, () => console.log('Vanta service listening on', PORT, 'provider:', PROVIDER))