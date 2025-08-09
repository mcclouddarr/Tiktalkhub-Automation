/* eslint-disable */
import http from 'http'
import fetch from 'node-fetch'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const PROVIDER = process.env.VANTA_PROVIDER || (OPENAI_API_KEY ? 'openai' : 'cloudflare')

async function callOpenAI(prompt){
  const system = 'You output ONLY a JSON array of Playwright actions. No prose. Keep actions safe and short.'
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.VANTA_MODEL || 'gpt-4o-mini',
      messages: [ { role: 'system', content: system }, { role: 'user', content: prompt } ],
      temperature: 0.2
    })
  })
  const json = await resp.json()
  const text = json?.choices?.[0]?.message?.content || '[]'
  try { return JSON.parse(text) } catch { return [] }
}

async function callCloudflare(prompt){
  const accountId = process.env.CF_ACCOUNT_ID
  const token = process.env.CF_API_TOKEN
  const model = process.env.VANTA_MODEL || '@cf/meta/llama-3.1-8b-instruct'
  const system = 'Return only a JSON array of Playwright actions. No prose.'
  const resp = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [ { role: 'system', content: system }, { role: 'user', content: prompt } ] })
  })
  const json = await resp.json()
  const text = json?.result?.response || '[]'
  try { return JSON.parse(text) } catch { return [] }
}

function rulesPlan(ctx){
  const steps=[]
  if (ctx.target?.includes('google')){
    steps.push({ action: 'open', url: 'https://www.google.com' })
    steps.push({ action: 'wait', ms: 1200 })
  } else if (ctx.target?.includes('youtube')){
    steps.push({ action: 'open', url: 'https://www.youtube.com' })
    steps.push({ action: 'wait', ms: 2000 })
  } else if (ctx.target?.includes('tiktok')){
    steps.push({ action: 'open', url: 'https://www.tiktok.com' })
    steps.push({ action: 'wait', ms: 2500 })
  } else if (ctx.target){
    steps.push({ action: 'open', url: ctx.target })
    steps.push({ action: 'wait', ms: 1500 })
  }
  steps.push({ action: 'scroll' })
  steps.push({ action: 'wait', ms: 1200 })
  return steps
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/plan'){
    try{
      const chunks=[]; for await (const c of req) chunks.push(c)
      const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'))
      const { campaign, target } = body || {}
      const prompt = `Generate a short JSON array of Playwright actions. Target: ${target}. Platform: ${campaign?.traffic_source}. Avoid destructive actions. Keep it reliable.`
      let steps = []
      if (PROVIDER === 'openai') steps = await callOpenAI(prompt)
      if (!steps?.length) steps = await callCloudflare(prompt)
      if (!steps?.length) steps = rulesPlan({ target, campaign })
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: true, steps }))
    } catch(e){
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: String(e) }))
    }
    return
  }
  if (req.method === 'POST' && req.url === '/retrain'){
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true }))
    return
  }
  res.writeHead(404)
  res.end()
})

const PORT = process.env.VANTA_PORT || 4100
console.log('Vanta service provider:', PROVIDER)
server.listen(PORT, () => console.log('Vanta service listening on', PORT))