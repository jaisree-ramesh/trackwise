import { useState } from "react";
import { useExpenses } from "../../stores/expenseStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { AddExpenseModal } from "./addExpenseModal";
import CategoriesPage from "../layout/categoriesPage";
import { useTranslation } from "react-i18next";
import { useMonths } from "../../lib/useMonths";

export default function AllExpensesPage() {
  const { t } = useTranslation();
  const { expensesByYear, currentYear, currentMonthName } = useExpenses();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonthName);
  const expenses = expensesByYear?.[year]?.[month] ?? [];
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const months = useMonths();

  return (
    <div className="p-6 flex flex-col gap-6 cursor-default">
      {/* HEADER */}
      <div
        className="flex items-center justify-between"
        aria-labelledby="expenses-heading"
      >
        <h1 className="text-2xl font-bold">{t("expensePage.title")}</h1>
        <AddExpenseModal />
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 ">
        {/* YEAR SELECT */}
        <Select
          value={year.toString()}
          onValueChange={(v) => setYear(Number(v))}
        >
          <SelectTrigger className="w-36 cursor-pointer" id="year-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(expensesByYear).map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* MONTH SELECT */}
        <Select value={month} onValueChange={(v) => setMonth(v)}>
          <SelectTrigger className="w-44 cursor-pointer" id="month-select">
            <SelectValue placeholder={month} />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* SUMMARY */}
      <Card>
        <CardHeader>
          <CardTitle>
            {month} {year} {t("expensePage.summary")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">
            {t("expensePage.totalSpent")}: €{total.toFixed(2)}
          </p>
          <p className="text-muted-foreground text-sm">
            {expenses.length} {t("expensePage.transactions")}
          </p>
        </CardContent>
      </Card>

      {/* EXPENSE LIST */}
      <Card>
        <CardHeader>
          <CardTitle>{t("expensePage.title")}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {expenses.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {t("expensePage.noExpenses")}
            </p>
          )}

          {expenses.map((e) => (
            <div
              key={e.id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{e.label}</p>
                <p className="text-sm text-muted-foreground">{e.category}</p>
              </div>
              <p className="font-semibold" aria-live="polite">
                €{e.amount.toFixed(2)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
      <CategoriesPage year={year} month={month} />
    </div>
  );
}
