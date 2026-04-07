import type { ReactNode } from "react";

/**
 * Full-width auth split layout that adapts from single column (mobile)
 * to equal two-column layout from md and up.
 */
export function AuthSplitLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh w-full bg-white">
      <div className="grid min-h-dvh w-full grid-cols-1 md:grid-cols-2 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
