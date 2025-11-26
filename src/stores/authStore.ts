import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  email: string | null;
  passwordHash: string | null;

  actions: {
    register: (
      username: string,
      email: string,
      passwordHash: string
    ) => { success: boolean; error?: string };

    login: (
      email: string,
      passwordHash: string
    ) => { success: boolean; error?: string };

    logout: () => void;
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      username: null,
      email: null,
      passwordHash: null,

      actions: {
        register: (username, email, passwordHash) => {
          const state = get();
          const cleanEmail = email.trim().toLowerCase();
          const cleanUsername = username.trim();

          // Prevent re-register
          if (state.email === cleanEmail) {
            return { success: false, error: "User already registered." };
          }

          set({
            isAuthenticated: true,
            username: cleanUsername,
            email: cleanEmail,
            passwordHash,
          });

          return { success: true };
        },

        login: (email, passwordHash) => {
          const state = get();

          const cleanEmail = email.trim().toLowerCase();

          if (!state.email || !state.passwordHash) {
            return {
              success: false,
              error: "No account found. Please sign up first.",
            };
          }

          if (
            state.email !== cleanEmail ||
            state.passwordHash !== passwordHash
          ) {
            return { success: false, error: "Invalid email or password." };
          }

          set({
            isAuthenticated: true,
          });

          return { success: true };
        },

        logout: () => {
          const state = get();

          set({
            isAuthenticated: false,
            username: state.username, // keep account so user can login again
            email: state.email,
            passwordHash: state.passwordHash,
          });
        },
      },
    }),
    {
      name: "trackwise-user-auth",
    }
  )
);

export const useAuth = () => useAuthStore((s) => s);
export const useAuthActions = () => useAuthStore((s) => s.actions);
