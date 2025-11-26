import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import type { ISidebarItem } from "../../types/sidebarItem";

export default function SidebarItem(props: ISidebarItem) {
  if (props.isButton) {
    return (
      <button
        type="button"
        onClick={props.onClick}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition flex-shrink-0",
          "hover:bg-destructive/10 hover:text-destructive text-foreground"
        )}
        aria-label={props.label}
        aria-pressed="false"
      >
        <props.icon size={20} className="flex-shrink-0" />
        <span className="hidden lg:inline">{props.label}</span>
      </button>
    );
  }

  // Default NavLink
  return (
    <NavLink
      to={props.href!}
      aria-label={props.label}
      className={({ isActive }) =>
        cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition flex-shrink-0",
          isActive
            ? "bg-primary/10 text-primary"
            : "hover:bg-muted hover:text-foreground"
        )
      }
    >
      <props.icon size={20} className="flex-shrink-0" />
      <span className="hidden lg:inline">{props.label}</span>
    </NavLink>
  );
}
