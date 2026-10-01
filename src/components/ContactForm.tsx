"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Status = { state: "idle" | "sending" | "sent" } | { state: "error"; message: string };

const fields = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", required: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "business", label: "Business name", type: "text", autoComplete: "organization", required: false },
] as const;

const inputClass =
  "w-full border-0 border-b border-navy/25 bg-transparent px-0 py-3 text-lg text-navy placeholder:text-slate/60 transition-colors focus:border-steel focus:outline-none focus:ring-0";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // "Ask about <plan>" buttons in the Services section pre-fill the message.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const plan = (e.target as HTMLElement).closest<HTMLElement>("[data-plan]")?.dataset.plan;
      const message = messageRef.current;
      if (!plan || !message || message.value.trim()) return;
      message.value = `Hi Dom and Haley — I'm interested in the ${plan.toUpperCase()} plan.\n\n`;
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ state: "sending" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
      form.reset();
      setStatus({ state: "sent" });
    } catch (err) {
      setStatus({
        state: "error",
        message: err instanceof Error ? err.message : "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-8">
      <div className="grid gap-8 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.name} className={`block ${f.name === "business" ? "sm:col-span-2" : ""}`}>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">
              {f.label}
              {!f.required && <span className="font-medium normal-case tracking-normal text-slate"> (optional)</span>}
            </span>
            <input
              name={f.name}
              type={f.type}
              autoComplete={f.autoComplete}
              required={f.required}
              maxLength={200}
              className={inputClass}
            />
          </label>
        ))}
      </div>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Message</span>
        <textarea
          ref={messageRef}
          name="message"
          required
          rows={5}
          maxLength={5000}
          className={`${inputClass} resize-y`}
        />
      </label>

      {/* Honeypot — hidden from people, bots tend to fill it in. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this empty
          <input name="company_website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status.state === "sending"}
          className="group inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-steel px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-navy disabled:cursor-wait disabled:opacity-70"
        >
          {status.state === "sending" ? "Sending…" : "Send message"}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
        <p role="status" aria-live="polite" className="text-sm sm:text-right">
          {status.state === "sent" && (
            <span className="font-medium text-steel">Thanks! We&apos;ll be in touch shortly.</span>
          )}
          {status.state === "error" && <span className="font-medium text-[#A33A3A]">{status.message}</span>}
        </p>
      </div>
    </form>
  );
}
