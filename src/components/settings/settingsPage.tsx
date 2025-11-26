import { useTranslation } from "react-i18next";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import ProfilePage from "./profilePage";
import PreferencePage from "./preferencePage";
import DataPage from "./dataPage";
import AboutPage from "./aboutPage";

export default function SettingsPage() {
  const { t,  } = useTranslation();

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("settings") ?? "Settings"}</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full ">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 ">
          <TabsTrigger value="profile" className="cursor-pointer">
            {t("settingsPage.profile")}
          </TabsTrigger>
          <TabsTrigger value="preferences" className="cursor-pointer">
            {t("settingsPage.preferences")}
          </TabsTrigger>
          <TabsTrigger value="data" className="cursor-pointer">
            {t("settingsPage.data")}
          </TabsTrigger>
          <TabsTrigger value="about" className="cursor-pointer">
            {t("settingsPage.about")}
          </TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile">
          <ProfilePage />
        </TabsContent>

        {/* PREFERENCES */}
        <TabsContent value="preferences">
          <PreferencePage />
        </TabsContent>

        {/* DATA TAB */}
        <TabsContent value="data">
          <DataPage />
        </TabsContent>

        {/* ABOUT */}
        <TabsContent value="about">
          <AboutPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
