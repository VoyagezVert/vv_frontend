import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User, LoginCredentials, RegisterCredentials } from '../types/auth';

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User, token: string) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock successful login
          const mockUser: User = {
            id: '1',
            email: credentials.email,
            name: credentials.email.split('@')[0],
            avatar: `https://ui-avatars.com/api/?name=${credentials.email}&background=22c55e&color=fff`
          };
          
          const mockToken = 'mock-jwt-token';
          
          set({ 
            user: mockUser, 
            token: mockToken, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch {
          set({ isLoading: false });
          throw new Error('Login failed. Please check your credentials.');
        }
      },

      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          if (credentials.password !== credentials.confirmPassword) {
            throw new Error('Passwords do not match');
          }
          
          // Mock successful registration
          const mockUser: User = {
            id: '1',
            email: credentials.email,
            name: credentials.name,
            avatar: `https://ui-avatars.com/api/?name=${credentials.name}&background=22c55e&color=fff`
          };
          
          const mockToken = 'mock-jwt-token';
          
          set({ 
            user: mockUser, 
            token: mockToken, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setUser: (user: User, token: string) => {
        set({ 
          user, 
          token, 
          isAuthenticated: true, 
          isLoading: false 
        });
      }
    }),
    {
      name: 'vv-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);