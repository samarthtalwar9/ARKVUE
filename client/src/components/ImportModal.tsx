import { useRef, useState, type DragEvent } from 'react'
import { FileSpreadsheet, Loader2, Upload } from 'lucide-react'
import { SOURCES, STATUSES, type LeadInput, type LeadSource, type LeadStatus } from '../types'
import { useLeads } from '../context/LeadsContext'
import { useToast } from '../context/ToastContext'
import { getApiErrorMessage } from '../services/api'
import Modal from './Modal'

function parseCsv(text: string): LeadInput[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length && lines[0].toLowerCase().startsWith('name')) lines.shift()
  return lines.map((line) => {
    const [name = '', company = '', email = '', phone = '', source = '', status = ''] = line.split(',').map((c) => c.trim())
    const src = SOURCES.find((s) => s.toLowerCase() === source.toLowerCase()) ?? 'Other'
    const st = STATUSES.find((s) => s.toLowerCase() === status.toLowerCase()) ?? 'New'
    return { name, company, email, phone, source: src as LeadSource, status: st as LeadStatus }
  })
}

export default function ImportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { importLeads } = useLeads()
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [importing, setImporting] = useState(false)

  const handleFile = async (file: File | undefined) => {
    if (!file || importing) return
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Unsupported file', 'Please upload a .csv file.')
      return
    }
    setImporting(true)
    try {
      const rows = parseCsv(await file.text())
      if (!rows.length) {
        toast.error('Nothing to import', 'The file has no lead rows.')
        return
      }
      const { added, skipped, error } = await importLeads(rows)
      if (error) {
        toast.error(added ? 'Import partially completed' : 'Import failed', `${added} added, ${skipped} skipped. ${error}`)
      } else if (added) {
        toast.success(`${added} lead${added > 1 ? 's' : ''} imported`, skipped ? `${skipped} skipped (invalid or duplicate).` : undefined)
      } else {
        toast.error('No leads imported', `All ${skipped} rows were invalid or duplicates.`)
      }
      onClose()
    } catch (error) {
      toast.error('Import failed', getApiErrorMessage(error))
    } finally {
      setImporting(false)
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    void handleFile(e.dataTransfer.files[0])
  }

  return (
    <Modal open={open} onClose={onClose} title="Import leads" subtitle="Upload a CSV file to add leads in bulk.">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        aria-busy={importing}
        className={`flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          importing ? 'cursor-wait border-brand-300 bg-brand-50/60' : `cursor-pointer ${dragging ? 'border-brand-500 bg-brand-50' : 'border-brand-200 bg-brand-50/40 hover:border-brand-400 hover:bg-brand-50'}`
        }`}
        onClick={() => {
          if (!importing) fileRef.current?.click()
        }}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
          {importing ? <Loader2 size={26} className="animate-spin" /> : <Upload size={26} />}
        </span>
        <p className="text-sm font-bold text-slate-800">{importing ? 'Importing leads…' : 'Drop your CSV here, or click to browse'}</p>
        <p className="text-xs text-slate-500">Duplicate emails and phone numbers are skipped automatically.</p>
        <input ref={fileRef} type="file" accept=".csv" hidden disabled={importing} onChange={(e) => void handleFile(e.target.files?.[0])} />
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600">
        <FileSpreadsheet size={18} className="mt-0.5 shrink-0 text-brand-600" />
        <div>
          <p className="font-bold text-slate-800">Expected columns</p>
          <code className="mt-1 block text-[11px]">name, company, email, phone, source, status</code>
        </div>
      </div>
    </Modal>
  )
}
