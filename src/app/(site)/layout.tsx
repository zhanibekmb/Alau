import { Suspense } from "react";
import { Sidebar } from "@/components/sidebar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <Sidebar />
      </Suspense>
      <main className="pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:ml-[var(--sidebar-w)] md:pb-0 md:transition-[margin] md:duration-300">{children}</main>
    </>
  );
}
