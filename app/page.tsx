import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-8">
      <div className="text-center max-w-xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 1v12M1 7h12"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-2xl font-bold text-slate-800">MediBook</span>
        </div>
        <h1 className="text-5xl font-bold text-slate-800 mb-4 leading-tight">
          Book your doctor,
          <br />
          <span className="text-emerald-700">in seconds.</span>
        </h1>
        <p className="text-lg text-slate-400 mb-10">
          Simple appointment booking for doctors and patients.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-emerald-700 text-white rounded-xl font-semibold hover:bg-emerald-800 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 border border-slate-200 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
