import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  formatCpf,
  GENDER_OPTIONS,
  isValidEmail,
  validateProfile,
} from '../lib/validators.js'

export function AccountPage() {
  const {
    user,
    profile,
    loading,
    updateProfile,
    updateEmail,
    updatePassword,
    deleteAccount,
  } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    cpf: '',
    birthDate: '',
    gender: '',
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState('')

  const [profileErrors, setProfileErrors] = useState({})
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [deleteError, setDeleteError] = useState('')

  const [savingProfile, setSavingProfile] = useState(false)
  const [savingEmail, setSavingEmail] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!profile) return
    setForm({
      fullName: profile.full_name ?? '',
      cpf: formatCpf(profile.cpf ?? ''),
      birthDate: profile.birth_date ?? '',
      gender: profile.gender ?? '',
    })
  }, [profile])

  useEffect(() => {
    if (user?.email) setEmail(user.email)
  }, [user])

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

    const result = validateProfile(form)
    setProfileErrors(result.errors)
    if (!result.ok) return

    setSavingProfile(true)
    try {
      await updateProfile(form)
      setProfileMessage('Dados atualizados com sucesso.')
    } catch (error) {
      const message = error?.message || 'Não foi possível salvar.'
      if (/cpf|duplicate|unique/i.test(message)) {
        setProfileError('Este CPF já está em uso por outra conta.')
      } else {
        setProfileError(message)
      }
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleEmailSubmit(event) {
    event.preventDefault()
    setEmailMessage('')
    setEmailError('')

    if (!isValidEmail(email)) {
      setEmailError('E-mail inválido.')
      return
    }

    if (email.trim() === user.email) {
      setEmailMessage('Este já é o e-mail da sua conta.')
      return
    }

    setSavingEmail(true)
    try {
      await updateEmail(email.trim())
      setEmailMessage(
        `Enviamos um e-mail de confirmação para ${email.trim()}. Confirme para concluir a troca.`,
      )
    } catch (error) {
      setEmailError(error?.message || 'Não foi possível atualizar o e-mail.')
    } finally {
      setSavingEmail(false)
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault()
    setPasswordMessage('')
    setPasswordError('')

    if (password.length < 8) {
      setPasswordError('A senha precisa ter pelo menos 8 caracteres.')
      return
    }
    if (password !== passwordConfirm) {
      setPasswordError('As senhas não coincidem.')
      return
    }

    setSavingPassword(true)
    try {
      await updatePassword(password)
      setPassword('')
      setPasswordConfirm('')
      setPasswordMessage('Senha atualizada com sucesso.')
    } catch (error) {
      setPasswordError(error?.message || 'Não foi possível atualizar a senha.')
    } finally {
      setSavingPassword(false)
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
          <Field
            id="cpf"
            label="CPF"
            inputMode="numeric"
            value={form.cpf}
            onChange={(value) => updateField('cpf', formatCpf(value))}
            error={profileErrors.cpf}
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
        <h2 className="font-serif text-2xl text-ink">E-mail</h2>
        <form onSubmit={handleEmailSubmit} className="mt-5 space-y-5" noValidate>
          <Field
            id="email"
            label="E-mail"
            type="email"
            value={email}
            onChange={setEmail}
            error={emailError}
          />
          {emailMessage ? (
            <p className="text-sm text-olive" role="status">
              {emailMessage}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={savingEmail}
            className="inline-flex rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper disabled:opacity-60"
          >
            {savingEmail ? 'Atualizando…' : 'Atualizar e-mail'}
          </button>
        </form>
      </section>

      <section className="mt-14 border-t border-sand-deep pt-10">
        <h2 className="font-serif text-2xl text-ink">Senha</h2>
        <form
          onSubmit={handlePasswordSubmit}
          className="mt-5 space-y-5"
          noValidate
        >
          <Field
            id="password"
            label="Nova senha"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
          />
          <Field
            id="passwordConfirm"
            label="Confirmar nova senha"
            type="password"
            autoComplete="new-password"
            value={passwordConfirm}
            onChange={setPasswordConfirm}
            error={passwordError}
          />
          {passwordMessage ? (
            <p className="text-sm text-olive" role="status">
              {passwordMessage}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={savingPassword}
            className="inline-flex rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper disabled:opacity-60"
          >
            {savingPassword ? 'Atualizando…' : 'Atualizar senha'}
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
