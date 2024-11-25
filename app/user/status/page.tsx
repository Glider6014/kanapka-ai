"use client";

import { Logo } from "@/components/Logo";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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
        <Logo className="text-4xl md:text-6xl" />
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
            <Button
              onClick={handleSignOut}
              disabled={loading}
              variant="destructive"
            >
              {loading ? "Signing out..." : "Sign Out"}
            </Button>
          ) : (
            <>
              <Button asChild variant="default">
                <a href="/user/signin">Sign In</a>
              </Button>
              <Button asChild variant="default">
                <a href="/user/signup">Sign Up</a>
              </Button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
