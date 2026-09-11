import { useEffect, useMemo, useState } from 'react'
import { ActivityCard } from '../components/ActivityCard.jsx'
import { fetchActivities } from '../lib/api.js'

const filters = [
  { id: '', label: 'Todas' },
  { id: 'corrida', label: 'Corrida' },
  { id: 'cafeteria', label: 'Café' },
  { id: 'museu', label: 'Museu' },
  { id: 'tour', label: 'Tour' },
  { id: 'cotidiano', label: 'Cotidiano' },
]

export function ActivitiesPage() {
  const [category, setCategory] = useState('')
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setStatus('loading')
      try {
        const data = await fetchActivities(category)
        if (!cancelled) {
          setItems(data)
          setStatus('ready')
        }
      } catch {
        if (!cancelled) {
          setItems([])
          setStatus('error')
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [category])

  const heading = useMemo(
    () => (items.length === 1 ? '1 plano disponível' : `${items.length} planos disponíveis`),
    [items.length],
  )

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 md:py-16">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-clay">
        Parceiros perto de você
      </p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight md:text-5xl">
        Atividades e companhia
      </h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Escolha um plano, veja quem está disponível e combine o encontro. Os
        dados vêm da API do GoPar.
      </p>

      <div
        className="mt-8 flex flex-wrap gap-2"
        role="group"
        aria-label="Filtrar por categoria"
      >
        {filters.map((filter) => {
          const active = category === filter.id
          return (
            <button
              key={filter.id || 'all'}
              type="button"
              onClick={() => setCategory(filter.id)}
              className={[
                'rounded-full px-4 py-2 text-sm transition-colors',
                active
                  ? 'bg-ink text-paper'
                  : 'bg-paper text-ink-soft hover:bg-sand-deep hover:text-ink',
              ].join(' ')}
            >
              {filter.label}
            </button>
          )
        })}
      </div>

      {status === 'loading' ? (
        <p className="mt-12 text-ink-soft" aria-live="polite">
          Carregando planos…
        </p>
      ) : null}

      {status === 'error' ? (
        <p className="mt-12 rounded-2xl bg-paper px-5 py-6 text-ink-soft" role="alert">
          Não foi possível falar com a API. Suba o backend em{' '}
          <code className="rounded bg-sand px-1.5 py-0.5 text-sm">localhost:3001</code>{' '}
          e tente de novo.
        </p>
      ) : null}

      {status === 'ready' ? (
        <>
          <p className="mt-8 text-sm text-ink-soft">{heading}</p>
          {items.length === 0 ? (
            <p className="mt-6 text-ink-soft">Nenhum plano nesta categoria por agora.</p>
          ) : (
            <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {items.map((activity) => (
                <li key={activity.id}>
                  <ActivityCard activity={activity} />
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </div>
  )
}
