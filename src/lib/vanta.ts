export async function planSteps(target: string | null, campaign?: any): Promise<any[]> {
  let workerUrl = import.meta.env.VITE_VANTA_WORKER_URL as string
  if (!workerUrl && typeof window !== 'undefined') {
    workerUrl = window.localStorage.getItem('tiktalkhub:vantaWorkerUrl') || ''
  }
  if (!workerUrl) {
    return []
  }
  try{
    const resp = await fetch(`${workerUrl.replace(/\/$/, '')}/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target, campaign })
    })
    const json = await resp.json()
    return Array.isArray(json?.steps) ? json.steps : []
  } catch { return [] }
}