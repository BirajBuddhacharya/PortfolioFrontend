"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { useSubmitContact } from "../../../services/contactService";
import type { ContactLink } from "../../../types/contact";
import { Turnstile } from "../../../components/Turnstile";
import { apiErrorMessage } from "../../../lib/apiClient";

type FieldName = "name" | "email" | "subject" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className="text-[11.5px] leading-[1.5]"
      style={{ color: "#FF867F", margin: "2px 0 0" }}
    >
      {message}
    </p>
  );
}

export function ContactView({ links }: { links: ContactLink[] }) {
  const { mutate: submit, isPending } = useSubmitContact();
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    turnstileToken: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [statusMessage, setStatusMessage] = useState("");
  const [formError, setFormError] = useState("");

  const ignoreTurnstile = process.env.NEXT_PUBLIC_IGNORE_TURNSTILE === "true";

  const setField = (field: FieldName, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the field error as soon as the visitor starts correcting it.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};

    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) {
      next.email = "Please enter your email address.";
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (!form.subject.trim()) next.subject = "Please add a subject.";
    if (!form.message.trim()) next.message = "Please write a message.";

    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");
    setFormError("");

    const nextErrors = validate();
    setErrors(nextErrors);
    const firstInvalid = (["name", "email", "subject", "message"] as const).find(
      (field) => nextErrors[field],
    );
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    if (!ignoreTurnstile && !form.turnstileToken) {
      setFormError("Please complete the captcha before sending.");
      return;
    }

    submit(
      {
        ...form,
        turnstileToken: ignoreTurnstile ? "xyz" : form.turnstileToken,
      },
      {
        onSuccess: () => {
          const message = "Message sent! I'll get back to you soon.";
          setStatusMessage(message);
          toast.success(message);
          setForm({
            name: "",
            email: "",
            subject: "",
            message: "",
            turnstileToken: "",
          });
          setErrors({});
          turnstileRef.current?.reset();
        },
        onError: (error) => {
          const response = (
            error as unknown as {
              response?: {
                status?: number;
                headers?: Record<string, string>;
              };
            }
          ).response;
          const status = response?.status;

          if (status === 429) {
            const retryAfter = Number(response?.headers?.["retry-after"]);
            const wait =
              Number.isFinite(retryAfter) && retryAfter > 0
                ? ` Please try again in about ${Math.max(
                    1,
                    Math.ceil(retryAfter / 60),
                  )} minute${retryAfter > 60 ? "s" : ""}.`
                : " Please try again shortly.";
            setFormError(`Too many messages have been sent from this connection.${wait}`);
            return;
          }

          setFormError(apiErrorMessage(error));
        },
      },
    );
  };

  const inputStyle: React.CSSProperties = {
    background: "#131317",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "13px 15px",
    color: "#EDEDEF",
    fontFamily: "var(--font-sora), system-ui, sans-serif",
    fontSize: 15,
    outline: "none",
    width: "100%",
    transition: "border-color 0.2s",
  };

  const invalidStyle: React.CSSProperties = {
    borderColor: "rgba(255,107,107,0.65)",
  };

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = "#FF6B6B";
  };

  const blur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    invalid: boolean,
  ) => {
    e.target.style.borderColor = invalid
      ? "rgba(255,107,107,0.65)"
      : "rgba(255,255,255,0.1)";
  };

  return (
    <div
      style={{
        background: "#09090B",
        color: "#EDEDEF",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <main className="relative z-10 max-w-[1080px] mx-auto px-7 pt-[160px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="text-[12px] uppercase tracking-[0.14em] mb-4"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "#FF6B6B",
            }}
          >
            contact
          </div>
          <h1
            className="mb-[44px]"
            style={{
              fontFamily: "var(--font-space-grotesk), sans-serif",
              fontSize: "clamp(38px, 6.4vw, 78px)",
              lineHeight: 1,
              letterSpacing: "-0.04em",
              fontWeight: 600,
              color: "#EDEDEF",
              margin: "0 0 44px",
            }}
          >
            Let&apos;s connect<span style={{ color: "#FF6B6B" }}>.</span>
          </h1>
        </motion.div>

        <div
          className="grid gap-[44px] items-start pb-5"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-[14px]"
          >
            {links.map((c, i) => (
              <a
                key={i}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 p-[20px] px-[22px] border border-white/[0.09] rounded-[14px] transition-all duration-200"
                style={{ background: "#0C0C0F", color: "inherit" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,107,107,0.45)";
                  el.style.background = "#111116";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.09)";
                  el.style.background = "#0C0C0F";
                }}
              >
                <div>
                  <div
                    className="text-[11px] uppercase tracking-[0.1em] mb-[7px]"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      color: "#6E6E78",
                    }}
                  >
                    {c.label}
                  </div>
                  <div className="text-[15.5px]" style={{ color: "#EDEDEF" }}>
                    {c.value}
                  </div>
                </div>
                <span style={{ color: "#FF6B6B" }}>↗</span>
              </a>
            ))}
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            onSubmit={handleSubmit}
            noValidate
            aria-busy={isPending}
            className="flex flex-col gap-[18px] border border-white/[0.09] rounded-[18px] p-[30px]"
            style={{ background: "#0C0C0F" }}
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-name"
                className="text-[11px] uppercase tracking-[0.1em]"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: "#8A8A93",
                }}
              >
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                style={{ ...inputStyle, ...(errors.name ? invalidStyle : {}) }}
                onFocus={focus}
                onBlur={(e) => blur(e, Boolean(errors.name))}
              />
              <FieldError id="contact-name-error" message={errors.name} />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-email"
                className="text-[11px] uppercase tracking-[0.1em]"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: "#8A8A93",
                }}
              >
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                style={{ ...inputStyle, ...(errors.email ? invalidStyle : {}) }}
                onFocus={focus}
                onBlur={(e) => blur(e, Boolean(errors.email))}
              />
              <FieldError id="contact-email-error" message={errors.email} />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-subject"
                className="text-[11px] uppercase tracking-[0.1em]"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: "#8A8A93",
                }}
              >
                Subject
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                autoComplete="off"
                required
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={
                  errors.subject ? "contact-subject-error" : undefined
                }
                placeholder="What is this about?"
                value={form.subject}
                onChange={(e) => setField("subject", e.target.value)}
                style={{ ...inputStyle, ...(errors.subject ? invalidStyle : {}) }}
                onFocus={focus}
                onBlur={(e) => blur(e, Boolean(errors.subject))}
              />
              <FieldError id="contact-subject-error" message={errors.subject} />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="contact-message"
                className="text-[11px] uppercase tracking-[0.1em]"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: "#8A8A93",
                }}
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                autoComplete="off"
                required
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message ? "contact-message-error" : undefined
                }
                placeholder="What are you building?"
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                style={{
                  ...inputStyle,
                  ...(errors.message ? invalidStyle : {}),
                  resize: "vertical",
                }}
                onFocus={focus}
                onBlur={(e) => blur(e, Boolean(errors.message))}
              />
              <FieldError id="contact-message-error" message={errors.message} />
            </div>

            {!ignoreTurnstile && (
              <Turnstile
                ref={turnstileRef}
                onSuccess={(token) =>
                  setForm((prev) => ({ ...prev, turnstileToken: token }))
                }
                onExpire={() =>
                  setForm((prev) => ({ ...prev, turnstileToken: "" }))
                }
              />
            )}

            {(statusMessage || formError) && (
              <p
                role={formError ? "alert" : "status"}
                aria-live="polite"
                className="text-[12.5px] leading-[1.55] m-0"
                style={{ color: formError ? "#FF867F" : "#8FE3A8" }}
              >
                {formError || statusMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-1 py-[14px] border-none rounded-[11px] text-[13px] font-semibold cursor-pointer transition-colors duration-200 disabled:opacity-60"
              style={{
                background: "#FF6B6B",
                color: "#12080A",
                fontFamily: "var(--font-jetbrains-mono), monospace",
              }}
              onMouseEnter={(e) => {
                if (!isPending)
                  (e.target as HTMLElement).style.background = "#FF867F";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = "#FF6B6B";
              }}
            >
              {isPending ? "Sending…" : "Send message"}
            </button>
          </motion.form>
        </div>
      </main>
    </div>
  );
}
