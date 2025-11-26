import { Button } from "../components/ui/button";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSettingsActions, useSettings } from "../stores/settingsStore";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const { language } = useSettings();
  const { setLanguage } = useSettingsActions();

  // Sync i18n whenever state changes
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const toggleLanguage = () => {
    const next = language === "en" ? "de" : "en";
    setLanguage(next); // Zustand + localStorage
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleLanguage}
      className="relative cursor-pointer"
      aria-label="Toggle language"
    >
      {language.toUpperCase()}
      <span className="sr-only">Toggle language</span>
    </Button>
  );
}


