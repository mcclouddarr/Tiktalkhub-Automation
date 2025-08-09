export type AutomationDefaults = {
  headless: boolean
  persistPath: string | null
  countryHint: string | null
  devicePreference: 'mobile' | 'desktop' | 'any'
}

const KEY = 'tiktalkhub:automationDefaults'

const defaultValues: AutomationDefaults = {
  headless: false,
  persistPath: null,
  countryHint: null,
  devicePreference: 'any',
}

export function getAutomationDefaults(): AutomationDefaults {
  if (typeof window === 'undefined') return defaultValues
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return defaultValues
    const parsed = JSON.parse(raw)
    return { ...defaultValues, ...parsed }
  } catch {
    return defaultValues
  }
}

export function setAutomationDefaults(next: Partial<AutomationDefaults>) {
  if (typeof window === 'undefined') return
  const current = getAutomationDefaults()
  const merged = { ...current, ...next }
  window.localStorage.setItem(KEY, JSON.stringify(merged))
}