import type { IExpense } from "@/types/expense";
import { persist } from "zustand/middleware";
import { create } from "zustand";

export type MonthName = string; // Always saved in English
export type ExpensesByYear = Record<string, Record<MonthName, IExpense[]>>;

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
  expensesByYear: ExpensesByYear;
  currentYear: number;
  currentMonthName: MonthName;
  totalSpent: number;
  biggestCategory: string | null;
  recentExpenses: IExpense[];
  monthlyBudget: number;
  remainingBudget: number;
  actions: ExpenseActions;
}

const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

// Get English month name
const getEnglishMonthName = (date: Date): MonthName =>
  date.toLocaleString("en-US", { month: "long" });

// Extract year + month from expense date
const getYearMonthFromDateString = (dateStr: string) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }

  return {
    yearStr: d.getFullYear().toString(),
    monthName: getEnglishMonthName(d),
  };
};

// Derived helpers
const computeTotal = (expenses: IExpense[]) =>
  expenses.reduce((sum, e) => sum + e.amount, 0);

const computeBiggestCategory = (expenses: IExpense[]) => {
  if (expenses.length === 0) return null;

  const map: Record<string, number> = {};

  for (const e of expenses) {
    map[e.category] = (map[e.category] || 0) + e.amount;
  }

  return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
};

const computeRecent = (expenses: IExpense[]) =>
  [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

const computeMonthStats = (expenses: IExpense[], monthlyBudget: number) => {
  const total = computeTotal(expenses);

  return {
    totalSpent: total,
    biggestCategory: computeBiggestCategory(expenses),
    recentExpenses: computeRecent(expenses),
    remainingBudget: monthlyBudget - total,
  };
};

// Group expenses by year → month
const groupExpensesByYearMonth = (all: IExpense[]): ExpensesByYear => {
  const map: ExpensesByYear = {};

  for (const expense of all) {
    const { yearStr, monthName } = getYearMonthFromDateString(expense.date);
    if (!map[yearStr]) map[yearStr] = {};
    if (!map[yearStr][monthName]) map[yearStr][monthName] = [];

    map[yearStr][monthName].push(expense);
  }

  return map;
};

// Flatten grouped data (needed when updating)
const flattenExpenses = (byYear: ExpensesByYear): IExpense[] => {
  const result: IExpense[] = [];

  for (const months of Object.values(byYear)) {
    for (const exps of Object.values(months)) {
      result.push(...exps);
    }
  }

  return result;
};

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonthName = getEnglishMonthName(now);
      const initialAllExpenses: IExpense[] = [];
      const expensesByYear = groupExpensesByYearMonth(initialAllExpenses);
      if (!expensesByYear[currentYear]) {
        expensesByYear[currentYear] = {};
      }

      // Ensure current month exists
      if (!expensesByYear[currentYear][currentMonthName]) {
        expensesByYear[currentYear][currentMonthName] = [];
      }

      const monthlyBudget = 1200;
      const thisMonthExpenses =
        expensesByYear[currentYear]?.[currentMonthName] ?? [];

      const initialStats = computeMonthStats(thisMonthExpenses, monthlyBudget);

      return {
        initialize: true,
        isDirty: false,
        expensesByYear,
        currentYear,
        currentMonthName,
        totalSpent: initialStats.totalSpent,
        biggestCategory: initialStats.biggestCategory,
        recentExpenses: initialStats.recentExpenses,
        monthlyBudget,
        remainingBudget: initialStats.remainingBudget,

        actions: {
          setBudget: (amount) => {
            const state = get();
            const monthExpenses =
              state.expensesByYear[state.currentYear]?.[
                state.currentMonthName
              ] ?? [];

            const stats = computeMonthStats(monthExpenses, amount);

            set({
              monthlyBudget: amount,
              ...stats,
              isDirty: true,
            });
          },

          addExpense: (expense) => {
            const state = get();

            const newExpense: IExpense = {
              id: makeId(),
              ...expense,
            };

            const all = [...flattenExpenses(state.expensesByYear), newExpense];
            const byYear = groupExpensesByYearMonth(all);

            const monthExpenses =
              byYear[state.currentYear]?.[state.currentMonthName] ?? [];

            const stats = computeMonthStats(monthExpenses, state.monthlyBudget);

            set({
              expensesByYear: byYear,
              ...stats,
              isDirty: true,
            });
          },

          deleteExpense: (id) => {
            const state = get();

            const all = flattenExpenses(state.expensesByYear).filter(
              (e) => e.id !== id
            );

            const byYear = groupExpensesByYearMonth(all);

            const monthExpenses =
              byYear[state.currentYear]?.[state.currentMonthName] ?? [];

            const stats = computeMonthStats(monthExpenses, state.monthlyBudget);

            set({
              expensesByYear: byYear,
              ...stats,
              isDirty: true,
            });
          },

          editExpense: (updated) => {
            const state = get();

            const all = flattenExpenses(state.expensesByYear).map((e) =>
              e.id === updated.id ? updated : e
            );

            const byYear = groupExpensesByYearMonth(all);

            const monthExpenses =
              byYear[state.currentYear]?.[state.currentMonthName] ?? [];

            const stats = computeMonthStats(monthExpenses, state.monthlyBudget);

            set({
              expensesByYear: byYear,
              ...stats,
              isDirty: true,
            });
          },

          recomputeDerived: () => {
            const state = get();

            const monthExpenses =
              state.expensesByYear[state.currentYear]?.[
                state.currentMonthName
              ] ?? [];

            const stats = computeMonthStats(monthExpenses, state.monthlyBudget);

            set({ ...stats });
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
