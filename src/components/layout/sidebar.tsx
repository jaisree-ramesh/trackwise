import { Home, List, BarChart2, Settings, LogOut } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { useTranslation } from "react-i18next";
import SidebarItem from "./sidebarItem";
import logoLight from "../../assets/logoLight.png";
import logoDark from "../../assets/logoDark.png";
import { Link } from "react-router-dom";
import { useAuth, useAuthActions } from "../../stores/authStore";
import { useSettings, useSettingsActions } from "../../stores/settingsStore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../../components/ui/tooltip";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
  const { t } = useTranslation();
  const { isAuthenticated, email } = useAuth();
  const { userName } = useSettings();
  const navigate = useNavigate();

  const displayName =
    isAuthenticated && (userName || email)
      ? userName || email
      : t("guest") || "Guest";

  const subtitle = isAuthenticated && userName ? email : "";

  const {  setEmail } = useSettingsActions();
  const { logout } = useAuthActions();

  const handleLogout = () => {
    const ok = window.confirm(
      t("confirmLogout") || "Are you sure you want to log out?"
    );
    if (!ok) return;
      logout();
      setEmail("");
      navigate("/login");
  };

  return (
    <aside
      className="flex h-screen w-16 lg:w-64 flex-col justify-between border-r bg-sidebar text-sidebar-foreground p-4"
      aria-label={t("sidebar")}
    >
      {/* TOP SECTION: Logo + Menu */}
      <Link to="/" aria-label="Trackwise home">
        {/* Logo Wrapper */}
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="group mb-6 flex items-center gap-2 px-2 flex-shrink-0 cursor-pointer"
                aria-label={t("goToDashboard")}
                onClick={() => navigate("/")}
              >
                {/* Logo (Static size, no shrinking) */}
                <div className="min-w-8 min-h-8 flex items-center justify-center">
                  {/* Light mode logo */}
                  <img
                    src={logoLight}
                    alt="Trackwise light logo"
                    className="h-8 w-8 object-contain dark:hidden"
                  />
                  {/* Dark mode logo */}
                  <img
                    src={logoDark}
                    alt="Trackwise dark logo"
                    className="h-8 w-8 object-contain hidden dark:block"
                  />
                </div>

                {/* Trackwise Text — only shown on large screens */}
                <span className="hidden lg:inline text-xl font-semibold">
                  Trackwise
                </span>
              </button>
            </TooltipTrigger>

            {/* Tooltip visible only when collapsed */}
            <TooltipContent
              side="right"
              className="lg:hidden bg-popover text-popover-foreground"
            >
              Trackwise
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* NAVIGATION MENU */}
        <nav
          className="space-y-2"
          aria-label={t("navigation")}
          role="navigation"
        >
          <SidebarItem icon={Home} label={t("dashboard")} href="/" />
          <SidebarItem icon={List} label={t("allExpenses")} href="/expenses" />
          <SidebarItem
            icon={BarChart2}
            label={t("insights")}
            href="/insights"
          />
          <SidebarItem icon={Settings} label={t("settings")} href="/settings" />
          <SidebarItem
            icon={LogOut}
            label={t("logout")}
            onClick={handleLogout}
            isButton
            aria-pressed="false"
            aria-label={t("logout")}
          />
        </nav>
      </Link>

      {/* BOTTOM SECTION: Avatar + Username */}
      <div
        className="mt-6 border-t pt-4 flex items-center justify-between"
        aria-label={t("userSection")}
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 cursor-pointer">
          <Link
            to="/settings"
            className="flex items-center gap-3 group cursor-pointer focus:outline-none"
            aria-label={t("settings")}
          >
            <Avatar className="h-10 w-10" aria-label={t("avatar")}>
              <AvatarImage src="/avatar.png" alt={`${displayName}'s avatar`} />
              <AvatarFallback>
                {displayName ? displayName.charAt(0).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>

            <div className="hidden lg:flex flex-col">
              <span className="font-medium truncate max-w-[140px]">
                {displayName}
              </span>
              <span className="text-sm text-muted-foreground">{subtitle}</span>
            </div>
          </Link>
        </div>

        {/* Right side:  login button if needed */}
        <div className="flex flex-col items-end gap-2">
          {!isAuthenticated && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden lg:inline-flex"
              aria-label={t("login")}
            >
              <Link to="/login">{t("login")}</Link>
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
