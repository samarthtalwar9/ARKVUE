import { useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import type { Lead, LeadInput } from '../types'
import { SOURCES, STATUSES } from '../types'
import { validateLead, type FormErrors } from '../lib/validation'
import { useLeads } from '../context/LeadsContext'
import { useToast } from '../context/ToastContext'
import Modal from './Modal'

export type LeadModalState = { mode: 'add' } | { mode: 'edit'; lead: Lead } | null

const EMPTY: LeadInput = { name: '', company: '', email: '', phone: '', source: 'Website', status: 'New' }

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-700">{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-xs font-medium text-rose-600"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function LeadForm({ state, onClose }: { state: NonNullable<LeadModalState>; onClose: () => void }) {
  const { addLead, updateLead } = useLeads()
  const toast = useToast()
  const editing = state.mode === 'edit'
  const [form, setForm] = useState<LeadInput>(
    state.mode === 'edit'
      ? { name: state.lead.name, company: state.lead.company, email: state.lead.email, phone: state.lead.phone, source: state.lead.source, status: state.lead.status }
      : EMPTY,
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof LeadInput>(key: K, value: LeadInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (saving) return
    const found = validateLead(form)
    if (Object.keys(found).length) {
      setErrors(found)
      toast.error('Please fix the highlighted fields')
      return
    }
    setSaving(true)
    try {
      const result = state.mode === 'edit' ? await updateLead(state.lead.id, form) : await addLead(form)
      if (!result.ok) {
        if (result.field) setErrors({ [result.field]: result.error })
        toast.error(result.duplicate || result.field ? 'Duplicate lead' : 'Could not save lead', result.error)
        return
      }
      toast.success(editing ? 'Lead updated' : 'Lead added', `${form.name.trim()} was ${editing ? 'updated' : 'added'} successfully.`)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const cls = (k: keyof LeadInput) => `input-field ${errors[k] ? 'input-error' : ''}`

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.name}>
          <input autoFocus className={cls('name')} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Aarav Kulkarni" />
        </Field>
        <Field label="Company" error={errors.company}>
          <input className={cls('company')} value={form.company} onChange={(e) => set('company', e.target.value)} placeholder="Vistara Tech" />
        </Field>
        <Field label="Email" error={errors.email}>
          <input type="email" className={cls('email')} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="name@company.com" />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input className={cls('phone')} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 98765 43210" />
        </Field>
        <Field label="Source">
          <select className="input-field" value={form.source} onChange={(e) => set('source', e.target.value as LeadInput['source'])}>
            {SOURCES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select className="input-field" value={form.status} onChange={(e) => set('status', e.target.value as LeadInput['status'])}>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onClose} disabled={saving} className="btn-ghost disabled:cursor-not-allowed disabled:opacity-60">
          Cancel
        </button>
        <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={saving} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
          {saving && <Loader2 size={16} className="animate-spin" />}
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Add lead'}
        </motion.button>
      </div>
    </form>
  )
}

export default function LeadFormModal({ state, onClose }: { state: LeadModalState; onClose: () => void }) {
  // keep the last state so content doesn't vanish while the exit animation plays
  const last = useRef<NonNullable<LeadModalState>>({ mode: 'add' })
  if (state) last.current = state
  const shown = state ?? last.current

  return (
    <Modal
      open={state !== null}
      onClose={onClose}
      title={shown.mode === 'edit' ? 'Edit lead' : 'Add new lead'}
      subtitle={shown.mode === 'edit' ? 'Update the lead details below.' : 'Capture a new lead in seconds.'}
    >
      <LeadForm key={shown.mode === 'edit' ? shown.lead.id : 'add'} state={shown} onClose={onClose} />
    </Modal>
  )
}
