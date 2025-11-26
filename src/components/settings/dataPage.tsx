import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Separator } from "../ui/separator";
import { Database } from "lucide-react";
import { useSettingsActions } from "../../stores/settingsStore";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const DataPage = () => {
  const { t } = useTranslation();
  const { resetAllLocalData } = useSettingsActions();

  const [message, setMessage] = useState("");

  // Reset message after 4 seconds
  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleExport = () => {
    const data = {
      expenses: localStorage.getItem("trackwise-expenses"),
      settings: localStorage.getItem("trackwise-settings"),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trackwise-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    showMessage(t("dataPage.exportSuccess"));
  };

  const handleReset = () => {
    const ok = window.confirm(t("dataPage.confirmReset"));
    if (ok) {
      resetAllLocalData();
      showMessage(t("dataPage.resetSuccess"));
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Visible toast-style message */}
      {message && (
        <div className="p-3 rounded-md bg-green-100 text-green-800 border border-green-300">
          {message}
        </div>
      )}
      <Card role="region" aria-labelledby="export-section">
        <CardHeader>
          <CardTitle>{t("dataPage.title")}</CardTitle>
          <CardDescription>{t("dataPage.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <Button
            type="button"
            variant="outline"
            onClick={handleExport}
            aria-label={t("dataPage.exportDataButton")}
          >
            {t("dataPage.exportDataButton")}
          </Button>
          <Separator />

          <div className="space-y-2">
            <Label htmlFor="reset-data-btn">
              {t("dataPage.resetDataButton")}
            </Label>
            <p className="text-xs text-muted-foreground" id="reset-warning">
              {t("dataPage.resetDataWarning")}
            </p>
            <Button
              type="button"
              variant="destructive"
              onClick={handleReset}
              id="reset-data-btn"
              aria-label={t("dataPage.resetDataButton")}
            >
              <Database className="h-4 w-4 mr-2" />
              {t("dataPage.resetDataButton")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card role="region" aria-labelledby="storage-section">
        <CardHeader>
          <CardTitle>{t("dataPage.storage")}</CardTitle>
          <CardDescription>{t("dataPage.storageSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>{t("dataPage.aboutContent")}</p>
        </CardContent>
      </Card>
      {/* Hidden but accessible live region for screen readers */}
      <div aria-live="polite" className="sr-only">
        {message}
      </div>
    </div>
  );
};

export default DataPage;
