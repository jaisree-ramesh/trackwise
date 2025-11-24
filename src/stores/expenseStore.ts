import type { IExpense } from "@/types/expense";
import { persist } from "zustand/middleware";
import { create } from "zustand";

interface ExpenseActions {
  setBudget: (amount: number) => void;
  addExpense: (expense: Omit<IExpense, "id">) => void;
  deleteExpense: (id: string) => void;
  editExpense: (updated: IExpense) => void;
  recomputeDerived: () => void;
}

interface ExpenseState {
  initialize: boolean;
  isDirty: boolean;
  expenses: IExpense[];
  totalSpent: number;
  biggestCategory: string | null;
  recentExpenses: IExpense[];
  monthlyBudget: number;
  remainingBudget: number;
  actions: ExpenseActions;
}

const computeTotal = (expenses: IExpense[]) =>
  expenses.reduce((sum, e) => sum + e.amount, 0);

const computeBiggestCategory = (expenses: IExpense[]) => {
  if (expenses.length === 0) return null;

  const map: Record<string, number> = {};

  expenses.forEach((e) => {
    map[e.category] = (map[e.category] || 0) + e.amount;
  });

  const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);

  return sorted[0]?.[0] ?? null;
};

const computeRecent = (expenses: IExpense[]) =>
  [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => {
      const initialExpenses: IExpense[] = [
        {
          id: "1",
          label: "Groceries",
          amount: 42.9,
          category: "Food",
          date: "2025-01-12",
        },
        {
          id: "2",
          label: "Coffee",
          amount: 5,
          category: "Food",
          date: "2025-01-11",
        },
        {
          id: "3",
          label: "Fuel",
          amount: 60,
          category: "Transport",
          date: "2025-01-10",
        },
      ];

      const initialTotal = computeTotal(initialExpenses);

      return {
        initialize: true,
        isDirty: false,

        expenses: initialExpenses,
        totalSpent: initialTotal,
        biggestCategory: computeBiggestCategory(initialExpenses),
        recentExpenses: computeRecent(initialExpenses),

        monthlyBudget: 1200,
        remainingBudget: 1200 - initialTotal,

        actions: {
          setBudget: (amount: number) =>
            set((state) => ({
              monthlyBudget: amount,
              remainingBudget: amount - state.totalSpent,
              isDirty: true,
            })),

          addExpense: (expense) =>
            set((state) => {
              const newExpense: IExpense = {
                id: crypto.randomUUID(),
                ...expense,
              };

              const updated = [...state.expenses, newExpense];
              const total = computeTotal(updated);

              return {
                expenses: updated,
                isDirty: true,
                totalSpent: total,
                biggestCategory: computeBiggestCategory(updated),
                recentExpenses: computeRecent(updated),
                remainingBudget: state.monthlyBudget - total,
              };
            }),

          deleteExpense: (id) =>
            set((state) => {
              const updated = state.expenses.filter((e) => e.id !== id);
              const total = computeTotal(updated);

              return {
                expenses: updated,
                isDirty: true,
                totalSpent: total,
                biggestCategory: computeBiggestCategory(updated),
                recentExpenses: computeRecent(updated),
                remainingBudget: state.monthlyBudget - total,
              };
            }),

          editExpense: (updatedExpense) =>
            set((state) => {
              const updated = state.expenses.map((e) =>
                e.id === updatedExpense.id ? updatedExpense : e
              );

              const total = computeTotal(updated);

              return {
                expenses: updated,
                isDirty: true,
                totalSpent: total,
                biggestCategory: computeBiggestCategory(updated),
                recentExpenses: computeRecent(updated),
                remainingBudget: state.monthlyBudget - total,
              };
            }),

          recomputeDerived: () => {
            const expenses = get().expenses;
            const total = computeTotal(expenses);

            set({
              totalSpent: total,
              biggestCategory: computeBiggestCategory(expenses),
              recentExpenses: computeRecent(expenses),
              remainingBudget: get().monthlyBudget - total,
            });
          },
        },
      };
    },
    { name: "trackwise-expenses" }
  )
);

export const useExpenses = () => useExpenseStore((state) => state);
export const useExpenseActions = () =>
  useExpenseStore((state) => state.actions);
