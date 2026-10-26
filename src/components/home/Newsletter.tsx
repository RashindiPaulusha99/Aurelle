import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUiStore } from "@/store/uiStore";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const pushToast = useUiStore((s) => s.pushToast);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    pushToast("You're on the list — welcome to VALESTRA.", "success");
    setEmail("");
  }

  return (
    <section className="bg-sand">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-display text-2xl sm:text-3xl">
          Join the <span className="accent-italic text-terracotta">Inner Circle</span>
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink/70">
          First access to new drops, styling notes, and island-only offers.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-sm flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
          </div>
          <Button type="submit" variant="primary">
            Subscribe
          </Button>
        </form>
        <a
          href="https://t.me/"
          target="_blank"
          rel="noreferrer"
          className="focus-ring mt-4 inline-flex items-center gap-2 text-sm font-medium text-ink underline"
        >
          Join us on Telegram for drops →
        </a>
      </div>
    </section>
  );
}
