import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [current, setCurrent] = useState<"light" | "dark">("light");

  // Determine actual active theme (considering "system")
  useEffect(() => {
    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setCurrent(prefersDark ? "dark" : "light");
    } else {
      setCurrent(theme);
    }
  }, [theme]);

  // Toggle between light & dark
  const toggleTheme = () => {
    const next = current === "light" ? "dark" : "light";
    setTheme(next);
    setCurrent(next);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative"
    >
      {current === "light" ? (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
