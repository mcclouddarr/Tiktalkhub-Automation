/* eslint-disable */
import fs from 'fs';

export function buildLaunchConfig(device, options = {}) {
  const fp = device.fingerprint || {};
  const headers = {
    'User-Agent': device.user_agent,
    'Accept-Language': (fp.languages && fp.languages.join(',')) || 'en-US,en;q=0.9',
    'DNT': fp.dnt ? '1' : '0',
  };
  const proxy = options.proxy || null;

  return {
    browser: (device.browser || 'Chrome').toLowerCase(),
    headless: options.headless ?? false,
    viewport: device.viewport?.split('x').map(n => parseInt(n)) || [1280, 800],
    deviceMetrics: {
      width: fp.screen?.width,
      height: fp.screen?.height,
      deviceScaleFactor: fp.pixel_ratio || 1,
      mobile: device.type === 'mobile',
    },
    headers,
    proxy: proxy ? {
      server: `${proxy.host}:${proxy.port}`,
      username: proxy.username,
      password: proxy.password,
      protocol: proxy.protocol || 'http',
    } : null,
    fingerprint: {
      canvas: fp.canvas_hash,
      audio: fp.audio_hash,
      webgl: fp.webgl,
      fonts: fp.fonts,
      plugins: fp.plugins,
      languages: fp.languages,
      timezoneOffset: fp.timezone_offset,
      hardwareConcurrency: fp.hardware_concurrency,
      deviceMemory: fp.device_memory,
      touchSupport: fp.touch_support,
    },
    persistProfilePath: options.persistPath || null,
  };
}

export function persistProfile(path, data) {
  fs.mkdirSync(path, { recursive: true });
  fs.writeFileSync(`${path}/profile.json`, JSON.stringify(data, null, 2));
}

export function loadProfile(path) {
  if (!fs.existsSync(`${path}/profile.json`)) return null;
  return JSON.parse(fs.readFileSync(`${path}/profile.json`, 'utf-8'));
}