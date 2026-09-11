import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import {
  formatCpf,
  GENDER_OPTIONS,
  validateSignup,
} from '../lib/validators.js'

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  cpf: '',
  birthDate: '',
  gender: '',
}

export function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    const result = validateSignup(form)
    setErrors(result.errors)
    if (!result.ok) return

    const email = form.email.trim()
    setSubmitting(true)
    try {
      await signUp({
        fullName: form.fullName,
        email,
        password: form.password,
        cpf: form.cpf,
        birthDate: form.birthDate,
        gender: form.gender,
      })

      setSubmittedEmail(email)
      setForm(initialForm)
    } catch (error) {
      const message = error?.message || 'Não foi possível criar a conta.'
      if (/cpf|duplicate|unique/i.test(message)) {
        setFormError('Este CPF já está cadastrado.')
      } else if (/already registered|already been registered/i.test(message)) {
        setFormError('Este e-mail já está cadastrado.')
      } else {
        setFormError(message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (submittedEmail) {
    return (
      <div className="mx-auto max-w-lg px-5 py-16">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-clay">
          Conta GoPar
        </p>
        <h1 className="font-serif text-4xl tracking-tight text-ink">
          Confirme seu e-mail
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Enviamos um e-mail de confirmação para{' '}
          <span className="font-medium text-ink">{submittedEmail}</span>.
        </p>
        <p className="mt-3 text-ink-soft">
          Abra a mensagem e clique no link para ativar sua conta. Depois disso,
          você já pode entrar no GoPar.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="inline-flex rounded-full bg-clay px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-clay-dark"
          >
            Ir para entrar
          </button>
          <button
            type="button"
            onClick={() => setSubmittedEmail('')}
            className="inline-flex rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper"
          >
            Criar outra conta
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-16">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-clay">
        Conta GoPar
      </p>
      <h1 className="font-serif text-4xl tracking-tight text-ink">
        Criar conta
      </h1>
      <p className="mt-3 text-ink-soft">
        Precisamos de dados básicos para um ambiente mais seguro. Só maiores de
        18 anos.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5" noValidate>
        <Field
          id="fullName"
          label="Nome completo"
          autoComplete="name"
          value={form.fullName}
          onChange={(value) => updateField('fullName', value)}
          error={errors.fullName}
        />
        <Field
          id="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(value) => updateField('email', value)}
          error={errors.email}
        />
        <Field
          id="password"
          label="Senha"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(value) => updateField('password', value)}
          error={errors.password}
          hint="Mínimo de 8 caracteres."
        />
        <Field
          id="cpf"
          label="CPF"
          inputMode="numeric"
          autoComplete="off"
          value={form.cpf}
          onChange={(value) => updateField('cpf', formatCpf(value))}
          error={errors.cpf}
          hint="Somente números; validamos os dígitos verificadores."
        />
        <Field
          id="birthDate"
          label="Data de nascimento"
          type="date"
          autoComplete="bday"
          value={form.birthDate}
          onChange={(value) => updateField('birthDate', value)}
          error={errors.birthDate}
        />

        <label className="block" htmlFor="gender">
          <span className="mb-1.5 block text-sm font-medium text-ink">
            Gênero
          </span>
          <select
            id="gender"
            name="gender"
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
          {errors.gender ? (
            <span className="mt-1.5 block text-sm text-clay-dark">
              {errors.gender}
            </span>
          ) : null}
        </label>

        {formError ? (
          <p className="text-sm text-clay-dark" role="alert">
            {formError}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center rounded-full bg-clay px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-clay-dark disabled:opacity-60"
        >
          {submitting ? 'Criando…' : 'Criar conta'}
        </button>
      </form>

      <p className="mt-8 text-sm text-ink-soft">
        Já tem conta?{' '}
        <Link to="/login" className="font-medium text-ink underline">
          Entrar
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
  hint,
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
      {hint && !error ? (
        <span className="mt-1.5 block text-sm text-ink-soft">{hint}</span>
      ) : null}
      {error ? (
        <span className="mt-1.5 block text-sm text-clay-dark">{error}</span>
      ) : null}
    </label>
  )
}
