import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DesktopSidebar } from "../compoents/DesktopSidebar";
import { MobileSidebar } from "../compoents/MobileSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const user = session.user as any;
  const initials =
    user.name
      ?.split(" ")
      .map((n: string) => n[0])
      .slice(0, 2)
      .join("") ?? "?";

  return (
    <div className="min-h-screen flex bg-slate-50">
      <DesktopSidebar user={user} initials={initials} />

      <div className="flex-1 flex flex-col">
        <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1v12M1 7h12"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-sm">MediBook</span>
          </div>
          <MobileSidebar user={user} initials={initials} />
        </div>

        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
