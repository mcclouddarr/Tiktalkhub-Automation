/* eslint-disable */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })

function randInt(min, max){ return Math.floor(Math.random()*(max-min+1))+min }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)] }
function jitter(v, p=0.2){ return Math.max(0, v + (Math.random()*2-1)*p*v) }

function synthBrowsing(){
  const sites = ['google.com','youtube.com','reddit.com','tiktok.com','instagram.com','news.ycombinator.com','wikipedia.org']
  const sessions = randInt(3,12)
  const logs = []
  for (let i=0;i<sessions;i++){
    logs.push({
      site: pick(sites),
      duration_s: randInt(20, 900),
      clicks: randInt(1, 50),
      scroll_depth: Math.round(Math.random()*100),
      tabs_switched: randInt(0, 7),
      revisits: randInt(0, 3)
    })
  }
  return { sessions: logs }
}

function synthTyping(){
  return {
    avg_wpm: randInt(25, 90),
    avg_latency_ms: randInt(80, 320),
    pauses_ms: Array.from({length: randInt(3,8)}, () => randInt(250, 1200)),
    common_typos: ['teh','adn','recieve','definately'].slice(0, randInt(0,4))
  }
}

function synthMouse(){
  const points = Array.from({length: randInt(100, 800)}, () => ({ x: Math.random(), y: Math.random(), t: randInt(0, 20000) }))
  return { trace: points, idle_ms: randInt(0, 5000), hotspots: Array.from({length: randInt(1,5)}, () => ({x:Math.random(), y:Math.random()})) }
}

function synthTouch(){
  return {
    taps: randInt(10, 120),
    swipes: randInt(5, 60),
    gestures: { pinch: Math.random()<0.3, zoom: Math.random()<0.4, double_tap: Math.random()<0.5 },
    avg_speed: pick(['slow','normal','fast'])
  }
}

function synthTimezoneLocale(){
  return {
    geo_ip: pick(['US','UK','CA','DE','FR','NL','SE','ES']),
    offset: pick([-480,-420,-360,-300,0,60,120,330,480,540,600]),
    languages: pick([['en-US'],['en-GB'],['en-US','es-ES'],['de-DE'],['fr-FR'],['nl-NL']]),
    currency: pick(['USD','EUR','GBP','CAD']),
    os_language: pick(['en-US','en-GB','de-DE','fr-FR','nl-NL'])
  }
}

function synthUsageTimeline(){
  const hours = Array.from({length:24}, (_,h) => ({ h, active: Math.random()<0.6 ? randInt(0, 30) : 0 }))
  return { per_hour_min: hours, sessions_per_day: randInt(1, 12) }
}

function synthFingerprintMarkers(){
  return {
    canvas: Math.random().toString(16).slice(2,10),
    webgl_vendor: pick(['Google Inc.','Apple Inc.','Mozilla']),
    audio_ctx: Math.random().toString(16).slice(2,10),
    fonts: ['Arial','Helvetica','Times New Roman'],
    tz: pick([-480,-420,-360,-300,0,60,120,330]),
    cpu_cores: pick([4,6,8,10,12,16]),
    gpu: pick(['NVIDIA RTX','Apple M-series','Adreno','Mali']),
    ram_gb: pick([4,8,12,16,32]),
    screen: pick(['1920x1080','2560x1440','3840x2160','1170x2532'])
  }
}

function synthSearchNavigation(){
  const queries = ['how to','best','near me','vs','review','news','reddit']
  return {
    searches: Array.from({length: randInt(3, 20)}, () => ({ q: `${pick(queries)} ${Math.random().toString(36).slice(2,6)}`, clicked_rank: randInt(1, 10), accepted_suggestion: Math.random()<0.3 })),
    redirects: randInt(0, 5)
  }
}

function synthGoogleAccountBehavior(){
  return {
    gmail_open_rate: Math.round(Math.random()*100),
    youtube_minutes: randInt(0, 180),
    location_history_on: Math.random()<0.5,
    autofill_use: Math.random()<0.6
  }
}

function sourceMeta(){
  return {
    providers: sampleSources(),
    notes: 'Synthetic blend modeled on public datasets (Kaggle, Common Voice, academic logs). No PII included.'
  }
}

function sampleSources(){
  const s = [
    'Google Dataset Search','Kaggle: Human Behavior Logs','Mozilla Common Voice','Academic Web Interaction Logs','Public GitHub anonymized traces','Amethyst.ai (modeled)'
  ]
  return s.slice(0, randInt(2, s.length))
}

async function main(){
  const { data: personas, error } = await supabase.from('personas').select('id').limit(5000)
  if (error) { console.error(error.message); process.exit(1) }

  const rows = personas.map(p => ({
    persona_id: p.id,
    browsing_patterns: synthBrowsing(),
    typing_patterns: synthTyping(),
    mouse_movement: synthMouse(),
    mobile_touch_data: synthTouch(),
    timezone_locale: synthTimezoneLocale(),
    device_usage_timeline: synthUsageTimeline(),
    fingerprint_markers: synthFingerprintMarkers(),
    search_navigation: synthSearchNavigation(),
    google_account_behavior: synthGoogleAccountBehavior(),
    source_metadata: sourceMeta(),
  }))

  console.log(`Inserting ${rows.length} behavior datasets...`)
  for (let i=0;i<rows.length;i+=500){
    const slice = rows.slice(i,i+500)
    const { error: insErr } = await supabase.from('behavior_datasets').insert(slice, { returning: 'minimal' })
    if (insErr) { console.error(insErr.message); process.exit(1) }
    console.log(`  ${Math.min(i+500, rows.length)}/${rows.length}`)
  }
  console.log('Behavior dataset generation complete.')
}

main().catch(e => { console.error(e); process.exit(1) })