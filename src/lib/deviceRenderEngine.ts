export type Fingerprint = {
  canvas_hash?: string
  audio_hash?: string
  webgl?: { vendor: string; renderer: string }
  fonts?: string[]
  plugins?: string[]
  languages?: string[]
  timezone_offset?: number
  hardware_concurrency?: number
  device_memory?: number
  touch_support?: boolean
  pixel_ratio?: number
  screen?: { width: number; height: number; availWidth?: number; availHeight?: number }
}

export type DeviceShell = {
  type?: 'mobile' | 'desktop' | 'tablet'
  browser?: string
  viewport?: string
  user_agent?: string
  fingerprint?: Fingerprint
}

export type ProxyConfig = {
  host: string
  port: number
  username?: string | null
  password?: string | null
  protocol?: 'http' | 'https' | 'socks5'
}

export function buildLaunchConfig(device: DeviceShell, options: { proxy?: ProxyConfig | null; headless?: boolean; persistPath?: string | null } = {}) {
  const fp = device.fingerprint || {}
  const headers: Record<string, string> = {
    'User-Agent': device.user_agent || '',
    'Accept-Language': Array.isArray(fp.languages) ? fp.languages.join(',') : 'en-US,en;q=0.9',
  }
  if (typeof (fp as any).dnt === 'boolean') headers['DNT'] = (fp as any).dnt ? '1' : '0'

  const viewport = (device.viewport || '1280x800').split('x').map((n) => parseInt(n))

  return {
    browser: (device.browser || 'Chrome').toLowerCase(),
    headless: options.headless ?? false,
    viewport: viewport as [number, number],
    deviceMetrics: {
      width: fp.screen?.width,
      height: fp.screen?.height,
      deviceScaleFactor: fp.pixel_ratio || 1,
      mobile: device.type === 'mobile',
    },
    headers,
    proxy: options.proxy
      ? {
          server: `${options.proxy.host}:${options.proxy.port}`,
          username: options.proxy.username || undefined,
          password: options.proxy.password || undefined,
          protocol: options.proxy.protocol || 'http',
        }
      : null,
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
  }
}