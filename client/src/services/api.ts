import type { DashboardStats, Lead, LeadInput, LeadSource, LeadStatus } from '../types'

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '')
const PAGE_LIMIT = 100

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface ApiLead {
  id: string
  name: string
  company: string | null
  email: string
  phone: string
  source: LeadSource
  status: LeadStatus
  created_at: string
}

interface LeadsResponse {
  total: number
  limit: number
  leads: ApiLead[]
}

interface LeadResponse {
  lead: ApiLead
}

interface StatsResponse {
  stats: {
    total: string | number
    new: string | number
    contacted: string | number
    converted: string | number
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  if (init?.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  })

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new ApiError('The server returned an invalid response. Please try again.', response.status)
  }

  if (!response.ok) {
    const body = payload as { message?: unknown }
    const message =
      typeof body?.message === 'string'
        ? body.message
        : response.status === 409
          ? 'A lead with this email or phone number already exists.'
          : response.status >= 500
            ? 'The server could not complete your request. Please try again.'
            : 'Your request could not be completed. Please check the details and try again.'
    throw new ApiError(message, response.status)
  }

  return payload as T
}

function mapLead(lead: ApiLead): Lead {
  return {
    id: lead.id,
    name: lead.name,
    company: lead.company ?? '',
    email: lead.email,
    phone: lead.phone,
    source: lead.source,
    status: lead.status,
    createdAt: lead.created_at,
  }
}

export async function getLeads(): Promise<Lead[]> {
  const firstPage = await request<LeadsResponse>(`/leads?page=1&limit=${PAGE_LIMIT}`)
  const pageCount = Math.ceil(firstPage.total / firstPage.limit)
  const laterPages = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) =>
      request<LeadsResponse>(`/leads?page=${index + 2}&limit=${PAGE_LIMIT}`),
    ),
  )

  return [firstPage, ...laterPages].flatMap((page) => page.leads.map(mapLead))
}

export async function getLead(id: string): Promise<Lead> {
  const response = await request<LeadResponse>(`/leads/${encodeURIComponent(id)}`)
  return mapLead(response.lead)
}

export async function createLead(input: LeadInput): Promise<Lead> {
  const response = await request<LeadResponse>('/leads', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return mapLead(response.lead)
}

export async function updateLead(id: string, input: LeadInput): Promise<Lead> {
  const response = await request<LeadResponse>(`/leads/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
  return mapLead(response.lead)
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await request<StatsResponse>('/dashboard/stats')
  return {
    total: Number(response.stats.total),
    newLeads: Number(response.stats.new),
    contacted: Number(response.stats.contacted),
    converted: Number(response.stats.converted),
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message
  if (error instanceof TypeError) {
    return 'Unable to connect to the ARKVUE server. Check that the backend is running and try again.'
  }
  return 'Something went wrong. Please try again.'
}
