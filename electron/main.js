import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function loadEnvSafely() {
  const candidates = [
    path.join(__dirname, '.env'),
    path.join(process.resourcesPath || process.cwd(), '.env'),
    path.join(process.cwd(), '.env')
  ]
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const contents = fs.readFileSync(p, 'utf8')
        for (const rawLine of contents.split(/\r?\n/)) {
          const line = rawLine.trim()
          if (!line || line.startsWith('#')) continue
          const cleaned = line.startsWith('export ') ? line.slice(7) : line
          const eqIndex = cleaned.indexOf('=')
          if (eqIndex === -1) continue
          const key = cleaned.slice(0, eqIndex).trim()
          let value = cleaned.slice(eqIndex + 1).trim()
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
            value = value.slice(1, -1)
          }
          if (process.env[key] === undefined) process.env[key] = value
        }
        break
      }
    } catch {}
  }
}

loadEnvSafely()

app.setName('Tiktalkhub Automation')

const PHANTOM_EXECUTABLE_DEFAULT = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const PHANTOM_EXTRA_ARGS_DEFAULT = '--remote-debugging-port=9222 --force-webrtc-ip-handling-policy=disable_non_proxied_udp --disable-webrtc-multiple-routes --no-default-browser-check --no-first-run'
const BEHAVIOR_DEFAULTS_DEFAULT = '{"delayMultiplier":1.2,"randomness":0.25}'

let children = []

function startService(scriptRelPath, extraEnv = {}){
  const scriptPath = path.join(process.resourcesPath || process.cwd(), scriptRelPath)
  const env = {
    ...process.env,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    PHANTOM_EXECUTABLE: process.env.PHANTOM_EXECUTABLE || PHANTOM_EXECUTABLE_DEFAULT,
    PHANTOM_EXTRA_ARGS: process.env.PHANTOM_EXTRA_ARGS || PHANTOM_EXTRA_ARGS_DEFAULT,
    BEHAVIOR_DEFAULTS: process.env.BEHAVIOR_DEFAULTS || BEHAVIOR_DEFAULTS_DEFAULT,
    ...extraEnv,
  }
  const cmd = process.platform === 'win32' ? 'node.exe' : 'node'
  const child = spawn(cmd, [scriptPath], { env, stdio: 'inherit' })
  children.push(child)
  child.on('exit', (code) => { console.log(`${scriptRelPath} exited`, code) })
}

function createWindow(){
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: { nodeIntegration: false, contextIsolation: true }
  })
  const indexPath = path.join(process.resourcesPath || process.cwd(), 'dist', 'index.html')
  win.loadFile(indexPath)
}

app.whenReady().then(() => {
  startService(path.join('scripts','runner','server.js'))
  startService(path.join('scripts','scheduler','worker.js'))
  startService(path.join('scripts','proxies','score_worker.js'))
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  children.forEach((c) => { try { c.kill() } catch {} })
})