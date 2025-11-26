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

export default function SignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuthActions();
  const { setUserName, setEmail } = useSettingsActions();
  const [username, setUsername] = useState("");
  const [email, setEmailValue] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError(t("usernameRequired"));
      return;
    }

    if (password !== confirm) {
      setError(t("passwordRequired"));
      return;
    }

    setLoading(true);

    try {
      const hash = await hashPassword(password);
      // Register user in auth store
      const result = register(username.trim(), email.trim(), hash);
      if (!result.success) {
        setError(result.error || t("signUpError"));
        return;
      }

      // Save profile info to settings store
      setUserName(username.trim());
      setEmail(email.trim());

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(t("signUpError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("signUpTitle")}</CardTitle>
          <CardDescription>{t("signUpSubtitle")}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* USERNAME */}
            <div className="space-y-1">
              <Label htmlFor="username">{t("username")}</Label>
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                aria-invalid={!!error}
                aria-describedby={error ? "signup-error" : undefined}
              />
            </div>

            {/* EMAIL */}
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
                aria-describedby={error ? "signup-error" : undefined}
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-1">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-invalid={!!error}
                aria-describedby={error ? "signup-error" : undefined}
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-1">
              <Label htmlFor="confirm">{t("confirmPassword")}</Label>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                aria-invalid={!!error}
                aria-describedby={error ? "signup-error" : undefined}
              />
            </div>

            {/* ERROR */}
            {error && (
              <p
                className="text-sm text-red-500"
                role="alert"
                id="signup-error"
              >
                {error}
              </p>
            )}

            {/* SUBMIT */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              aria-busy={loading}
              aria-label={t("signUp")}
            >
              {loading ? t("creatingAccount") : t("signUp")}
            </Button>
          </form>

          <p className="mt-4 text-sm text-muted-foreground text-center">
            {t("existingAccount")}
            <Link
              to="/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              {t("logIn")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
