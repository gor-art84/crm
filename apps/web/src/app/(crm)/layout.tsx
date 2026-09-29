import type { ReactNode } from "react";
import { AppNav } from "./nav";
import { SessionBar } from "./session-bar";

export default function CrmLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header>
        <SessionBar />
        <AppNav />
      </header>
      {children}
    </div>
  );
}
