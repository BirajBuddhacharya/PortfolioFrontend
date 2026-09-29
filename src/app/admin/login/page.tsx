"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useAdminLogin } from "../../../services/authService";
import { setToken } from "../../../lib/authToken";

const BG = "#09090B";
const CARD = "#111115";
const BORDER = "rgba(255,255,255,0.07)";
const ACCENT = "#FF6B6B";
const MUTED = "#6E6E78";
const TEXT = "#EDEDEF";

const mono = "var(--font-jetbrains-mono), monospace";
const heading = "var(--font-space-grotesk), sans-serif";
const body = "var(--font-sora), system-ui, sans-serif";

const GOOGLE_AUTH_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;

export default function AdminLoginPage() {
  const router = useRouter();
  const { mutate: login, isPending } = useAdminLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      setToken(token);
      window.history.replaceState({}, "", "/admin/login");
      router.replace("/admin");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    login(
      { email: email.trim(), password },
      {
        onSuccess: () => {
          router.replace("/admin");
          router.refresh();
        },
      },
    );
  };

  const inputStyle: React.CSSProperties = {
    background: "#131317",
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    padding: "12px 15px",
    color: TEXT,
    fontFamily: body,
    fontSize: 14,
    outline: "none",
    width: "100%",
    transition: "border-color 0.2s",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ background: BG, color: TEXT, fontFamily: body }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          width: 1000,
          height: 1000,
          top: -500,
          right: -400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,107,107,0.16) 0%, rgba(255,107,107,0) 65%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
        className="w-full max-w-[380px] relative z-10"
      >
        <div className="flex items-center gap-3 mb-7">
          <div
            className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
            style={{
              background: `${ACCENT}18`,
              border: `1px solid ${ACCENT}35`,
              color: ACCENT,
            }}
          >
            <Lock size={15} strokeWidth={1.8} />
          </div>
          <div>
            <div
              className="text-[19px] font-semibold leading-tight"
              style={{ fontFamily: heading, letterSpacing: "-0.025em" }}
            >
              Admin sign in
            </div>
            <div
              className="text-[11.5px]"
              style={{ fontFamily: mono, color: MUTED }}
            >
              biraj / admin
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-[18px] border p-7"
          style={{ background: CARD, borderColor: BORDER }}
        >
          <div className="flex flex-col gap-2">
            <label
              className="text-[11px] uppercase tracking-[0.1em]"
              style={{ fontFamily: mono, color: MUTED }}
            >
              Email
            </label>
            <input
              type="email"
              autoComplete="username"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = `${ACCENT}55`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = BORDER;
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-[11px] uppercase tracking-[0.1em]"
              style={{ fontFamily: mono, color: MUTED }}
            >
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = `${ACCENT}55`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = BORDER;
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-1 py-[12px] rounded-[11px] text-[13px] font-semibold cursor-pointer transition-opacity duration-150 disabled:opacity-60"
            style={{
              fontFamily: mono,
              color: "#12080A",
              background: ACCENT,
              border: "none",
            }}
          >
            {isPending ? "Signing in…" : "Sign in"}
          </button>

          <div
            className="flex items-center gap-3 my-1"
            style={{ color: MUTED }}
          >
            <div style={{ flex: 1, height: 1, background: BORDER }} />
            <span style={{ fontFamily: mono, fontSize: 11 }}>or</span>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>

          <a
            href={GOOGLE_AUTH_URL}
            className="flex items-center justify-center gap-3 py-[11px] rounded-[11px] text-[13px] font-medium transition-opacity duration-150"
            style={{
              fontFamily: mono,
              color: TEXT,
              background: "#1A1A1F",
              border: `1px solid ${BORDER}`,
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = BORDER;
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </a>
        </form>

        <Link
          href="/"
          className="block mt-5 text-[12px] transition-colors duration-150"
          style={{ fontFamily: mono, color: MUTED, textDecoration: "none" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = TEXT;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = MUTED;
          }}
        >
          ← back to site
        </Link>
      </motion.div>
    </div>
  );
}
