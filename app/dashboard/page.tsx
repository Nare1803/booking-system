import { auth } from "@/lib/auth";
import { getMyAppointments } from "@/actions/appointment";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const appointments = await getMyAppointments();
  const user = session?.user as any;

  const now = new Date();
  const upcoming = appointments.filter(
    (a) => new Date(a.date) >= now && a.status !== "CANCELLED",
  );
  const completed = appointments.filter((a) => a.status === "COMPLETED");
  const cancelled = appointments.filter((a) => a.status === "CANCELLED");

  const stats = [
    { label: "Total", value: appointments.length, color: "text-slate-800" },
    { label: "Upcoming", value: upcoming.length, color: "text-emerald-700" },
    { label: "Completed", value: completed.length, color: "text-blue-700" },
    { label: "Cancelled", value: cancelled.length, color: "text-red-500" },
  ];

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Good morning, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-slate-200 p-5"
          >
            <p className="text-xs text-slate-400 mb-2">{s.label}</p>
            <p className={`text-3xl font-bold font-mono ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {user?.role === "PATIENT" && (
        <Link
          href="/dashboard/book"
          className="flex items-center justify-between bg-emerald-700 hover:bg-emerald-800 rounded-2xl p-5 transition-colors group"
        >
          <div>
            <p className="font-bold text-white text-base">
              Book an appointment
            </p>
            <p className="text-emerald-200 text-sm mt-0.5">
              Choose a specialist and a time that works for you
            </p>
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-white transition-transform group-hover:translate-x-1"
          >
            <path
              d="M4 10h12M10 4l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Upcoming
          </p>
          <Link
            href="/dashboard/appointments"
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            View all →
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm text-slate-400">No upcoming appointments</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 4).map((a, i) => (
              <div
                key={a.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 animate-fade-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {user?.role === "PATIENT"
                    ? (a.doctor.name?.split(" ")[1]?.[0] ?? "D")
                    : (a.patient.name?.[0] ?? "P")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {user?.role === "PATIENT"
                      ? `Dr. ${a.doctor.name}`
                      : a.patient.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user?.role === "PATIENT"
                      ? a.doctor.specialty
                      : a.patient.email}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-emerald-700">
                    {new Date(a.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    {new Date(a.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
