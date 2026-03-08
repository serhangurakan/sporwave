import React, { useEffect, useReducer, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { getTokens, setTokens, clearTokens } from './tokenStore';
import { getMe } from '@/lib/api/user';
import { logout as apiLogout } from '@/lib/api/auth';
import { mapUser } from '@/lib/utils/mappers';
import type { User, Tokens } from '@/types/domain';

type State = {
  user: User | null;
  tokens: Tokens | null;
  isLoading: boolean;
};

type Action =
  | { type: 'LOADED'; user: User; tokens: Tokens }
  | { type: 'CLEARED' }
  | { type: 'SET_USER'; user: User };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOADED':
      return { user: action.user, tokens: action.tokens, isLoading: false };
    case 'CLEARED':
      return { user: null, tokens: null, isLoading: false };
    case 'SET_USER':
      return { ...state, user: action.user };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    tokens: null,
    isLoading: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const stored = await getTokens();
        if (!stored) {
          dispatch({ type: 'CLEARED' });
          return;
        }
        const dto = await getMe();
        dispatch({ type: 'LOADED', user: mapUser(dto), tokens: stored });
      } catch {
        await clearTokens();
        dispatch({ type: 'CLEARED' });
      }
    })();
  }, []);

  const login = useCallback(async (user: User, tokens: Tokens) => {
    await setTokens(tokens.accessToken, tokens.refreshToken);
    dispatch({ type: 'LOADED', user, tokens });
  }, []);

  const logout = useCallback(async () => {
    try {
      const stored = await getTokens();
      if (stored?.refreshToken) {
        await apiLogout(stored.refreshToken);
      }
    } catch {}
    await clearTokens();
    dispatch({ type: 'CLEARED' });
  }, []);

  const setUser = useCallback((user: User) => {
    dispatch({ type: 'SET_USER', user });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
