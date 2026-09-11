import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  formatCpf,
  GENDER_OPTIONS,
  validateProfile,
} from '../lib/validators.js'

export function AccountPage() {
  const {
    user,
    profile,
    loading,
    updateProfile,
    deleteAccount,
  } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    birthDate: '',
    gender: '',
  })
  const [deleteConfirm, setDeleteConfirm] = useState('')

  const [profileErrors, setProfileErrors] = useState({})
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [deleteError, setDeleteError] = useState('')

  const [savingProfile, setSavingProfile] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!profile) return
    setForm({
      fullName: profile.full_name ?? '',
      birthDate: profile.birth_date ?? '',
      gender: profile.gender ?? '',
    })
  }, [profile])

  if (loading) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16 text-ink-soft">
        Carregando conta…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleProfileSubmit(event) {
    event.preventDefault()
    setProfileMessage('')
    setProfileError('')

    const result = validateProfile({
      ...form,
      cpf: profile?.cpf ?? '',
    })
    setProfileErrors(result.errors)
    if (!result.ok) return

    setSavingProfile(true)
    try {
      await updateProfile(form)
      setProfileMessage('Dados atualizados com sucesso.')
    } catch (error) {
      setProfileError(error?.message || 'Não foi possível salvar.')
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleDelete(event) {
    event.preventDefault()
    setDeleteError('')

    if (deleteConfirm.trim().toLowerCase() !== 'excluir') {
      setDeleteError('Digite EXCLUIR para confirmar.')
      return
    }

    setDeleting(true)
    try {
      await deleteAccount()
      navigate('/', { replace: true })
    } catch (error) {
      setDeleteError(error?.message || 'Não foi possível excluir a conta.')
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-16">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-clay">
        Conta GoPar
      </p>
      <h1 className="font-serif text-4xl tracking-tight text-ink">Minha conta</h1>
      <p className="mt-3 text-ink-soft">
        Atualize seus dados ou exclua a conta quando quiser.
      </p>

      <section className="mt-10">
        <h2 className="font-serif text-2xl text-ink">Dados pessoais</h2>
        <form
          onSubmit={handleProfileSubmit}
          className="mt-5 space-y-5"
          noValidate
        >
          <Field
            id="fullName"
            label="Nome completo"
            value={form.fullName}
            onChange={(value) => updateField('fullName', value)}
            error={profileErrors.fullName}
          />
          <ReadOnlyField
            label="E-mail"
            value={user.email || '—'}
            hint="O e-mail não pode ser alterado após o cadastro."
          />
          <ReadOnlyField
            label="CPF"
            value={formatCpf(profile?.cpf ?? '') || '—'}
            hint="O CPF não pode ser alterado após o cadastro."
          />
          <Field
            id="birthDate"
            label="Data de nascimento"
            type="date"
            value={form.birthDate}
            onChange={(value) => updateField('birthDate', value)}
            error={profileErrors.birthDate}
          />
          <label className="block" htmlFor="gender">
            <span className="mb-1.5 block text-sm font-medium text-ink">
              Gênero
            </span>
            <select
              id="gender"
              value={form.gender}
              onChange={(event) => updateField('gender', event.target.value)}
              className="w-full rounded-xl border border-ink/10 bg-paper px-4 py-3 text-ink outline-none ring-clay/30 focus:ring-2"
            >
              <option value="">Selecione</option>
              {GENDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {profileErrors.gender ? (
              <span className="mt-1.5 block text-sm text-clay-dark">
                {profileErrors.gender}
              </span>
            ) : null}
          </label>

          <p className="text-sm text-ink-soft">
            Tipo de conta:{' '}
            <span className="font-medium text-ink">
              {profile?.account_type === 'trabalhador'
                ? 'Trabalhador'
                : 'Cliente'}
            </span>{' '}
            (não editável por aqui)
          </p>

          {profileError ? (
            <p className="text-sm text-clay-dark" role="alert">
              {profileError}
            </p>
          ) : null}
          {profileMessage ? (
            <p className="text-sm text-olive" role="status">
              {profileMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={savingProfile}
            className="inline-flex rounded-full bg-clay px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-clay-dark disabled:opacity-60"
          >
            {savingProfile ? 'Salvando…' : 'Salvar dados'}
          </button>
        </form>
      </section>

      <section className="mt-14 border-t border-sand-deep pt-10">
        <h2 className="font-serif text-2xl text-clay-dark">Excluir conta</h2>
        <p className="mt-3 text-sm text-ink-soft">
          Esta ação apaga permanentemente seu login e perfil no GoPar. Não dá
          para desfazer.
        </p>
        <form onSubmit={handleDelete} className="mt-5 space-y-5">
          <Field
            id="deleteConfirm"
            label='Digite "excluir" para confirmar'
            value={deleteConfirm}
            onChange={setDeleteConfirm}
            error={deleteError}
          />
          <button
            type="submit"
            disabled={deleting}
            className="inline-flex rounded-full bg-clay-dark px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink disabled:opacity-60"
          >
            {deleting ? 'Excluindo…' : 'Excluir minha conta'}
          </button>
        </form>
      </section>

      <p className="mt-10 text-sm text-ink-soft">
        <Link to="/" className="font-medium text-ink underline">
          Voltar ao início
        </Link>
      </p>
    </div>
  )
}

function ReadOnlyField({ label, value, hint }) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <p className="rounded-xl border border-ink/10 bg-sand-deep/40 px-4 py-3 text-ink">
        {value}
      </p>
      {hint ? (
        <span className="mt-1.5 block text-sm text-ink-soft">{hint}</span>
      ) : null}
    </div>
  )
}

function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  autoComplete,
  inputMode,
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-ink/10 bg-paper px-4 py-3 text-ink outline-none ring-clay/30 focus:ring-2"
      />
      {error ? (
        <span className="mt-1.5 block text-sm text-clay-dark">{error}</span>
      ) : null}
    </label>
  )
}
