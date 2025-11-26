import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";

export function AppLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
