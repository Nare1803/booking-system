"use client";

import { cancelAppointment, completeAppointment } from "@/actions/appointment";
import { AppointmentWithRelations } from "@/types";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";

const STATUS: Record<string, { pill: string; dot: string; label: string }> = {
  PENDING: {
    pill: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
    label: "Pending",
  },
  CONFIRMED: {
    pill: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    label: "Confirmed",
  },
  CANCELLED: {
    pill: "bg-red-50 text-red-600 border border-red-200",
    dot: "bg-red-500",
    label: "Cancelled",
  },
  COMPLETED: {
    pill: "bg-blue-50 text-blue-600 border border-blue-200",
    dot: "bg-blue-400",
    label: "Completed",
  },
};

export function AppointmentCard({
  appointment,
  role,
}: {
  appointment: AppointmentWithRelations;
  role: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const s = STATUS[appointment.status] ?? STATUS.PENDING;
  const d = new Date(appointment.date);
  const isToday = d.toDateString() === new Date().toDateString();

  const canCancel =
    appointment.status === "PENDING" || appointment.status === "CONFIRMED";

  const canComplete =
    role === "DOCTOR" &&
    (appointment.status === "PENDING" || appointment.status === "CONFIRMED");

  function handleCancel() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setConfirming(false);
    startTransition(async () => {
      await cancelAppointment(appointment.id);
      router.refresh();
    });
  }

  function handleComplete() {
    startTransition(async () => {
      await completeAppointment(appointment.id);
      router.refresh();
    });
  }

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-5 flex gap-4 transition-opacity ${
        appointment.status === "CANCELLED" ? "opacity-50" : ""
      }`}
    >
      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center">
        <span className="text-xs font-semibold text-slate-400 uppercase font-mono">
          {d.toLocaleDateString("en-US", { month: "short" })}
        </span>
        <span className="text-xl font-bold text-slate-800 leading-none font-mono">
          {d.getDate()}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {role === "PATIENT"
                ? `Dr. ${appointment.doctor.name}`
                : appointment.patient.name}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {role === "PATIENT"
                ? appointment.doctor.specialty
                : appointment.patient.email}
            </p>
          </div>

          <span
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${s.pill}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`}
            />
            {s.label}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <circle
                cx="6"
                cy="6"
                r="5"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M6 3v3l2 2"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {isToday && (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
              Today
            </span>
          )}
        </div>

        {appointment.notes && (
          <p className="text-xs text-slate-400 italic mt-1.5 truncate">
            "{appointment.notes}"
          </p>
        )}
      </div>

      {(canCancel || canComplete) && (
        <div className="flex-shrink-0 flex flex-col items-end justify-center gap-2">
          {canComplete && (
            <button
              onClick={handleComplete}
              disabled={isPending}
              className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 disabled:opacity-60 transition-colors flex items-center gap-1.5"
            >
              {isPending ? (
                <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Complete
                </>
              )}
            </button>
          )}

          {canCancel && (
            <>
              {confirming ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirming(false)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors"
                  >
                    Keep
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isPending}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 disabled:opacity-60 transition-colors flex items-center gap-1"
                  >
                    {isPending ? (
                      <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Yes, cancel"
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleCancel}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-50 text-slate-400 border border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                >
                  Cancel
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
