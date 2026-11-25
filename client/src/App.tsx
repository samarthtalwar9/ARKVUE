import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LeadsProvider, useLeads } from './context/LeadsContext'
import { ToastProvider, useToast } from './context/ToastContext'
import { pageTransition } from './lib/motion'
import type { Lead, Page } from './types'
import BackgroundWaves from './components/BackgroundWaves'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ImportModal from './components/ImportModal'
import LeadFormModal, { type LeadModalState } from './components/LeadFormModal'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import ComingSoon from './pages/ComingSoon'

const csvCell = (v: string) => `"${v.replace(/"/g, '""')}"`

function Shell() {
  const { leads } = useLeads()
  const toast = useToast()
  const [page, setPage] = useState<Page>('dashboard')
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [leadModal, setLeadModal] = useState<LeadModalState>(null)
  const [importOpen, setImportOpen] = useState(false)

  const navigate = useCallback((p: Page) => {
    setPage(p)
    setMenuOpen(false)
  }, [])

  const handleQuery = (q: string) => {
    setQuery(q)
    if (q && page !== 'leads') setPage('leads')
  }

  const closeLeadModal = useCallback(() => setLeadModal(null), [])
  const closeImport = useCallback(() => setImportOpen(false), [])

  const exportCsv = () => {
    const header = ['Name', 'Company', 'Email', 'Phone', 'Source', 'Status', 'Created At']
    const rows = leads.map((l) => [l.name, l.company, l.email, l.phone, l.source, l.status, l.createdAt].map(csvCell).join(','))
    const blob = new Blob([[header.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'arkvue-leads.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Export ready', `${leads.length} leads exported to arkvue-leads.csv`)
  }

  const openAdd = () => setLeadModal({ mode: 'add' })
  const openEdit = (lead: Lead) => setLeadModal({ mode: 'edit', lead })

  return (
    <div className="flex h-full overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar page={page} onNavigate={navigate} />
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="fixed inset-0 z-40 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-navy-950/60" onClick={() => setMenuOpen(false)} />
            <motion.div className="absolute inset-y-0 left-0" initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', stiffness: 340, damping: 34 }}>
              <Sidebar page={page} onNavigate={navigate} onClose={() => setMenuOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative flex-1 overflow-y-auto bg-lavender">
        <BackgroundWaves />
        <Header page={page} query={query} onQueryChange={handleQuery} onMenu={() => setMenuOpen(true)} />
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div key={page} {...pageTransition}>
              {page === 'dashboard' && <Dashboard onAdd={openAdd} onImport={() => setImportOpen(true)} onExport={exportCsv} onNavigate={navigate} />}
              {page === 'leads' && (
                <Leads query={query} onQueryChange={setQuery} onAdd={openAdd} onEdit={openEdit} onImport={() => setImportOpen(true)} onExport={exportCsv} />
              )}
              {page === 'analytics' && <ComingSoon title="Analytics" />}
              {page === 'settings' && <ComingSoon title="Settings" />}
            </motion.div>
          </AnimatePresence>
          <p className="pb-6 text-center text-xs font-medium text-slate-400">ARKVUE · Manage Leads. Build Relationships. Drive Growth.</p>
        </div>
      </main>

      <LeadFormModal state={leadModal} onClose={closeLeadModal} />
      <ImportModal open={importOpen} onClose={closeImport} />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <LeadsProvider>
        <Shell />
      </LeadsProvider>
    </ToastProvider>
  )
}
