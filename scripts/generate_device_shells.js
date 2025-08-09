/* eslint-disable */
import { writeFileSync, mkdirSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const shouldInsert = !!(SUPABASE_URL && SERVICE_KEY);
const supabase = shouldInsert ? createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } }) : null;

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function sampleMany(arr, k) { const s = [...arr].sort(() => Math.random() - 0.5); return s.slice(0, k); }
function hexHash(len=16){const c='abcdef0123456789';let s='';for(let i=0;i<len;i++) s+=c[Math.floor(Math.random()*c.length)];return s;}

const iosBuilds = [
  { ver: 'iOS 18.0', build: '22A3354' },
  { ver: 'iOS 17.5', build: '21F79' },
  { ver: 'iOS 17.4', build: '21E219' },
  { ver: 'iOS 16.7', build: '20H120' },
];
const androidBuilds = [
  { ver: 'Android 15', build: 'AP4A.250105.001' },
  { ver: 'Android 14', build: 'UP1A.231105.003' },
  { ver: 'Android 13', build: 'TP1A.220624.014' },
];
const macBuilds = [
  { ver: 'macOS 14.6', build: '23G80' },
  { ver: 'macOS 14.5', build: '23F79' },
  { ver: 'macOS 13.6', build: '22G120' },
];
const winBuilds = [
  { ver: 'Windows 11 23H2', build: '22631.3593' },
  { ver: 'Windows 11 24H2', build: '26100.2033' },
];

const mobileCatalog = [
  { name: 'iPhone 16 Pro', os: () => pick(iosBuilds), browser: 'Safari', res: '1179x2556', gpu: 'Apple A18 Pro GPU', platform: 'iPhone', dpr: 3 },
  { name: 'iPhone 15', os: () => pick(iosBuilds), browser: 'Safari', res: '1170x2532', gpu: 'Apple A16 GPU', platform: 'iPhone', dpr: 3 },
  { name: 'iPhone 14', os: () => pick(iosBuilds), browser: 'Safari', res: '1170x2532', gpu: 'Apple A15 GPU', platform: 'iPhone', dpr: 3 },
  { name: 'Galaxy S24 Ultra', os: () => pick(androidBuilds), browser: 'Chrome', res: '1440x3120', gpu: 'Adreno 750', platform: 'Linux armv8l', dpr: 3.5 },
  { name: 'Pixel 9 Pro', os: () => pick(androidBuilds), browser: 'Chrome', res: '1344x2992', gpu: 'Immortalis-G720', platform: 'Linux armv8l', dpr: 3 },
  { name: 'Huawei Mate 60', os: () => ({ ver: 'Android 14', build: 'HMA-AL00.14' }), browser: 'Chrome', res: '1220x2688', gpu: 'Mali-G710', platform: 'Linux armv8l', dpr: 2.7 },
  { name: 'Xiaomi 14', os: () => pick(androidBuilds), browser: 'Chrome', res: '1200x2670', gpu: 'Adreno 750', platform: 'Linux armv8l', dpr: 2.8 },
  { name: 'Oppo Find X7', os: () => pick(androidBuilds), browser: 'Chrome', res: '1264x2780', gpu: 'Mali-G715', platform: 'Linux armv8l', dpr: 2.9 },
  { name: 'OnePlus 12', os: () => pick(androidBuilds), browser: 'Chrome', res: '1440x3168', gpu: 'Adreno 750', platform: 'Linux armv8l', dpr: 3.3 },
  { name: 'Galaxy S23', os: () => pick(androidBuilds), browser: 'Chrome', res: '1080x2340', gpu: 'Adreno 740', platform: 'Linux armv8l', dpr: 2.75 },
];

const desktopCatalog = [
  { name: 'MacBook Pro 16" (M3 Pro)', os: () => pick(macBuilds), browser: () => pick(['Chrome','Safari','Firefox']), res: () => pick(['3456x2234','3024x1964','2560x1600']), gpu: 'Apple M3 Pro', platform: 'MacIntel' },
  { name: 'MacBook Air 15" (M2)', os: () => pick(macBuilds), browser: () => pick(['Chrome','Safari','Firefox']), res: () => pick(['2880x1864','2560x1600']), gpu: 'Apple M2', platform: 'MacIntel' },
  { name: 'iMac 24" (M3)', os: () => pick(macBuilds), browser: () => pick(['Chrome','Safari','Firefox']), res: () => '4480x2520', gpu: 'Apple M3', platform: 'MacIntel' },
  { name: 'Windows 11 Tower (RTX 4090)', os: () => pick(winBuilds), browser: () => pick(['Chrome','Firefox','Edge']), res: () => pick(['3840x2160','2560x1440']), gpu: 'NVIDIA GeForce RTX 4090', platform: 'Win32' },
  { name: 'Windows 11 Desktop (RTX 4080 Super)', os: () => pick(winBuilds), browser: () => pick(['Chrome','Firefox','Edge']), res: () => pick(['3840x2160','2560x1440']), gpu: 'NVIDIA GeForce RTX 4080 SUPER', platform: 'Win32' },
  { name: 'Windows 11 Desktop (RX 7900 XTX)', os: () => pick(winBuilds), browser: () => pick(['Chrome','Firefox','Edge']), res: () => pick(['3840x2160','2560x1440']), gpu: 'AMD Radeon RX 7900 XTX', platform: 'Win32' },
];

const commonFonts = ['Arial','Helvetica','Times New Roman','Courier New','Verdana','Georgia','Tahoma'];
const appleFonts = ['San Francisco','SF Pro Text','Helvetica Neue'];
const pluginsSafari = ['WebKit built-in PDF'];
const pluginsChrome = ['Chromium PDF Viewer','Widevine CDM'];
const pluginsFirefox = ['OpenH264 Video Codec','Widevine CDM'];

function uaForMobile(name, os, browser) {
  if (browser === 'Safari') {
    // iPhone
    return `Mozilla/5.0 (iPhone; CPU iPhone OS ${os.ver.replace('iOS ','').replace('iPadOS ','').replace(/\s/g,'_')} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1`;
  }
  // Android Chrome
  const model = name.replace(/\s+/g,' ');
  return `Mozilla/5.0 (Linux; Android ${os.ver.replace('Android ','')}; ${model}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${pick(['120.0.0.0','121.0.6167.85','122.0.6261.69'])} Mobile Safari/537.36`;
}

function uaForDesktop(os, browser, platform) {
  if (platform === 'MacIntel') {
    const ch = pick(['120.0.6099.129','121.0.6167.85','122.0.6261.69']);
    const fx = pick(['123.0','124.0','125.0']);
    if (browser === 'Safari') return `Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15`;
    if (browser === 'Chrome') return `Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${ch} Safari/537.36`;
    return `Mozilla/5.0 (Macintosh; Intel Mac OS X 14.5; rv:${fx}) Gecko/20100101 Firefox/${fx}`;
  }
  // Windows
  const ch = pick(['120.0.6099.129','121.0.6167.85','122.0.6261.69']);
  const fx = pick(['123.0','124.0','125.0']);
  if (browser === 'Edge') return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${ch} Safari/537.36 Edg/120.0.2210.91`;
  if (browser === 'Chrome') return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${ch} Safari/537.36`;
  return `Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:${fx}) Gecko/20100101 Firefox/${fx}`;
}

function buildFingerprint({browser, os, gpu, platform, dpr, res}) {
  const parts = res.split('x');
  const width = parseInt(parts[0]);
  const height = parseInt(parts[1]);
  const isSafari = browser === 'Safari';
  const isFirefox = browser === 'Firefox';
  return {
    canvas_hash: hexHash(16),
    audio_hash: hexHash(16),
    webgl: { vendor: /Apple|M/.test(gpu) ? 'Apple Inc.' : (/NVIDIA|Adreno/.test(gpu) ? 'Google Inc.' : 'Mozilla'), renderer: gpu },
    timezone_offset: pick([-480,-420,-360,-300,-60,0,60,120,330,480,540,600]),
    fonts: [...commonFonts, ...(platform==='MacIntel' ? appleFonts : [])],
    plugins: isSafari ? pluginsSafari : (isFirefox ? pluginsFirefox : pluginsChrome),
    languages: pick([['en-US'],['en-GB'],['en-US','es-ES'],['de-DE'],['fr-FR'],['nl-NL']]),
    touch_support: platform !== 'Win32' || width < 1400,
    hardware_concurrency: pick([4,6,8,10,12,16]),
    device_memory: pick([4,6,8,12,16,32]),
    pixel_ratio: dpr || pick([1,1.25,1.5,2,2.5,3]),
    screen: { width, height, availWidth: width, availHeight: height },
  };
}

function generateDevices(total=3000) {
  const mobileTarget = Math.floor(total*0.7); const desktopTarget = total - mobileTarget;
  const out = [];

  for (let i=0;i<mobileTarget;i++) {
    const base = pick(mobileCatalog);
    const os = base.os();
    const browser = base.browser;
    const fp = buildFingerprint({ browser, os: os.ver, gpu: base.gpu, platform: base.platform, dpr: base.dpr, res: base.res });
    const ua = uaForMobile(base.name, os, browser);
    out.push({
      id: randomUUID(),
      device_name: base.name,
      type: 'mobile',
      os: `${os.ver} (${os.build})`,
      os_build: os.build,
      browser: browser,
      browser_version: browser === 'Safari' ? '17.x' : pick(['120','121','122']),
      viewport: base.res,
      user_agent: ua,
      platform: base.platform,
      gpu: base.gpu,
      fingerprint: fp,
    });
  }

  for (let i=0;i<desktopTarget;i++) {
    const base = pick(desktopCatalog);
    const os = base.os();
    const browser = typeof base.browser === 'function' ? base.browser() : base.browser;
    const res = typeof base.res === 'function' ? base.res() : base.res;
    const fp = buildFingerprint({ browser, os: os.ver, gpu: base.gpu, platform: base.platform, res });
    const ua = uaForDesktop(os, browser, base.platform);
    out.push({
      id: randomUUID(),
      device_name: base.name,
      type: 'desktop',
      os: `${os.ver} (${os.build || ''})`.trim(),
      os_build: os.build || null,
      browser: browser,
      browser_version: browser === 'Safari' ? '17.x' : pick(['120','121','122','123']),
      viewport: res,
      user_agent: ua,
      platform: base.platform,
      gpu: base.gpu,
      fingerprint: fp,
    });
  }

  return out;
}

async function insertSupabase(devices) {
  if (!shouldInsert) return;
  console.log('Inserting devices into Supabase...');
  const rows = devices.map(d => ({
    id: d.id,
    device_name: d.device_name,
    browser_type: d.browser,
    viewport: d.viewport,
    os: d.os,
    user_agent: d.user_agent,
    platform: d.platform,
    fingerprint_config: {
      type: d.type,
      os_build: d.os_build,
      browser_version: d.browser_version,
      gpu: d.gpu,
      ...d.fingerprint,
    },
    status: 'active',
  }));

  const chunkSize = 500; let inserted = 0;
  for (let i=0;i<rows.length;i+=chunkSize) {
    const slice = rows.slice(i,i+chunkSize);
    const { error } = await supabase.from('devices').insert(slice, { returning: 'minimal' });
    if (error) { console.error('Insert error:', error.message); process.exit(1); }
    inserted += slice.length;
    console.log(`  ${inserted}/${rows.length}`);
  }
  console.log('Device insert complete');
}

async function main() {
  const devices = generateDevices(3000);
  mkdirSync('data', { recursive: true });
  writeFileSync('data/device-shells.json', JSON.stringify(devices, null, 2));
  console.log('Wrote data/device-shells.json');
  await insertSupabase(devices);
}

main().catch(err => { console.error(err); process.exit(1); });