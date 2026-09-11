import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { initialsFromName } from '../lib/validators.js'

const navClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm transition-colors',
    isActive
      ? 'bg-ink text-paper'
      : 'text-ink-soft hover:bg-sand-deep hover:text-ink',
  ].join(' ')

export function AppLayout({ children }) {
  const { user, profile, loading, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function onPointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const displayName = profile?.full_name || user?.email || 'Conta'
  const initials = initialsFromName(profile?.full_name || user?.email || '?')

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-20 border-b border-sand-deep/80 bg-sand/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <NavLink to="/" className="flex items-baseline gap-2 no-underline">
            <span className="font-serif text-2xl tracking-tight text-ink">
              GoPar
            </span>
            <span className="hidden text-xs uppercase tracking-[0.22em] text-ink-soft sm:inline">
              rotina compartilhada
            </span>
          </NavLink>
          <nav aria-label="Principal" className="flex items-center gap-1">
            <NavLink to="/" className={navClass} end>
              Início
            </NavLink>
            <NavLink to="/activities" className={navClass}>
              Atividades
            </NavLink>

            {loading ? (
              <span className="ml-2 h-9 w-20 animate-pulse rounded-full bg-sand-deep" />
            ) : user ? (
              <div className="relative ml-2" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-paper py-1.5 pl-1.5 pr-3 text-sm text-ink transition-colors hover:bg-sand-deep"
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-olive text-xs font-medium text-paper">
                    {initials}
                  </span>
                  <span className="hidden max-w-28 truncate sm:inline">
                    {displayName.split(' ')[0]}
                  </span>
                </button>
                {menuOpen ? (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-sand-deep bg-paper py-2 shadow-lg shadow-ink/5"
                  >
                    <div className="border-b border-sand-deep px-4 py-3">
                      <p className="truncate text-sm font-medium text-ink">
                        {displayName}
                      </p>
                      <p className="truncate text-xs text-ink-soft">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/account"
                      role="menuitem"
                      className="block w-full px-4 py-2.5 text-left text-sm text-ink no-underline hover:bg-sand"
                      onClick={() => setMenuOpen(false)}
                    >
                      Minha conta
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      className="block w-full px-4 py-2.5 text-left text-sm text-ink hover:bg-sand"
                      onClick={async () => {
                        setMenuOpen(false)
                        await signOut()
                      }}
                    >
                      Sair
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-2 inline-flex rounded-full bg-clay px-4 py-2 text-sm font-medium text-paper no-underline transition-colors hover:bg-clay-dark"
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-sand-deep">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>GoPar — companhia para o dia a dia na cidade.</p>
          <p>MVP em construção.</p>
        </div>
      </footer>
    </div>
  )
}
