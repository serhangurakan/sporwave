import { createContext } from 'react';
import type { User, Tokens } from '@/types/domain';

export interface AuthState {
  user: User | null;
  tokens: Tokens | null;
  isLoading: boolean;
}

export interface AuthActions {
  login(user: User, tokens: Tokens): Promise<void>;
  logout(): Promise<void>;
  setUser(user: User): void;
}

export const AuthContext = createContext<(AuthState & AuthActions) | null>(null);
