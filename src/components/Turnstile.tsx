"use client";

import { Turnstile as MarsiTurnstile } from "@marsidev/react-turnstile";

interface TurnstileProps {
  onSuccess: (token: string) => void;
  onExpire?: () => void;
}

export function Turnstile({ onSuccess, onExpire }: TurnstileProps) {
  return (
    <MarsiTurnstile
      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
      onSuccess={onSuccess}
      onExpire={onExpire}
      options={{ theme: "dark" }}
    />
  );
}
