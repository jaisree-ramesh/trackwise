import { useTranslation } from "react-i18next";

export const useMonths = () => {
  const { t } = useTranslation();

  return [
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
};
