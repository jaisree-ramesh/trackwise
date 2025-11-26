import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../../components/ui/chart";
import { useExpenses } from "../../stores/expenseStore";
import { useTranslation } from "react-i18next";

interface ILineChart {
  year: number;
}

export function YearlyExpenseChart(props: ILineChart) {
  const { t } = useTranslation();
  const { expensesByYear } = useExpenses();
  const months = [
    t("expensePage.months.january"),
    t("expensePage.months.february"),
    t("expensePage.months.march"),
    t("expensePage.months.april"),
    t("expensePage.months.may"),
    t("expensePage.months.june"),
    t("expensePage.months.july"),
    t("expensePage.months.august"),
    t("expensePage.months.september"),
    t("expensePage.months.october"),
    t("expensePage.months.november"),
    t("expensePage.months.december"),
  ];

  const categories = new Set<string>();

  Object.values(expensesByYear?.[props.year] ?? {}).forEach(
    (monthData: any) => {
      monthData?.forEach((exp: any) => categories.add(exp.category));
    }
  );

  const categoryList = Array.from(categories);

  const yearlyData = months.map((month) => {
    const monthExpenses = expensesByYear?.[props.year]?.[month] ?? [];
    const row: any = { month };

    categoryList.forEach((cat) => {
      row[cat] = monthExpenses
        .filter((e: any) => e.category === cat)
        .reduce((sum: number, e: any) => sum + e.amount, 0);
    });

    return row;
  });

  const chartConfig: ChartConfig = {};

  categoryList.forEach((cat, index) => {
    chartConfig[cat] = {
      label: cat,
      color: `var(--chart-${(index % 5) + 1})`,
    };
  });

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[260px] w-full"
      role="img"
      aria-label ={t("yearlyOverview")}
    >
      <AreaChart data={yearlyData}>
      <title>{t("yearlyOverview")}</title>
        <defs>
          {categoryList.map((cat, index) => {
            const color = `var(--chart-${(index % 5) + 1})`;
            return (
              <linearGradient
                key={cat}
                id={`fill-${cat}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={color} stopOpacity={0.7} />
                <stop offset="95%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            );
          })}
        </defs>

        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          minTickGap={20}
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />

        {categoryList.map((cat, index) => {
          const color = `var(--chart-${(index % 5) + 1})`;

          return (
            <Area
              aria-label={`${cat} ${t("expenses")}`}
              key={cat}
              type="linear"
              dataKey={cat}
              stroke={color}
              fill={`url(#fill-${cat})`}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          );
        })}

        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
}
