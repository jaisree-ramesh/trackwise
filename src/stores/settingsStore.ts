
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AppLanguage = "en" | "de";

interface SettingsState {
  userName: string;
  email: string;
  language: AppLanguage;
  categories: string[];
  actions: {
    setUserName: (name: string) => void;
    setEmail: (email: string) => void;
    setLanguage: (lang: AppLanguage) => void;
    addCategory: (name: string) => void;
    renameCategory: (oldName: string, newName: string) => void;
    deleteCategory: (name: string) => void;
    resetCategories: () => void;
    resetAllLocalData: () => void;
  };
}

const defaultCategories = ["Food", "Transport", "Shopping", "Bills", "Other"];

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      userName: "Trackwise User",
      email: "",
      language: "en",
      categories: defaultCategories,

      actions: {
        setUserName: (userName) => set({ userName }),
        setEmail: (email) => set({ email }),
        setLanguage: (language) => set({ language }),
        addCategory: (name) =>
          set((state) => {
            const trimmed = name.trim();
            if (!trimmed) return state;
            if (state.categories.includes(trimmed)) return state;
            return { categories: [...state.categories, trimmed] };
          }),

        renameCategory: (oldName, newName) =>
          set((state) => {
            const trimmed = newName.trim();
            if (!trimmed || oldName === trimmed) return state;

            return {
              categories: state.categories.map((c) =>
                c === oldName ? trimmed : c
              ),
            };
          }),

        deleteCategory: (name) =>
          set((state) => ({
            categories: state.categories.filter((c) => c !== name),
          })),

        resetCategories: () => set({ categories: defaultCategories }),
        resetAllLocalData: () => {
          // Clear just our known keys – NOT full localStorage.clear()
          localStorage.removeItem("trackwise-expenses");
          localStorage.removeItem("trackwise-settings");
          // Hard reload so all Zustand stores reinitialise
          window.location.reload();
        },
      },
    }),
    {
      name: "trackwise-settings",
    }
  )
);

export const useSettings = () => useSettingsStore((s) => s);
export const useSettingsActions = () => useSettingsStore((s) => s.actions);
