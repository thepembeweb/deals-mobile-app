import { type Session, type User } from '@supabase/supabase-js'
import React, {
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
} from 'react'

import { supabase } from '../lib/supabase'

interface AuthProps {
  user: User | null
  session: Session | null
  initialized?: boolean
  signOut?: () => void
}

export const AuthContext = createContext<Partial<AuthProps>>({})

// Custom hook to read the context values
export function useAuth() {
  return React.useContext(AuthContext)
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>()
  const [session, setSession] = useState<Session | null>(null)
  const [initialized, setInitialized] = useState<boolean>(false)

  useEffect(() => {
    // Listen for changes to authentication state
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session ? session.user : null)
      setInitialized(true)
    })
    return () => {
      data.subscription.unsubscribe()
    }
  }, [session])

  // Log out the user
  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    initialized,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
