"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/app/lib/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { addToast } = useToast();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already logged in
  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast("Please fill in all fields", "warning");
      return;
    }

    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          addToast("Welcome back!", "success");
          router.push("/");
        },
        onError: (error: any) => {
          addToast(error?.message || "Invalid email or password", "error");
        },
      }
    );
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1B2A4A]">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your USPA account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#0FA3B1] focus:outline-none focus:ring-1 focus:ring-[#0FA3B1]/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-10 text-sm focus:border-[#0FA3B1] focus:outline-none focus:ring-1 focus:ring-[#0FA3B1]/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-zinc-300 text-[#0FA3B1]" />
                <span className="text-sm text-zinc-600 dark:text-zinc-400">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#0FA3B1] hover:text-[#0C8793]">Forgot password?</a>
            </div>
            <Button type="submit" variant="primary" className="w-full" disabled={login.isPending}>
              {login.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-[#0FA3B1] hover:text-[#0C8793]">
              Create one here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
