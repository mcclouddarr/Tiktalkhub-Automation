// PoC fingerprint agent; to be embedded and injected at document_start in an isolated world
(() => {
  const cfg = window.__PHANTOM_FP__ || {};
  const defineRO = (o, k, v) => { try { Object.defineProperty(o, k, { get: () => v, configurable: false }); } catch {} };
  try { if ('webdriver' in Navigator.prototype) Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }); } catch {}
  if (Array.isArray(cfg.languages)) { defineRO(navigator, 'languages', cfg.languages.slice()); defineRO(navigator, 'language', cfg.languages[0] || 'en-US'); }
  if (typeof cfg.hardwareConcurrency === 'number') defineRO(navigator, 'hardwareConcurrency', cfg.hardwareConcurrency);
  if (typeof cfg.deviceMemory === 'number') defineRO(navigator, 'deviceMemory', cfg.deviceMemory);
  if (cfg.canvas_hash) {
    const toDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function(...args){
      try { const ctx = this.getContext('2d'); if (ctx) { ctx.fillStyle = '#00000001'; ctx.fillRect(0,0,1,1); } } catch {}
      return toDataURL.apply(this, args);
    }
  }
  if (cfg.webgl && (cfg.webgl.vendor || cfg.webgl.renderer)){
    const p = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(name){
      if (name === 37445 && cfg.webgl.vendor) return cfg.webgl.vendor;
      if (name === 37446 && cfg.webgl.renderer) return cfg.webgl.renderer;
      return p.call(this, name);
    }
    if (window.WebGL2RenderingContext){
      const p2 = WebGL2RenderingContext.prototype.getParameter;
      WebGL2RenderingContext.prototype.getParameter = function(name){
        if (name === 37445 && cfg.webgl.vendor) return cfg.webgl.vendor;
        if (name === 37446 && cfg.webgl.renderer) return cfg.webgl.renderer;
        return p2.call(this, name);
      }
    }
  }
  if (cfg.audio_hash){
    const gcd = AudioBuffer.prototype.getChannelData;
    AudioBuffer.prototype.getChannelData = function(...a){ const d = gcd.apply(this,a); try { for (let i=0;i<d.length;i+=1000) d[i]+=1e-7 } catch{} return d }
  }
  if (cfg.touchSupport){ defineRO(navigator,'maxTouchPoints',5) }
})();