import { useMemo } from 'react'
import { SOURCES, type DashboardStats, type Lead } from '../types'

export function useStats(leads: Lead[], dashboardStats: DashboardStats | null) {
  return useMemo(() => {
    return {
      total: dashboardStats?.total ?? leads.length,
      newLeads: dashboardStats?.newLeads ?? 0,
      contacted: dashboardStats?.contacted ?? 0,
      converted: dashboardStats?.converted ?? 0,
      sources: SOURCES.map((name) => ({
        name,
        value: leads.filter((lead) => lead.source === name).length,
      })),
    }
  }, [leads, dashboardStats])
}
