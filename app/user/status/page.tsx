"use client";

import { Logo } from "@/components/Logo";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/user/status" });
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-center mb-6">
        <Logo mobileFontSize="text-4xl" desktopFontSize="text-6xl" />
      </div>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Session Status */}
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Authentication Status</h2>
          <p>Status: {status}</p>
        </div>

        {/* User Data */}
        {session?.user && (
          <div className="p-4 bg-green-100 rounded-lg">
            <h2 className="text-xl font-bold mb-2">User Data</h2>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(session.user, null, 2)}
            </pre>
          </div>
        )}

        {/* Auth Buttons */}
        <div className="flex gap-4">
          {session ? (
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? "Signing out..." : "Sign Out"}
            </button>
          ) : (
            <>
              <a
                href="/user/signin"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sign In
              </a>
              <a
                href="/user/signup"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
