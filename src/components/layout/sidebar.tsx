import { Home, List, Folder, BarChart2, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import { useTranslation } from "react-i18next";
import SidebarItem from "./sidebarItem";
import logoLight from "../../assets/logoLight.png";
import logoDark from "../../assets/logoDark.png";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

export function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="flex h-screen w-16 lg:w-64 flex-col justify-between border-r bg-sidebar text-sidebar-foreground p-4">
      {/* TOP SECTION: Logo + Menu */}
      <div>
        {/* Logo Wrapper */}
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="group mb-6 flex items-center gap-2 px-2 flex-shrink-0 cursor-pointer"
                aria-label="Trackwise logo"
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
              </div>
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
        <nav className="space-y-2" aria-label={t("navigation")}>
          <SidebarItem icon={Home} label={t("dashboard")} href="/" />
          <SidebarItem icon={List} label={t("allExpenses")} href="/expenses" />
          <SidebarItem
            icon={Folder}
            label={t("categories")}
            href="/categories"
          />
          <SidebarItem
            icon={BarChart2}
            label={t("insights")}
            href="/insights"
          />
          <SidebarItem icon={Settings} label={t("settings")} href="/settings" />
        </nav>
      </div>

      {/* BOTTOM SECTION: Avatar + Username + ModeToggle */}
      <div className="mt-6 border-t pt-4 flex items-center justify-between">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <Avatar className="h-10 w-10" aria-label={t("avatar")}>
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback>JR</AvatarFallback>
          </Avatar>

          {/* Username only on large screens */}
          <div className="hidden lg:flex flex-col">
            <span className="font-medium">Jaisree R</span>
            <span className="text-sm text-muted-foreground">Premium User</span>
          </div>
        </div>

        {/* Theme Toggle */}
        <ModeToggle />
      </div>
    </aside>
  );
}

export default Sidebar;
