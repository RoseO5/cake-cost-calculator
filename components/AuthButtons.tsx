"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <div className="flex items-center gap-3 mb-4">
        {session.user.image && (
          <img
            src={session.user.image}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        )}

        <div className="flex flex-col">
          <span className="font-semibold">
            {session.user.name}
          </span>

          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Sign in with Google
    </button>
  );
}
