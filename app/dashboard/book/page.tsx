import { getAllDoctors } from "@/actions/appointment";
import { BookingForm } from "@/app/compoents/BookingForm";
import { SkeletonBookForm } from "@/app/compoents/ui/Skeletons";
import { Suspense } from "react";

async function BookFormLoader() {
  const doctors = await getAllDoctors();
  return <BookingForm doctors={doctors} />;
}

export default function BookPage() {
  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">
        Book Appointment
      </h1>
      <p className="text-sm text-slate-400 mb-8">
        Choose a specialist and an available time slot.
      </p>
      <Suspense fallback={<SkeletonBookForm />}>
        <BookFormLoader />
      </Suspense>
    </div>
  );
}
