import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useExpenses } from "../../stores/expenseStore";
import { AddExpenseModal } from "../expenses/addExpenseModal";

export default function Dashboard() {
  const { t } = useTranslation();
  const { totalSpent, biggestCategory, recentExpenses, remainingBudget,monthlyBudget } =
    useExpenses();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("dashboard")}</h1>

        <AddExpenseModal />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Spent */}
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>{t("totalSpent")}</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            €{totalSpent.toFixed(2)}
          </CardContent>
        </Card>

        {/* Biggest Category */}
        <Card>
          <CardHeader>
            <CardTitle>{t("biggestCategory")}</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold flex items-center gap-2">
            {biggestCategory ?? "—"}
          </CardContent>
        </Card>

        {/* Biggest Category */}
        <Card>
          <CardHeader>
            <CardTitle>{t("monthlyBudget")}</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold flex items-center gap-2">
            €{monthlyBudget.toFixed(2)}
          </CardContent>
        </Card>

        {/* Remaining Budget */}
        <Card>
          <CardHeader>
            <CardTitle>{t("remainingBudget")}</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-600">
            €{remainingBudget.toFixed(2)}
          </CardContent>
        </Card>
      </div>

      {/* Chart & Recent Activity Section */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        {/* Placeholder Chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            Chart goes here
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentExpenses.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No recent expenses yet.
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
            <Button variant="outline" className="w-full mt-2">
              View All
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
