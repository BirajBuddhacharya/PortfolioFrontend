"use client";

import { forwardRef } from "react";
import { Turnstile as MarsiTurnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

interface TurnstileProps {
  onSuccess: (token: string) => void;
  onExpire?: () => void;
}

export const Turnstile = forwardRef<TurnstileInstance, TurnstileProps>(
  function Turnstile({ onSuccess, onExpire }, ref) {
    return (
      <MarsiTurnstile
        ref={ref}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={onSuccess}
        onExpire={onExpire}
        options={{ theme: "dark" }}
      />
    );
  }
);
