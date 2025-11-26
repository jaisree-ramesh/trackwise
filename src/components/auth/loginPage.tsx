import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthActions } from "../../stores/authStore";
import { useSettingsActions } from "../../stores/settingsStore";
import { hashPassword } from "../../lib/hashPassword";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuthActions();
  const { setEmail } = useSettingsActions();
  const [email, setEmailValue] = useState("");
  // const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const hash = await hashPassword(password);
      const result = login(email.trim(), hash);
      if (!result.success) {
        setError(result.error || "Login failed.");
        return;
      }
      // store profile info
      setEmail(email.trim());
      // setUserName(username.trim());
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(t("loginError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("loginTitle")}</CardTitle>
          <CardDescription>{t("loginSubtitle")}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmailValue(e.target.value)}
                required
                aria-invalid={!!error}
                aria-describedby={error ? t("loginError") : undefined}
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-invalid={!!error}
                aria-describedby={error ? t("loginError") : undefined}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500" role="alert" id="login-error">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              aria-busy={loading}
              aria-label={t("logInForm")}
            >
              {loading ? t("loggingIn") : t("logIn")}
            </Button>
          </form>

          <p className="mt-4 text-sm text-muted-foreground text-center">
            {t("noAccount")}
            <Link
              to="/signup"
              className="text-primary underline-offset-4 hover:underline"
            >
              {t("signUp")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
