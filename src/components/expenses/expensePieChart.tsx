import { Pie, PieChart, LabelList } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import { useExpenses } from "../../stores/expenseStore";
import { useTranslation } from "react-i18next";

interface IPieChart {
  year: number;
  month: string;
}

export function ExpensePieChart(props: IPieChart) {
  const { t } = useTranslation();
  const { expensesByYear } = useExpenses();
  const expenses = expensesByYear?.[props.year]?.[props.month] ?? [];

  // Group by category
  const categoryMap: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
  });

  const chartData = Object.entries(categoryMap).map(
    ([category, amount], i) => ({
      category,
      amount,
      fill: `var(--chart-${(i % 12) + 1})`,
    })
  );

  // Chart config
  const chartConfig: any = {
    amount: { label: t("amount") },
  };

  for (const item of chartData) {
    chartConfig[item.category] = {
      label: item.category,
      color: item.fill,
    };
  }

  return (
    <div className="flex-1 pb-0" role="img" aria-label={t("monthlyOverview")}>
      {chartData.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center mt-10">
          {t("expensePage.noExpenses")}
        </p>
      ) : (
        <>
          <ChartContainer
            config={chartConfig}
            className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <title>{t("monthlyOverview")}</title>
              <ChartTooltip
                content={
                  <ChartTooltipContent nameKey="amount" labelKey="category" />
                }
              />
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                outerRadius={120}
              >
                <LabelList
                  dataKey="category"
                  className="fill-background"
                  stroke="none"
                  fontSize={12}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
          {/*Screen-reader accessible summary */}
          <ul className="sr-only">
            {chartData.map((item) => (
              <li key={item.category}>
                {item.category}: €{item.amount.toFixed(2)}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
