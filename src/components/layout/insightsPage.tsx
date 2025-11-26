import { useState, useMemo } from "react";
import { useExpenses } from "@/stores/expenseStore";
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
import { Separator } from "../../components/ui/separator";
import { ExpensePieChart } from "../expenses/expensePieChart";
import { YearlyExpenseChart } from "../expenses/yearlyExpenseChart";
import { Progress } from "../../components/ui/progress";
import { useTranslation } from "react-i18next";
import { useMonths } from "../../lib/useMonths";

const InsightsPage = () => {
  const { t } = useTranslation();
  const { expensesByYear, currentYear, currentMonthName } = useExpenses();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonthName);
  const months = useMonths();

  // Monthly data
  const monthlyExpenses = expensesByYear?.[year]?.[month] ?? [];
  const monthlyTotal = monthlyExpenses.reduce((s, e) => s + e.amount, 0);

  // Biggest category
  const biggestCategory = useMemo(() => {
    const map: Record<string, number> = {};
    monthlyExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });

    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] ?? "—";
  }, [monthlyExpenses]);

  // All category breakdown for monthly
  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};
    monthlyExpenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return map;
  }, [monthlyExpenses]);

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold">{t("insightsPage.title")}</h1>

      {/* FILTERS */}
      <div className="flex gap-4">
        {/* YEAR SELECT */}
        <Select
          value={year.toString()}
          onValueChange={(v) => setYear(Number(v))}
        >
          <SelectTrigger className="w-36 cursor-pointer" id="year-select">
            <SelectValue placeholder={year} />
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
        <Select value={month} onValueChange={setMonth}>
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

      {/* MONTHLY INSIGHTS */}
      <Card className="cursor-default">
        <CardHeader>
          <CardTitle>
            {t("insightsPage.monthlyInsights", { month, year })}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-lg font-semibold">
            {t("totalSpent")}: €{monthlyTotal.toFixed(2)}
          </p>
          <p className="text-muted-foreground">
            {t("biggestCategory")}: {biggestCategory}
          </p>
          <Separator />

          {/* Category Breakdown */}
          {Object.entries(categoryTotals).length === 0 ? (
            <p className="text-muted-foreground text-sm">
              {t("expensePage.noExpenses")}
            </p>
          ) : (
            Object.entries(categoryTotals).map(([cat, total]) => {
              const percent = (total / monthlyTotal) * 100;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{cat}</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                  <Progress value={percent} />
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Pie Chart */}
        <Card className="cursor-default">
          <CardHeader>
            <CardTitle>{t("insightsPage.monthlyCategorySplit")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensePieChart year={year} month={month} />
          </CardContent>
        </Card>

        {/* Yearly Area Chart */}
        <Card className="xl:col-span-1 cursor-default">
          <CardHeader>
            <CardTitle>{t("insightsPage.yearlyInsights", { year })}</CardTitle>
          </CardHeader>
          <CardContent>
            <YearlyExpenseChart year={year} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default InsightsPage;
