import { getMyAppointments } from "@/actions/appointment";
import { AppointmentCard } from "@/app/compoents/AppointmentCard";
import { auth } from "@/lib/auth";

export default async function AppointmentsPage() {
  const session = await auth();
  const appointments = await getMyAppointments();
  const role = (session?.user as any)?.role;

  const now = new Date();
  const upcoming = appointments.filter(
    (a) => new Date(a.date) >= now && a.status !== "CANCELLED",
  );
  const past = appointments.filter(
    (a) => new Date(a.date) < now && a.status !== "CANCELLED",
  );
  const cancelled = appointments.filter((a) => a.status === "CANCELLED");

  return (
    <div className="animate-fade-up space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
        <p className="text-sm text-slate-400 mt-1">
          {appointments.length} total
        </p>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-semibold text-slate-600">No appointments yet</p>
          <p className="text-sm text-slate-400 mt-1">
            Book your first appointment to get started
          </p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Upcoming — {upcoming.length}
              </p>
              <div className="space-y-3">
                {upcoming.map((a, i) => (
                  <div
                    key={a.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <AppointmentCard appointment={a} role={role} />
                  </div>
                ))}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Past — {past.length}
              </p>
              <div className="space-y-3">
                {past.map((a, i) => (
                  <div
                    key={a.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <AppointmentCard appointment={a} role={role} />
                  </div>
                ))}
              </div>
            </section>
          )}
          {cancelled.length > 0 && (
            <section>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Cancelled — {cancelled.length}
              </p>
              <div className="space-y-3">
                {cancelled.map((a, i) => (
                  <div
                    key={a.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <AppointmentCard appointment={a} role={role} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
