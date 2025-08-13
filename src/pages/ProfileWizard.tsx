import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

export default function ProfileWizard(){
  const [tab, setTab] = useState<'general'|'proxy'|'platform'|'fingerprint'|'advanced'>('general')
  const [form, setForm] = useState<any>({
    name: '', engine: 'chromium', browser: 'chrome', os: 'Windows', ua: '',
    group: '', tags: [], cookie: '', proxyType: 'none', proxy: {}, platform: 'none',
    urls: '', webrtc: 'disabled', timezone: 'ip', location: 'ip', language: 'ip', displayLanguage: 'ip',
    screen: 'auto', randomFingerprint: true, dataSync: 'global', browserSettings: 'global',
  })

  const overview = {
    Browser: (form.engine === 'camoufox' ? 'Camoufox' : 'Chromium') + ' [' + (form.browser||'auto') + ']',
    UA: form.ua || 'Auto',
    WebRTC: form.webrtc,
    Timezone: form.timezone,
    Location: form.location,
    Language: form.language,
    DisplayLanguage: form.displayLanguage,
    Screen: form.screen,
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>New Browser Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 mb-4">
              {(['general','proxy','platform','fingerprint','advanced'] as const).map((t)=> (
                <Button key={t} variant={t===tab?'default':'outline'} size="sm" onClick={()=> setTab(t)}>{t[0].toUpperCase()+t.slice(1)}</Button>
              ))}
            </div>

            {tab==='general' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input value={form.name} onChange={(e)=> setForm({...form, name: e.target.value})} placeholder="Optional: profile name" />
                </div>
                <div>
                  <Label>Engine</Label>
                  <Select value={form.engine} onValueChange={(v)=> setForm({...form, engine: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chromium">Chromium</SelectItem>
                      <SelectItem value="camoufox">Camoufox</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>OS</Label>
                  <Select value={form.os} onValueChange={(v)=> setForm({...form, os: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Windows">Windows</SelectItem>
                      <SelectItem value="macOS">macOS</SelectItem>
                      <SelectItem value="Linux">Linux</SelectItem>
                      <SelectItem value="Android">Android</SelectItem>
                      <SelectItem value="iOS">iOS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>User-Agent</Label>
                  <Input value={form.ua} onChange={(e)=> setForm({...form, ua: e.target.value})} placeholder="Mozilla/5.0..." />
                </div>
              </div>
            )}

            {tab==='proxy' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Proxy Type</Label>
                  <Select value={form.proxyType} onValueChange={(v)=> setForm({...form, proxyType: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Proxy</SelectItem>
                      <SelectItem value="saved">Saved Proxies</SelectItem>
                      <SelectItem value="provider">Proxy Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tabs (one per line)</Label>
                  <Input value={form.urls} onChange={(e)=> setForm({...form, urls: e.target.value})} placeholder="www.google.com\nwww.facebook.com" />
                </div>
              </div>
            )}

            {tab==='platform' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Platform</Label>
                  <Select value={form.platform} onValueChange={(v)=> setForm({...form, platform: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['none','facebook.com','amazon.com','linkedin.com','x.com','paypal.com','accounts.google.com','outlook.com','tiktok.com','youtube.com'].map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {tab==='fingerprint' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>WebRTC</Label>
                  <Select value={form.webrtc} onValueChange={(v)=> setForm({...form, webrtc: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forward">Forward</SelectItem>
                      <SelectItem value="replace">Replace</SelectItem>
                      <SelectItem value="real">Real</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Timezone</Label>
                  <Select value={form.timezone} onValueChange={(v)=> setForm({...form, timezone: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ip">Based on IP</SelectItem>
                      <SelectItem value="real">Real</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Location</Label>
                  <Select value={form.location} onValueChange={(v)=> setForm({...form, location: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ip">Based on IP</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                      <SelectItem value="block">Block</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Language</Label>
                  <Select value={form.language} onValueChange={(v)=> setForm({...form, language: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ip">Based on IP</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Display language</Label>
                  <Select value={form.displayLanguage} onValueChange={(v)=> setForm({...form, displayLanguage: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="language">Based on Language</SelectItem>
                      <SelectItem value="real">Real</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Screen Resolution</Label>
                  <Select value={form.screen} onValueChange={(v)=> setForm({...form, screen: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Based on User-Agent</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {tab==='advanced' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data Sync</Label>
                  <Select value={form.dataSync} onValueChange={(v)=> setForm({...form, dataSync: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Use global settings</SelectItem>
                      <SelectItem value="custom">Customize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Browser Settings</Label>
                  <Select value={form.browserSettings} onValueChange={(v)=> setForm({...form, browserSettings: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Use global settings</SelectItem>
                      <SelectItem value="custom">Customize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button className="bg-gradient-primary">Save Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="col-span-1">
        <Card>
          <CardHeader><CardTitle>Profile Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {Object.entries(overview).map(([k,v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-mono">{String(v)}</span>
                </div>
              ))}
              <div className="mt-4 text-xs text-muted-foreground">Set default values in: Preferences...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}