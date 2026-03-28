// "use server";

// import { prisma } from "@/lib/prisma";
// import { auth } from "@/lib/auth";
// import { ActionResult, AppointmentWithRelations } from "@/types";

// // ── Book an appointment (conflict check included) ──────────────────────────
// export async function bookAppointment(
//   doctorId: string,
//   dateTime: Date,
//   notes?: string
// ): Promise<ActionResult<{ id: string }>> {
//   const session = await auth();
//   if (!session?.user) return { success: false, error: "Not authenticated." };

//   const patientId = (session.user as any).id as string;

//   // 🔒 CONFLICT CHECK — is the doctor already booked at this exact time?
//   const conflict = await prisma.appointment.findFirst({
//     where: {
//       doctorId,
//       date: dateTime,
//       status: { in: ["PENDING", "CONFIRMED"] },
//     },
//   });

//   if (conflict) {
//     return {
//       success: false,
//       error: "This time slot is already booked. Please choose another time.",
//     };
//   }

//   // Prevent double-booking same patient with same doctor at same time
//   const patientConflict = await prisma.appointment.findFirst({
//     where: {
//       patientId,
//       date: dateTime,
//       status: { in: ["PENDING", "CONFIRMED"] },
//     },
//   });

//   if (patientConflict) {
//     return {
//       success: false,
//       error: "You already have an appointment at this time.",
//     };
//   }

//   const appointment = await prisma.appointment.create({
//     data: {
//       doctorId,
//       patientId,
//       date: dateTime,
//       notes: notes ?? null,
//       status: "PENDING",
//     },
//   });

//   return { success: true, data: { id: appointment.id } };
// }

// // ── Get available time slots for a doctor on a specific date ───────────────
// export async function getAvailableSlots(
//   doctorId: string,
//   date: Date
// ): Promise<string[]> {
//   // Working hours: 09:00 – 17:00, every 30 minutes
//   const ALL_SLOTS = [
//     "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
//     "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
//     "15:00", "15:30", "16:00", "16:30",
//   ];

//   // Build start/end of the selected day
//   const dayStart = new Date(date);
//   dayStart.setHours(0, 0, 0, 0);
//   const dayEnd = new Date(date);
//   dayEnd.setHours(23, 59, 59, 999);

//   // Fetch all booked (non-cancelled) appointments for that doctor that day
//   const booked = await prisma.appointment.findMany({
//     where: {
//       doctorId,
//       date: { gte: dayStart, lte: dayEnd },
//       status: { in: ["PENDING", "CONFIRMED"] },
//     },
//     select: { date: true },
//   });

//   // Extract booked time strings "HH:MM"
//   const bookedTimes = new Set(
//     booked.map((a) => {
//       const h = a.date.getHours().toString().padStart(2, "0");
//       const m = a.date.getMinutes().toString().padStart(2, "0");
//       return `${h}:${m}`;
//     })
//   );

//   return ALL_SLOTS.filter((slot) => !bookedTimes.has(slot));
// }

// // ── Get all appointments for the logged-in user ────────────────────────────
// export async function getMyAppointments(): Promise<AppointmentWithRelations[]> {
//   const session = await auth();
//   if (!session?.user) return [];

//   const userId = (session.user as any).id as string;
//   const role   = (session.user as any).role as string;

//   const appointments = await prisma.appointment.findMany({
//     where: role === "DOCTOR"
//       ? { doctorId: userId }
//       : { patientId: userId },
//     include: {
//       doctor:  { select: { id: true, name: true, email: true, role: true, specialty: true } },
//       patient: { select: { id: true, name: true, email: true, role: true, specialty: true } },
//     },
//     orderBy: { date: "asc" },
//   });

//   return appointments as AppointmentWithRelations[];
// }

// // ── Cancel an appointment ──────────────────────────────────────────────────
// export async function cancelAppointment(
//   appointmentId: string
// ): Promise<ActionResult> {
//   const session = await auth();
//   if (!session?.user) return { success: false, error: "Not authenticated." };

//   const userId = (session.user as any).id as string;

//   const appointment = await prisma.appointment.findUnique({
//     where: { id: appointmentId },
//   });

//   if (!appointment) return { success: false, error: "Appointment not found." };

//   if (appointment.patientId !== userId && appointment.doctorId !== userId) {
//     return { success: false, error: "Not authorized." };
//   }

//   await prisma.appointment.update({
//     where: { id: appointmentId },
//     data: { status: "CANCELLED" },
//   });

//   return { success: true, data: undefined };
// }

// // ── Get all doctors (for booking page) ────────────────────────────────────
// export async function getAllDoctors() {
//   return prisma.user.findMany({
//     where: { role: "DOCTOR" },
//     select: { id: true, name: true, email: true, specialty: true },
//     orderBy: { name: "asc" },
//   });
// }

"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ActionResult, AppointmentWithRelations } from "@/types";

export async function bookAppointment(
  doctorId: string,
  dateTime: Date,
  notes?: string,
): Promise<ActionResult<{ id: string }>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated." };

  const patientId = (session.user as any).id as string;

  const conflict = await prisma.appointment.findFirst({
    where: {
      doctorId,
      date: dateTime,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  });

  if (conflict) {
    return {
      success: false,
      error: "This time slot is already booked. Please choose another time.",
    };
  }

  const patientConflict = await prisma.appointment.findFirst({
    where: {
      patientId,
      date: dateTime,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  });

  if (patientConflict) {
    return {
      success: false,
      error: "You already have an appointment at this time.",
    };
  }

  const appointment = await prisma.appointment.create({
    data: {
      doctorId,
      patientId,
      date: dateTime,
      notes: notes ?? null,
      status: "PENDING",
    },
  });

  return { success: true, data: { id: appointment.id } };
}

export async function getAvailableSlots(
  doctorId: string,
  date: Date,
): Promise<string[]> {
  const ALL_SLOTS = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const booked = await prisma.appointment.findMany({
    where: {
      doctorId,
      date: { gte: dayStart, lte: dayEnd },
      status: { in: ["PENDING", "CONFIRMED"] },
    },
    select: { date: true },
  });

  const bookedTimes = new Set(
    booked.map((a) => {
      const h = a.date.getHours().toString().padStart(2, "0");
      const m = a.date.getMinutes().toString().padStart(2, "0");
      return `${h}:${m}`;
    }),
  );

  return ALL_SLOTS.filter((slot) => !bookedTimes.has(slot));
}

export async function getMyAppointments(): Promise<AppointmentWithRelations[]> {
  const session = await auth();
  if (!session?.user) return [];

  const userId = (session.user as any).id as string;
  const role = (session.user as any).role as string;

  const appointments = await prisma.appointment.findMany({
    where: role === "DOCTOR" ? { doctorId: userId } : { patientId: userId },
    include: {
      doctor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          specialty: true,
        },
      },
      patient: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          specialty: true,
        },
      },
    },
    orderBy: { date: "asc" },
  });

  return appointments as AppointmentWithRelations[];
}

export async function cancelAppointment(
  appointmentId: string,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated." };

  const userId = (session.user as any).id as string;

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) return { success: false, error: "Appointment not found." };

  if (appointment.patientId !== userId && appointment.doctorId !== userId) {
    return { success: false, error: "Not authorized." };
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: "CANCELLED" },
  });

  return { success: true, data: undefined };
}

// ── NEW: Doctor marks appointment as completed ─────────────────────────────
export async function completeAppointment(
  appointmentId: string,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Not authenticated." };

  const userId = (session.user as any).id as string;
  const role = (session.user as any).role as string;

  if (role !== "DOCTOR") {
    return { success: false, error: "Only doctors can complete appointments." };
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment) return { success: false, error: "Appointment not found." };

  if (appointment.doctorId !== userId) {
    return { success: false, error: "Not authorized." };
  }

  if (appointment.status === "CANCELLED") {
    return {
      success: false,
      error: "Cannot complete a cancelled appointment.",
    };
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status: "COMPLETED" },
  });

  return { success: true, data: undefined };
}

export async function getAllDoctors() {
  return prisma.user.findMany({
    where: { role: "DOCTOR" },
    select: { id: true, name: true, email: true, specialty: true },
    orderBy: { name: "asc" },
  });
}
