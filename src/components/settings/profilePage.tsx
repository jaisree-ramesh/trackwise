import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useSettings, useSettingsActions } from "../../stores/settingsStore";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const { t } = useTranslation();
  const settings = useSettings();
  const { setUserName, setEmail } = useSettingsActions();
  const [nameDraft, setNameDraft] = useState(settings.userName);
  const [emailDraft, setEmailDraft] = useState(settings.email);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaved(false);

    // simulate small delay so spinner is visible
    await new Promise((res) => setTimeout(res, 600));

    setUserName(nameDraft.trim() || "Trackwise User");
    setEmail(emailDraft.trim());

    // Clear input boxes
    setNameDraft("");
    setEmailDraft("");
    setSaving(false);
    setSaved(true);

    // Hide success message after 4s
    setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t("profilePage.title")}</CardTitle>
          <CardDescription>{t("profilePage.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1">
            <Label htmlFor="name">{t("profilePage.username")}</Label>
            <Input
              id="name"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              placeholder={t("profilePage.username")}
              className="mt-3"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">{t("profilePage.email")} </Label>
            <Input
              id="email"
              type="email"
              value={emailDraft}
              onChange={(e) => setEmailDraft(e.target.value)}
              placeholder="you@example.com"
              className="mt-3"
            />
          </div>

          <Button
            onClick={handleSaveProfile}
            className="w-full sm:w-auto cursor-pointer"
            disabled={saving}
            aria-busy={saving}
          >
            {saving && (
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></span>
            )}
            {saving ? "Saving..." : "Save Profile"}
          </Button>

          {saved && (
            <p
              className="text-green-600 text-sm font-medium animate-fadeIn"
              role="status"
              aria-live="polite"
            >
              {t("profilePage.profileSaved")}
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("profilePage.security")}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>{t("profilePage.securityText")}</p>
          <p>{t("profilePage.securityText2")}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
