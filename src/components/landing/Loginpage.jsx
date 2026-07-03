"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { supabase } from "../../lib/supabaseClient";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import Link from "next/link";


const Loginpage = () => {
  const router = useRouter();
  const [nextPath, setNextPath] = useState('/onboarding');
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextParam = params.get('next');
    if (nextParam) {
      setNextPath(nextParam);
    }
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      router.push(nextPath);
    }
  }

  const Provider = [
    {
      name: "Google",
      icon: "@/assets/google.svg",
      label: "Continue with Google",
    },
  ];

  const handleProviderLogin = async (provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <section className="flex items-center justify-center px-6 py-20">
        <Card className="w-full max-w-md">
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-white">
                WELCOME<span className="text-[#c4f135]"> BACK.</span>
              </h1>
              <p className="text-[#8b8d98] text-sm">
                Log in to continue your training.
              </p>
            </div>
            

            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-400 text-sm rounded-lg px-4 py-3 text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="font-mono text-xs uppercase tracking-wider text-[#8b8d98]"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#1a1b23] border border-[#2a2d37] rounded-lg px-4 py-3 text-white placeholder-[#8b8d98]/50 focus:outline-none focus:border-[#c4f135] transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="font-mono text-xs uppercase tracking-wider text-[#8b8d98]"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#1a1b23] border border-[#2a2d37] rounded-lg px-4 py-3 text-white placeholder-[#8b8d98]/50 focus:outline-none focus:border-[#c4f135] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
              arrow
            >
              Log In
            </Button>

            <p className="text-center text-[#8b8d98] text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#c4f135] hover:underline">
                Sign up
              </Link>
            </p>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px w-full bg-[#2a2d37]" />
              <span className="text-[#8b8d98] text-sm">OR</span>
              <div className="h-px w-full bg-[#2a2d37]" />
            </div>

            <div className="flex flex-col gap-4">
              {Provider.map((provider) => (
                <Button
                  key={provider.name}
                  variant="secondary"
                  className="w-full justify-center gap-2"
                  onClick={() => handleProviderLogin(provider.name)}
                >
                  <img
                    src={provider.icon}
                    alt={provider.name}
                    className="w-5 h-5"
                  />
                  {provider.label}
                </Button>
              ))}
            </div>
          </form>
        </Card>
      </section>
    </div>
  );
};

export default Loginpage;
