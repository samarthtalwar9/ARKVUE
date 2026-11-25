export const STATUSES = ['New', 'Contacted', 'Qualified', 'Converted'] as const
export const SOURCES = ['Website', 'Referral', 'LinkedIn', 'Event', 'Other'] as const

export type LeadStatus = (typeof STATUSES)[number]
export type LeadSource = (typeof SOURCES)[number]

export interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  source: LeadSource
  status: LeadStatus
  createdAt: string
}

export type LeadInput = Omit<Lead, 'id' | 'createdAt'>

export interface DashboardStats {
  total: number
  newLeads: number
  contacted: number
  converted: number
}

export type Page = 'dashboard' | 'leads' | 'analytics' | 'settings'
