import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const FALLBACK_PDF = "/resume.pdf";

/**
 * B3 — server-side 302 straight to the PDF proxy.
 * No client component is required, so the download also works with JS
 * disabled/blocked. The backend sets `Content-Disposition: attachment`.
 */
export async function GET(request: Request) {
  const target = API_BASE
    ? `${API_BASE.replace(/\/$/, "")}/resume/pdf`
    : FALLBACK_PDF;

  return NextResponse.redirect(new URL(target, request.url), 302);
}
