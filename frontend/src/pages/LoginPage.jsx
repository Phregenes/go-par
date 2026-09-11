import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { validateLogin } from '../lib/validators.js'

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    const result = validateLogin({ email, password })
    setErrors(result.errors)
    if (!result.ok) return

    setSubmitting(true)
    try {
      await signIn({ email, password })
      navigate('/', { replace: true })
    } catch (error) {
      setFormError(
        error?.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : error?.message || 'Não foi possível entrar.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-clay">
        Conta GoPar
      </p>
      <h1 className="font-serif text-4xl tracking-tight text-ink">Entrar</h1>
      <p className="mt-3 text-ink-soft">
        Acesse sua conta para continuar. A compra exigirá login; o restante do
        site continua aberto.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5" noValidate>
        <Field
          id="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
        />
        <Field
          id="password"
          label="Senha"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          error={errors.password}
        />

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
          {submitting ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <p className="mt-8 text-sm text-ink-soft">
        Ainda não tem conta?{' '}
        <Link to="/cadastro" className="font-medium text-ink underline">
          Criar conta
        </Link>
      </p>
    </div>
  )
}

function Field({ id, label, type, value, onChange, error, autoComplete }) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
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
