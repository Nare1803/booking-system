"use client";

import { useState, useTransition } from "react";
import { getAvailableSlots, bookAppointment } from "@/actions/appointment";
import { useRouter } from "next/navigation";
import { SkeletonSlots } from "./ui/Skeletons";

interface Doctor {
  id: string;
  name: string | null;
  specialty: string | null;
}

export function BookingForm({ doctors }: { doctors: Doctor[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsLoaded, setSlotsLoaded] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  async function loadSlots(doctorId: string, date: string) {
    if (!doctorId || !date) return;
    setLoadingSlots(true);
    setSlotsLoaded(false);
    setSelectedSlot("");
    const available = await getAvailableSlots(doctorId, new Date(date));
    setSlots(available);
    setLoadingSlots(false);
    setSlotsLoaded(true);
  }

  function handleDoctorChange(doc: Doctor) {
    setSelectedDoctor(doc);
    setSlotsLoaded(false);
    if (selectedDate) loadSlots(doc.id, selectedDate);
  }

  function handleDateChange(date: string) {
    setSelectedDate(date);
    setSlotsLoaded(false);
    if (selectedDoctor) loadSlots(selectedDoctor.id, date);
  }

  function handleBook() {
    if (!selectedDoctor || !selectedDate || !selectedSlot) {
      setError("Please select a doctor, date, and time slot.");
      return;
    }
    setError("");
    const [hours, minutes] = selectedSlot.split(":").map(Number);
    const dateTime = new Date(selectedDate);
    dateTime.setHours(hours, minutes, 0, 0);

    startTransition(async () => {
      const result = await bookAppointment(selectedDoctor.id, dateTime, notes);
      if (!result.success) {
        setError(result.error);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard/appointments"), 1800);
      }
    });
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center animate-fade-up max-w-lg">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12l5 5L19 7"
              stroke="#047857"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">
          Appointment booked!
        </h3>
        <p className="text-sm text-slate-400">
          Redirecting to your appointments...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-7 max-w-lg animate-fade-up">
      {/* Step 1 — Doctor */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Step 1 — Choose Doctor
        </p>
        <div className="space-y-2">
          {doctors.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => handleDoctorChange(d)}
              className={`w-full flex items-center gap-3 rounded-xl p-3.5 text-left transition-all border ${
                selectedDoctor?.id === d.id
                  ? "bg-emerald-50 border-emerald-500"
                  : "bg-slate-50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  selectedDoctor?.id === d.id
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {d.name?.split(" ")[1]?.[0] ?? "D"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  Dr. {d.name}
                </p>
                <p className="text-xs text-slate-400">
                  {d.specialty ?? "General"}
                </p>
              </div>
              {selectedDoctor?.id === d.id && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="#047857" />
                  <path
                    d="M5 8l2 2 4-4"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 — Date */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Step 2 — Pick a Date
        </p>
        <input
          type="date"
          min={today}
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
        />
      </div>

      {/* Step 3 — Slots */}
      {selectedDoctor && selectedDate && (
        <div className="animate-fade-up">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Step 3 — Select Time Slot
          </p>
          {loadingSlots ? (
            <SkeletonSlots />
          ) : slotsLoaded && slots.length === 0 ? (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm text-center">
              No available slots on this day. Try a different date.
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2.5 rounded-xl text-xs font-semibold font-mono transition-all border ${
                    selectedSlot === slot
                      ? "bg-emerald-700 text-white border-emerald-700"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-700"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Notes (optional)
        </p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Describe symptoms or reason for visit..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="flex-shrink-0"
          >
            <circle
              cx="7"
              cy="7"
              r="6"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M7 4v3M7 9.5v.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {error}
        </div>
      )}

      <button
        onClick={handleBook}
        disabled={isPending || !selectedSlot}
        className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        {isPending ? (
          <>
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Confirming...
          </>
        ) : (
          <>
            Confirm Appointment
            {selectedSlot && (
              <span className="text-emerald-200 text-xs font-mono">
                — {selectedSlot}
              </span>
            )}
          </>
        )}
      </button>
    </div>
  );
}
