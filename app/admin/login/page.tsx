"use client";

import { useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    const supabase = getSupabase();
    if (!supabase) {
      alert("System not ready. Try again.");
      return;
    }

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert("Invalid email or password");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="bg-[#111] p-8 rounded-xl w-full max-w-sm shadow-lg border border-white/10">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Admin Login 🔐
        </h1>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-black border border-white/20 rounded focus:outline-none focus:border-[#EF0107]"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-black border border-white/20 rounded focus:outline-none focus:border-[#EF0107]"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#EF0107] hover:bg-red-700 transition py-3 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>
    </div>
  );
}