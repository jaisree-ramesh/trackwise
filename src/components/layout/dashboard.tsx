import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useTranslation } from "react-i18next";
import { useExpenses } from "../../stores/expenseStore";
import { AddExpenseModal } from "../expenses/addExpenseModal";
import { ExpensePieChart } from "../expenses/expensePieChart";
import { YearlyExpenseChart } from "../expenses/yearlyExpenseChart";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { t } = useTranslation();
  const {
    totalSpent,
    biggestCategory,
    recentExpenses,
    remainingBudget,
    monthlyBudget,
    currentMonthName,
    currentYear,
  } = useExpenses();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold cursor-default" aria-live="polite">
          {t("dashboard")}
        </h1>
        <AddExpenseModal aria-label={t("addExpense")} />
      </div>
      <p
        className="text-muted-foreground  text-xl cursor-default"
        aria-live="polite"
      >
        {currentMonthName}, {currentYear}
      </p>

      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3 cursor-default">
        {/* Stats Grid */}
        <div
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 items-stretch cursor-default"
          aria-label={t("dashboard")}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t("monthlyBudget")}</CardTitle>
            </CardHeader>
            <CardContent
              className="text-3xl font-bold flex items-center gap-2"
              aria-live="polite"
            >
              €{monthlyBudget.toFixed(2)}
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t("remainingBudget")}</CardTitle>
            </CardHeader>
            <CardContent
              className="text-3xl font-bold text-green-600"
              aria-live="polite"
            >
              €{remainingBudget.toFixed(2)}
            </CardContent>
          </Card>
          <Card className="bg-card h-full">
            <CardHeader>
              <CardTitle>{t("totalSpent")}</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold" aria-live="polite">
              €{totalSpent.toFixed(2)}
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader>
              <CardTitle>{t("biggestCategory")}</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold flex items-center gap-2">
              {biggestCategory ?? "—"}
            </CardContent>
          </Card>
        </div>

        {/* Expense monthly Pie Chart */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>
              {t("monthlyOverview")} - {currentMonthName}, {currentYear}
            </CardTitle>
          </CardHeader>
          <CardContent
            role="img"
            aria-label={t("monthlyOverviewChart")}
            className="h-64 flex items-center justify-center text-muted-foreground"
          >
            <ExpensePieChart year={currentYear} month={currentMonthName} />
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>{t("recentExpenses")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentExpenses.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                {t("expensePage.noExpenses")}
              </p>
            ) : (
              recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex justify-between text-sm items-center"
                >
                  <span>{expense.label}</span>
                  <span className="font-semibold">€{expense.amount}</span>
                </div>
              ))
            )}
            <Button asChild variant="outline" className="w-full mt-2">
              <Link to="/expenses">{t("expensePage.viewAll")}</Link>
            </Button>
          </CardContent>
        </Card>
        {/* yearly expense chart */}
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>
              {t("yearlyOverview")} - {currentYear}
            </CardTitle>
          </CardHeader>
          <CardContent
            role="img"
            aria-label={t("yearlyOverviewChart", { year: currentYear })}
            className="h-64 flex items-center justify-center text-muted-foreground"
          >
            <YearlyExpenseChart year={currentYear} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
