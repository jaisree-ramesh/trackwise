import { useTranslation } from "react-i18next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Info } from "lucide-react";

const AboutPage = () => {
  const { t } = useTranslation();
  // ABOUT info
  const appVersion = "1.0.0";
  return (
    <Card aria-labelledby="about-title">
      <CardHeader>
        <CardTitle id="about-title">{t("about.title")}</CardTitle>
        <CardDescription>{t("about.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <dl className="flex items-center gap-2">
          <Info className="h-4 w-4" aria-hidden="true" />
          <dt className="sr-only">{t("about.version")}</dt>
          <dd>Version: {appVersion}</dd>
        </dl>

        <p>{t("about.content")}</p>
      </CardContent>
    </Card>
  );
};

export default AboutPage;
