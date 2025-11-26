import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/appLayout";
import Dashboard from "./components/layout/dashboard";
import AllExpensesPage from "./components/expenses/allExpensesPage";
import InsightsPage from "./components/layout/insightsPage";
import SettingsPage from "./components/settings/settingsPage";
import LoginPage from "./components/auth/loginPage";
import SignupPage from "./components/auth/signupPage";
import { RequireAuth } from "./routes/requireAuth";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSettings } from "./stores/settingsStore";

function App() {
  const { language } = useSettings();
  const { i18n } = useTranslation();


  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          {/* ---------- Public Auth Routes ---------- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* ---------- Protected App Routes ---------- */}
          <Route element={<AppLayout />}>
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/expenses" element={<AllExpensesPage />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
