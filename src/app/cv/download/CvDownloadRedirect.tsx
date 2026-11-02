"use client";

import { useEffect, useState } from "react";

// Give GTM/GA a moment to register the /cv/download pageview before fetching.
const DOWNLOAD_DELAY_MS = 800;

const PDF_PROXY_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/resume/pdf`;

export function CvDownloadRedirect({ url }: { url: string }) {
  const [status, setStatus] = useState<"preparing" | "downloading">(
    "preparing",
  );

  const download = async () => {
    setStatus("downloading");
    try {
      const res = await fetch(PDF_PROXY_URL);
      if (!res.ok) throw new Error(`PDF request failed: ${res.status}`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = "resume.pdf";
      a.click();
      // Let the browser start the download before releasing the blob URL.
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch {
      // Fall back to the URL from the profile API (or the static file).
      window.location.href = url;
    }
  };

  useEffect(() => {
    // Optional explicit event for a GTM trigger, in addition to the automatic
    // page_view GA collects for this URL.
    const w = window as typeof window & {
      dataLayer?: Record<string, unknown>[];
    };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: "cv_download", cv_url: url });

    const timer = window.setTimeout(download, DOWNLOAD_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [url]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#09090B",
        color: "#A1A1AA",
        fontFamily: "var(--font-jetbrains-mono), monospace",
        fontSize: 13,
        padding: 24,
        textAlign: "center",
      }}
    >
      <p>
        {status === "preparing"
          ? "Preparing your download…"
          : "Your download should start shortly."}{" "}
        <button onClick={download} style={{ color: "#FF6B6B" }} className="hover:cursor-pointer">
          click here
        </button>{" "}
        if it doesn&apos;t.
      </p>
    </main>
  );
}
