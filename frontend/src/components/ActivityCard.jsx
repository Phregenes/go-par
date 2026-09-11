const categoryLabel = {
  corrida: 'Corrida',
  cafeteria: 'Cafeteria',
  museu: 'Museu',
  cotidiano: 'Cotidiano',
  tour: 'Tour',
}

export function ActivityCard({ activity }) {
  return (
    <article className="flex h-full flex-col rounded-[1.6rem] border border-sand-deep bg-paper p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="rounded-full bg-sand px-3 py-1 text-xs font-medium uppercase tracking-wider text-olive">
          {categoryLabel[activity.category] ?? activity.category}
        </p>
        <p className="text-sm text-ink-soft">{activity.when}</p>
      </div>
      <h2 className="mt-5 font-serif text-2xl leading-snug">{activity.title}</h2>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
        {activity.description}
      </p>
      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wider text-ink-soft">Onde</dt>
          <dd className="mt-1">
            {activity.neighborhood}, {activity.city}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wider text-ink-soft">Duração</dt>
          <dd className="mt-1">{activity.duration}</dd>
        </div>
      </dl>
      <div className="mt-6 flex items-center justify-between border-t border-sand-deep pt-5">
        <div>
          <p className="text-sm font-medium">{activity.partner.name}</p>
          <p className="text-xs text-ink-soft">
            {activity.partner.role} · {activity.partner.rating.toFixed(1)}
          </p>
        </div>
        <p className="text-sm text-ink-soft">
          {activity.spots} {activity.spots === 1 ? 'vaga' : 'vagas'}
        </p>
      </div>
    </article>
  )
}
