import { Link } from 'react-router-dom'

const steps = [
  {
    n: '01',
    title: 'Escolha o plano',
    text: 'Corrida, café, museu, shopping ou um recado. Você diz o que precisa fazer hoje.',
  },
  {
    n: '02',
    title: 'Encontre um parceiro',
    text: 'Pessoas da sua cidade prontas para ir junto — no seu ritmo, no seu bairro.',
  },
  {
    n: '03',
    title: 'Viva a rotina',
    text: 'Marque o horário, saia de casa e transforme o cotidiano em algo compartilhado.',
  },
]

const categories = [
  { label: 'Corrida', hint: 'Parque e rua' },
  { label: 'Cafeterias', hint: 'Tours curtos' },
  { label: 'Museus', hint: 'Sem pressa' },
  { label: 'Shopping', hint: 'Compras e recados' },
  { label: 'Cidade', hint: 'Caminhadas' },
  { label: 'Cotidiano', hint: 'Feira e tarefas' },
]

export function HomePage() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-24">
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-clay">
            App de rotina urbana
          </p>
          <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
            Companhia para o que você já ia fazer.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            O GoPar conecta você a parceiros de estilo de vida para atividades
            diárias: correr junto, ir ao shopping, visitar um museu, tomar café
            ou resolver o dia a dia — com alguém no caminho.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/atividades"
              className="inline-flex rounded-full bg-clay px-6 py-3 text-sm font-medium text-paper no-underline transition-colors hover:bg-clay-dark"
            >
              Ver atividades
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink no-underline hover:bg-paper"
            >
              Como funciona
            </a>
          </div>
        </div>
        <aside className="rounded-[2rem] bg-olive p-8 text-paper shadow-[0_24px_60px_-28px_rgba(63,74,58,0.55)]">
          <p className="text-xs uppercase tracking-[0.24em] text-sand-deep">
            Hoje na cidade
          </p>
          <ul className="mt-8 space-y-6">
            <li className="border-b border-white/10 pb-6">
              <p className="font-serif text-2xl">Corrida no parque</p>
              <p className="mt-1 text-sm text-sand-deep">Ibirapuera · 7h · Marina</p>
            </li>
            <li className="border-b border-white/10 pb-6">
              <p className="font-serif text-2xl">Tour de cafeterias</p>
              <p className="mt-1 text-sm text-sand-deep">Pinheiros · 10h · Theo</p>
            </li>
            <li>
              <p className="font-serif text-2xl">Manhã no museu</p>
              <p className="mt-1 text-sm text-sand-deep">Vila Mariana · 11h · Lívia</p>
            </li>
          </ul>
        </aside>
      </section>

      <section
        id="como-funciona"
        className="border-y border-sand-deep bg-paper/70"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.n}>
              <p className="font-serif text-sm text-clay">{step.n}</p>
              <h2 className="mt-3 font-serif text-2xl">{step.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-serif text-3xl">O que você pode fazer junto</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Menos feed, mais presença. Escolha um tipo de plano e encontre alguém
          disponível perto de você.
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li
              key={category.label}
              className="rounded-3xl border border-sand-deep bg-paper px-5 py-6"
            >
              <p className="font-medium">{category.label}</p>
              <p className="mt-1 text-sm text-ink-soft">{category.hint}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
