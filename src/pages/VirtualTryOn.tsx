import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function VirtualTryOn() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
      <h1 className="font-display text-3xl">Virtual Try-On</h1>
      <p className="mx-auto mt-3 max-w-lg text-sm text-stone">
        See garments on yourself before you buy. This feature ships in two tiers once the backend and ML services are
        connected — here's what's coming.
      </p>

      <div className="relative mx-auto mt-10 flex aspect-[4/3] max-w-md items-center justify-center border border-stone/25 bg-sand/40">
        <div className="absolute left-4 top-4">
          <Badge tone="neutral">Coming Soon</Badge>
        </div>
        <div className="flex flex-col items-center gap-3 text-stone">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="18" height="13" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="12" cy="10.5" r="3" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <p className="text-xs">Camera preview disabled in this preview build</p>
        </div>
      </div>

      <div className="mx-auto mt-10 grid gap-6 text-left sm:grid-cols-2">
        <div className="border border-stone/15 p-5">
          <h2 className="font-display text-lg">Tier 1 — Free AR Overlay</h2>
          <p className="mt-2 text-sm text-stone">
            Live camera preview anchors a transparent garment image to your shoulders and hips using on-device pose
            detection. Works for tops and outerwear; entirely free and processed on your device.
          </p>
        </div>
        <div className="border border-stone/15 p-5">
          <h2 className="font-display text-lg">Tier 2 — AI Photo Try-On</h2>
          <p className="mt-2 text-sm text-stone">
            Upload a full-body photo and an AI model generates a realistic try-on render. This tier calls a paid
            third-party provider, so it will only go live after we've reviewed providers and pricing together.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-lg border border-stone/20 bg-sand/30 p-4 text-left text-xs text-stone">
        <strong className="block text-ink">Privacy note</strong>
        When this launches, Tier 1 photos never leave your device — all processing happens in your browser. Tier 2
        photos are uploaded only to generate your render and are automatically deleted within 24 hours.
      </div>

      <Link to="/find-my-size" className="mt-10 inline-block">
        <Button variant="outline">Try Find My Size instead</Button>
      </Link>
    </div>
  );
}
