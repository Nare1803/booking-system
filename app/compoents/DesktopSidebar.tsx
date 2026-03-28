import Link from "next/link";
import { SignOutButton } from "./SignOutButton";

export function DesktopSidebar({
  user,
  initials,
}: {
  user: any;
  initials: string;
}) {
  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen sticky top-0 h-screen bg-white border-r border-slate-200 p-5">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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

      <nav className="flex-1 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-slate-400 flex-shrink-0"
          >
            <rect
              x="1"
              y="1"
              width="6"
              height="6"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <rect
              x="9"
              y="1"
              width="6"
              height="6"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <rect
              x="1"
              y="9"
              width="6"
              height="6"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <rect
              x="9"
              y="9"
              width="6"
              height="6"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          Overview
        </Link>

        {user.role === "PATIENT" && (
          <Link
            href="/dashboard/book"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-slate-400 flex-shrink-0"
            >
              <rect
                x="1"
                y="3"
                width="14"
                height="12"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M5 1v4M11 1v4M1 7h14M8 10v3M6.5 11.5h3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Book Appointment
          </Link>
        )}

        <Link
          href="/dashboard/appointments"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-slate-400 flex-shrink-0"
          >
            <path
              d="M3 4h10M3 8h7M3 12h5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          My Appointments
        </Link>
      </nav>

      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-800 truncate">
            {user.name}
          </p>
          <p className="text-xs text-slate-400">{user.role}</p>
        </div>
        <SignOutButton />
      </div>
    </aside>
  );
}
