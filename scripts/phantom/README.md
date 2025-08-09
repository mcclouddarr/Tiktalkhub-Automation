# Phantom Desktop (Chromium fork) – Build Guide

Phantom is a native Chromium-based browser with persona-bound profiles, proxy binding, and stealth hooks. This guide shows you how to clone Chromium and build a Phantom-branded executable on your own machine.

Important: Chromium builds are large and slow. Do this on a dedicated Linux/macOS/Windows machine with:
- Disk: 150–200 GB free
- RAM: 16–32 GB
- CPU: 8+ cores recommended

## 0) High-level options
- Fastest path (recommended now): Use stock Chromium via Playwright and our runner (already working). Set `PHANTOM_EXECUTABLE` later when you have a custom build.
- Full fork: Build Chromium locally with Phantom branding and hooks. Follow steps below.

## 1) Prerequisites
- Git, Python3, clang toolchains per platform
- On Linux (Ubuntu):
  ```bash
  sudo apt-get update
  sudo apt-get install -y git python3 curl lsb-release build-essential pkg-config
  ```
- On macOS: Xcode + Command Line Tools
- On Windows: Visual Studio 2022 + SDKs

## 2) Get depot_tools and Chromium source
```bash
mkdir -p ~/phantom && cd ~/phantom
# depot_tools
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git
export PATH="$(pwd)/depot_tools:$PATH"
# fetch chromium
fetch chromium
cd src
# pull dependencies
gclient sync -D -R
```

If `fetch` is not found, open a new shell after exporting PATH.

## 3) Add Phantom skeleton
From the repo root, copy the skeleton files into your Chromium checkout:
```bash
# Assuming your project repo is at /workspace
# and Chromium is at ~/phantom/src
cp -r /workspace/scripts/phantom/skeleton/chrome/phantom ~/phantom/src/chrome/
```
The skeleton adds:
- `chrome/phantom/` directory for future code (switches, renderer agent injector, etc.)
- A GN args file (see below)

Note: Real hooks require touching Chromium files. Start with branding and command-line wiring later.

## 4) Generate build files
Linux/macOS:
```bash
cd ~/phantom/src
gn gen out/phantom --args="$(cat /workspace/scripts/phantom/args.gn)"
```

Windows (PowerShell):
```powershell
cd $HOME\phantom\src
# Edit args.gn content manually into gn args dialog or provide a path
gn gen out\phantom
```
Then paste args from `/workspace/scripts/phantom/args.gn` into the GN args editor.

## 5) Build
Linux/macOS:
```bash
autoninja -C out/phantom chrome
```
Windows:
```powershell
ninja -C out\phantom chrome
```

Output binary:
- Linux: `~/phantom/src/out/phantom/chrome` (rename to `phantom` if you want)
- macOS: `~/phantom/src/out/phantom/Chromium.app` (bundle)
- Windows: `~/phantom/src/out/phantom/chrome.exe`

## 6) Use with the runner
Set environment variables on your runner machine and start the runner:
```bash
export PHANTOM_EXECUTABLE=~/phantom/src/out/phantom/chrome
export PHANTOM_EXTRA_ARGS="--remote-debugging-port=9222"
node scripts/runner/server.js
```
Now, when you start a task in the app, the runner will launch your Phantom build with proper flags, fingerprint init script, proxies, and cookies.

## 7) Where do code changes go later?
- CLI switches: `chrome/phantom/phantom_switches.*` + hook in browser startup
- Per-profile proxy: `chrome/phantom/phantom_proxy_service.*` + hook in `ProfileNetworkContextService`
- Renderer agent injection: `chrome/phantom/renderer/fingerprint_agent.js` and injector in `chrome/renderer/*`
- Cookie import/export: `chrome/phantom/session/*` and browser lifecycle hooks

This repo includes a PoC agent script you can use today via Playwright init script. For a true fork, embed it as a resource and inject at document_start.

## 8) CI and distribution
Chromium is too big for typical free CI. Use a self-hosted builder. Distribute compressed binaries per OS.

## 9) Troubleshooting
- Out of space: ensure >150GB free
- Slow link: use `gclient sync --no-history`
- Build errors: ensure deps per platform (see chromium.org build instructions)

## 10) Need us to do it?
Provide a Linux builder VM (200GB+, 16–32GB RAM). We can log in, run these scripts, apply starter branding, and hand you a Phantom binary to plug in.