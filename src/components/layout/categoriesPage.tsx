import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useExpenses } from "../../stores/expenseStore";
import { Progress } from "../../components/ui/progress";
import { Separator } from "../../components/ui/separator";
import { useTranslation } from "react-i18next";

interface ICategoriesPageProps {
  year: number;
  month: string;
}

export default function CategoriesPage(props: ICategoriesPageProps) {
  const { t } = useTranslation();
  const { expensesByYear } = useExpenses();
  // Get expenses for given year + month
  const currentExpenses = expensesByYear?.[props.year]?.[props.month] ?? [];
  // Compute totals per category
  const categoryTotals: Record<string, number> = {};
  currentExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  // Convert to array for loop
  const categories = Object.entries(categoryTotals).map(([cat, total]) => ({
    category: cat,
    total,
  }));

  const grandTotal = currentExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle id="categories-heading">
          {t("categoriesPage.title", { month: props.month, year: props.year })}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4" aria-labelledby="categories-heading">
        {categories.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {t("categoriesPage.noExpenses")}
          </p>
        ) : (
          categories.map((item) => {
            const percent = grandTotal ? (item.total / grandTotal) * 100 : 0;

            return (
              <div
                key={item.category}
                className="space-y-2"
                aria-labelledby={`cat-${item.category}`}
              >
                <div className="flex justify-between text-sm font-medium">
                  <span id={`cat-${item.category}`}>{item.category}</span>
                  <span>€{item.total.toFixed(2)}</span>
                </div>
                <Progress
                  value={percent}
                  className="h-2"
                  aria-label={`${item.category} ${percent.toFixed(0)}%`}
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
                <Separator />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
