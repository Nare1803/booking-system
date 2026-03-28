"use client";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      title="Sign out"
      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path
          d="M6 2H3a1 1 0 00-1 1v9a1 1 0 001 1h3M10 10.5l3-3-3-3M13 7.5H5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
