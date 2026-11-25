import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { DashboardStats, Lead, LeadInput } from '../types'
import { formatPhone, normalizeEmail, phoneDigits, validateLead } from '../lib/validation'
import { ApiError, createLead as createLeadRequest, getApiErrorMessage, getDashboardStats, getLeads, updateLead as updateLeadRequest } from '../services/api'

export interface ActionResult {
  ok: boolean
  field?: 'email' | 'phone'
  error?: string
  duplicate?: boolean
}

interface LeadsApi {
  leads: Lead[]
  loading: boolean
  error: string | null
  stats: DashboardStats | null
  statsLoading: boolean
  statsError: string | null
  refreshData: () => Promise<void>
  addLead: (input: LeadInput) => Promise<ActionResult>
  updateLead: (id: string, input: LeadInput) => Promise<ActionResult>
  importLeads: (inputs: LeadInput[]) => Promise<{ added: number; skipped: number; error?: string }>
}

const LeadsContext = createContext<LeadsApi | null>(null)

function findDuplicate(leads: Lead[], input: LeadInput, ignoreId?: string): ActionResult | null {
  const email = normalizeEmail(input.email)
  const phone = phoneDigits(input.phone)
  for (const l of leads) {
    if (l.id === ignoreId) continue
    if (normalizeEmail(l.email) === email) {
      return { ok: false, field: 'email', error: `A lead with this email already exists (${l.name})` }
    }
    if (phoneDigits(l.phone) === phone) {
      return { ok: false, field: 'phone', error: `A lead with this phone number already exists (${l.name})` }
    }
  }
  return null
}

const clean = (input: LeadInput): LeadInput => ({
  ...input,
  name: input.name.trim(),
  company: input.company.trim(),
  email: normalizeEmail(input.email),
  phone: formatPhone(input.phone),
})

export function LeadsProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)

  const refreshData = useCallback(async () => {
    setLoading(true)
    setStatsLoading(true)
    setError(null)
    setStatsError(null)

    const [leadsResult, statsResult] = await Promise.allSettled([getLeads(), getDashboardStats()])
    if (leadsResult.status === 'fulfilled') setLeads(leadsResult.value)
    else setError(getApiErrorMessage(leadsResult.reason))
    if (statsResult.status === 'fulfilled') setStats(statsResult.value)
    else setStatsError(getApiErrorMessage(statsResult.reason))

    setLoading(false)
    setStatsLoading(false)
  }, [])

  useEffect(() => {
    void refreshData()
  }, [refreshData])

  const addLead = useCallback(async (input: LeadInput): Promise<ActionResult> => {
    const normalized = clean(input)
    const duplicate = findDuplicate(leads, normalized)
    if (duplicate) return duplicate

    try {
      await createLeadRequest(normalized)
      await refreshData()
      return { ok: true }
    } catch (requestError) {
      return {
        ok: false,
        error: getApiErrorMessage(requestError),
        duplicate: requestError instanceof ApiError && requestError.status === 409,
      }
    }
  }, [leads, refreshData])

  const updateLead = useCallback(async (id: string, input: LeadInput): Promise<ActionResult> => {
    const normalized = clean(input)
    const duplicate = findDuplicate(leads, normalized, id)
    if (duplicate) return duplicate

    try {
      await updateLeadRequest(id, normalized)
      await refreshData()
      return { ok: true }
    } catch (requestError) {
      return {
        ok: false,
        error: getApiErrorMessage(requestError),
        duplicate: requestError instanceof ApiError && requestError.status === 409,
      }
    }
  }, [leads, refreshData])

  const importLeads = useCallback(async (inputs: LeadInput[]) => {
    const existing = [...leads]
    let added = 0
    let skipped = 0

    for (const input of inputs) {
      const normalized = clean(input)
      if (Object.keys(validateLead(normalized)).length > 0 || findDuplicate(existing, normalized)) {
        skipped++
        continue
      }

      try {
        const lead = await createLeadRequest(normalized)
        existing.push(lead)
        added++
      } catch (requestError) {
        if (requestError instanceof ApiError && requestError.status === 409) {
          skipped++
          continue
        }
        if (added) await refreshData()
        return { added, skipped, error: getApiErrorMessage(requestError) }
      }
    }

    if (added) await refreshData()
    return { added, skipped }
  }, [leads, refreshData])

  const value = useMemo(
    () => ({ leads, loading, error, stats, statsLoading, statsError, refreshData, addLead, updateLead, importLeads }),
    [leads, loading, error, stats, statsLoading, statsError, refreshData, addLead, updateLead, importLeads],
  )
  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>
}

export function useLeads(): LeadsApi {
  const ctx = useContext(LeadsContext)
  if (!ctx) throw new Error('useLeads must be used inside LeadsProvider')
  return ctx
}
