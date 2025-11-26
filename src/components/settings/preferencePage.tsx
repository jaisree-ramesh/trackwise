import { ModeToggle } from "../mode-toggle";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Trash2 } from "lucide-react";
import { LanguageToggle } from "../languageToggle";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { useSettings, useSettingsActions } from "../../stores/settingsStore";
import { useExpenses, useExpenseActions } from "../../stores/expenseStore";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { useTranslation } from "react-i18next";

const PreferencePage = () => {
  const { t } = useTranslation();
  const settings = useSettings();
  const { addCategory, deleteCategory, resetCategories } = useSettingsActions();
  const { monthlyBudget, totalSpent } = useExpenses();
  const { actions: expenseActions } = useExpenseActions() as any;
  const [newCategory, setNewCategory] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const spendingPercent = monthlyBudget
    ? Math.min(100, (totalSpent / monthlyBudget) * 100)
    : 0;

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2500);
  };

  const onNewAddedCategory = () => {
    addCategory(newCategory);
    showMessage(t("preferencePage.categoryAdded"));
    setNewCategory("");
  };

  const onDeleteCategory = (cat: string) => {
    deleteCategory(cat);
    showMessage(t("preferencePage.categoryDeleted"));
  };

  const onResetCategories = () => {
    resetCategories();
    showMessage(t("preferencePage.categoriesReset"));
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 ">
      <Card
        role="region"
        aria-labelledby="preferences-title"
        className="cursor-default"
      >
        <CardHeader>
          <CardTitle id="preferences-title">
            {t("preferencePage.title")}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Language */}
          <div className="space-y-2">
            <Label htmlFor="language-toggle">
              {t("preferencePage.language")}
            </Label>
            <LanguageToggle />
          </div>

          {/* Theme */}
          <div className="space-y-2">
            <Label htmlFor="theme-toggle">{t("preferencePage.theme")}</Label>
            <ModeToggle />
          </div>

          {/* Monthly budget */}
          <div>
            <Label htmlFor="budget-input">
              {t("preferencePage.monthlyBudget")} (€)
            </Label>
            <Input
              id="budget-input"
              type="number"
              min={0}
              // value={monthlyBudget}
              onChange={(e) => expenseActions.setBudget(Number(e.target.value))}
              className="mt-3 w-32 "
              placeholder={`${monthlyBudget}`}
            />

            <div className="text-xs mt-7">
              {t("preferencePage.spent")}: €{totalSpent} / €{monthlyBudget}
              <Progress
                value={spendingPercent}
                max={100}
                className="h-2 mt-1 w-full"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={spendingPercent}
                aria-label={t("preferencePage.budgetProgress")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card
        role="region"
        aria-labelledby="categories-title"
        className="col-span-2 "
      >
        <CardHeader>
          <CardTitle id="categories-title">
            {t("preferencePage.categories")}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder={t("preferencePage.placeholderCategory")}
              aria-label={t("preferencePage.placeholderCategory")}
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <Button
              onClick={() => onNewAddedCategory()}
              disabled={!newCategory.trim()}
              className="cursor-pointer"
            >
              {t("preferencePage.add")}
            </Button>
          </div>

          <Separator />

          <div
            className="space-y-2 max-h-48 overflow-y-auto"
            aria-label={t("preferencePage.categoryList")}
            role="list"
          >
            {settings.categories.map((cat) => (
              <div
                key={cat}
                role="listitem"
                className="flex justify-between items-center"
              >
                <span>{cat}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive cursor-pointer"
                  aria-label={`${t("preferencePage.deleteCategory")} ${cat}`}
                  onClick={() => onDeleteCategory(cat)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={() => onResetCategories()}>
            {t("preferencePage.reset")}
          </Button>
        </CardContent>
      </Card>

      <div aria-live="polite" className="sr-only">
        {message}
      </div>
    </div>
  );
};

export default PreferencePage;
