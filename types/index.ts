import { AppointmentStatus, Role } from "@prisma/client";

export type { AppointmentStatus, Role };

export interface SafeUser {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  specialty: string | null;
}

export interface AppointmentWithRelations {
  id: string;
  date: Date;
  status: AppointmentStatus;
  notes: string | null;
  doctor: SafeUser;
  patient: SafeUser;
}

export type TimeSlot = {
  time: string;       
  available: boolean;
};

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };