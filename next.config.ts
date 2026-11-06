import type { NextConfig } from "next";
import path from "path";

const apiOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_BASE_URL ?? "").origin;
  } catch {
    return "";
  }
})();

// V2/V3 — enforced clickjacking protection + a report-only CSP that can be
// tightened over time without breaking Turnstile/GTM/Cloudinary today.
const contentSecurityPolicyReportOnly = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://www.google-analytics.com",
  "font-src 'self' data:",
  "frame-src https://challenges.cloudflare.com https://www.googletagmanager.com",
  `connect-src 'self' ${apiOrigin} https://www.google-analytics.com https://region1.google-analytics.com https://challenges.cloudflare.com`.replace(
    /\s+/g,
    " ",
  ),
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  // Block framing entirely; CSP frame-ancestors is the modern equivalent.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  {
    key: "Content-Security-Policy-Report-Only",
    value: contentSecurityPolicyReportOnly,
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // V4 — don't advertise Next.js.
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Keep the admin surface out of search results even if robots.txt is ignored.
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  webpack(config, options) {
    // Set up alias to match the `tsconfig.json` paths
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname), // This allows `@/` to map to the root directory
    };

    return config;
  },
};

export default nextConfig;
