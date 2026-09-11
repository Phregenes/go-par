import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { supabase } from '../lib/supabase.js'
import { onlyDigits } from '../lib/validators.js'

const AuthContext = createContext(null)

async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select(
      'id, full_name, cpf, birth_date, gender, account_type, created_at, updated_at',
    )
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null)
      return null
    }

    const data = await fetchProfile(userId)
    setProfile(data)
    return data
  }, [])

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      if (data.session?.user?.id) {
        refreshProfile(data.session.user.id).finally(() => {
          if (mounted) setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      if (nextSession?.user?.id) {
        refreshProfile(nextSession.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [refreshProfile])

  const signUp = useCallback(
    async ({ fullName, email, password, cpf, birthDate, gender }) => {
      const cpfDigits = onlyDigits(cpf)
      const trimmedName = String(fullName).trim().replace(/\s+/g, ' ')

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: trimmedName,
            cpf: cpfDigits,
            birth_date: birthDate,
            gender,
          },
        },
      })

      if (error) throw error

      // Com sessão, reforça o perfil. Sem sessão (e-mail a confirmar),
      // o trigger handle_new_user já criou a linha a partir do metadata.
      if (data.session?.user?.id) {
        const { error: profileError } = await supabase.from('profiles').upsert(
          {
            id: data.session.user.id,
            full_name: trimmedName,
            cpf: cpfDigits,
            birth_date: birthDate,
            gender,
          },
          { onConflict: 'id' },
        )

        if (profileError && profileError.code !== '23505') {
          throw profileError
        }

        await refreshProfile(data.session.user.id)
      }

      return data
    },
    [refreshProfile],
  )

  const signIn = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    if (error) throw error
    return data
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setProfile(null)
  }, [])

  const updateProfile = useCallback(
    async ({ fullName, birthDate, gender }) => {
      const userId = session?.user?.id
      if (!userId) throw new Error('Você precisa estar autenticado.')

      const payload = {
        full_name: String(fullName).trim().replace(/\s+/g, ' '),
        birth_date: birthDate,
        gender,
      }

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', userId)

      if (error) throw error

      const { error: metaError } = await supabase.auth.updateUser({
        data: {
          full_name: payload.full_name,
          birth_date: payload.birth_date,
          gender: payload.gender,
        },
      })
      if (metaError) throw metaError

      return refreshProfile(userId)
    },
    [session, refreshProfile],
  )

  const deleteAccount = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke('delete-account', {
      method: 'POST',
    })

    if (error) throw error
    if (data?.error) throw new Error(data.error)

    await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      deleteAccount,
      refreshProfile,
    }),
    [
      session,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      deleteAccount,
      refreshProfile,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return ctx
}
