"use client";

import { useState } from "react";
import Image from "next/image";
import { loginAdmin } from "@/lib/adminApi";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
  FiShield,
} from "react-icons/fi";

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both Email and Password.");
      return;
    }

    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await loginAdmin(email.trim(), password);
      if (res.success) {
        setSuccessMsg("Authentication successful! Redirecting...");
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(res.user, res.token);
        }, 800);
      } else {
        setError(res.message || "Invalid credentials or unauthorized access.");
      }
    } catch (_err) {
      setError("An unexpected error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-amber-200/80 rounded-2xl shadow-xl shadow-slate-200/50 p-8 sm:p-10 relative z-10 transition-all duration-300">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative w-44 h-16 mb-8 flex items-center justify-center">
            <Image
              src="/logo1.png"
              alt="Vinayak Jewellers Logo"
              width={180}
              height={70}
              className="object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.25)]"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-wide">
            Welcome Back
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in with authorized admin credentials
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-shake">
            <FiAlertCircle className="text-red-500 text-lg shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2.5">
            <FiCheckCircle className="text-emerald-500 text-lg shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiMail className="text-base" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vinayakjewellers.com"
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiLock className="text-base" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                disabled={loading}
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <FiEyeOff className="text-base" />
                ) : (
                  <FiEye className="text-base" />
                )}
              </button>
            </div>
          </div>

          {/* Remember me & Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                defaultChecked
                className="rounded bg-slate-100 border-slate-300 text-amber-600 focus:ring-0 focus:ring-offset-0"
              />
              <span>Remember session</span>
            </label>
            <span className="text-amber-700 font-medium text-[11px]">Secure SSL 256-bit</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c59b27] to-[#b89028] text-white font-semibold text-sm tracking-wide shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/35 hover:brightness-105 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In To Admin</span>
                <FiArrowRight className="text-base" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-400">
            Vinayak Jewellers Admin System &bull; Version 2.0
          </p>
        </div>
      </div>
    </div>
  );
}
