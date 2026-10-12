import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore, useCurrentCustomer } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { saveSizeProfile } from "@/data/customers";
import type { AgeRange, BodyShape, FitPreference, SizeProfile } from "@/data/types";

const BODY_SHAPES: { id: BodyShape; label: string; glyph: string }[] = [
  { id: "rectangle", label: "Rectangle", glyph: "▯" },
  { id: "triangle", label: "Triangle", glyph: "▽" },
  { id: "inverted-triangle", label: "Inverted Triangle", glyph: "△" },
  { id: "oval", label: "Oval", glyph: "◯" },
  { id: "hourglass", label: "Hourglass", glyph: "⧖" },
];

const AGE_RANGES: { id: AgeRange; label: string }[] = [
  { id: "under-18", label: "Under 18" },
  { id: "18-24", label: "18–24" },
  { id: "25-34", label: "25–34" },
  { id: "35-44", label: "35–44" },
  { id: "45-plus", label: "45+" },
];

const FIT_PREFERENCES: { id: FitPreference; label: string; copy: string }[] = [
  { id: "slim", label: "Slim", copy: "Fitted through the body" },
  { id: "regular", label: "Regular", copy: "Balanced, everyday ease" },
  { id: "loose", label: "Loose", copy: "Relaxed and roomy" },
];

const STEPS = ["Measurements", "Body Shape", "Fit Preference", "Result"] as const;

export function FindMySize() {
  const [step, setStep] = useState(0);
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [ageRange, setAgeRange] = useState<AgeRange>("25-34");
  const [bodyShape, setBodyShape] = useState<BodyShape | null>(null);
  const [fitPreference, setFitPreference] = useState<FitPreference | null>(null);

  const customerId = useAuthStore((s) => s.customerId);
  const customer = useCurrentCustomer();
  const pushToast = useUiStore((s) => s.pushToast);

  const canContinueStep0 = Number(heightCm) > 0 && Number(weightKg) > 0;
  const canContinueStep1 = Boolean(bodyShape);
  const canFinish = Boolean(fitPreference);

  function finish() {
    if (!bodyShape || !fitPreference) return;
    const profile: SizeProfile = {
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      ageRange,
      bodyShape,
      fitPreference,
      savedAt: new Date().toISOString(),
    };

    if (customerId) {
      saveSizeProfile(customerId, profile);
      pushToast("Size profile saved to your account", "success");
    } else {
      // Guests still get a result this session; they just can't persist it to an account.
      pushToast("Size profile calculated — log in to save it for next time", "default");
    }
    setStep(3);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-display text-3xl">Find My Size</h1>
      <p className="mt-2 text-sm text-stone">
        A 60-second quiz to estimate your best size. This is an estimate, not an exact measurement — always check the
        product's size chart for the final call.
      </p>

      <div className="mt-6 flex gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className={`h-1 flex-1 ${i <= step ? "bg-terracotta" : "bg-stone/20"}`} />
        ))}
      </div>

      <div className="mt-10">
        {step === 0 && (
          <div className="flex flex-col gap-5">
            <h2 className="font-display text-xl">Your Measurements</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Height (cm)" type="number" min="100" max="220" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
              <Input label="Weight (kg)" type="number" min="30" max="180" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-stone">Age Range</p>
              <div className="flex flex-wrap gap-2">
                {AGE_RANGES.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setAgeRange(range.id)}
                    className={`focus-ring border px-3 py-1.5 text-xs ${ageRange === range.id ? "border-ink bg-ink text-ivory" : "border-stone/30"}`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="border border-stone/20 bg-sand/50 p-4 text-xs text-stone">
              <strong className="block text-ink">Camera measurement mode</strong>
              Scanning your body with your phone camera for precise measurements requires on-device pose detection
              that isn't available in this frontend-only preview. It will be enabled once the backend/ML service is
              connected. For now, continue with the quiz below — your photos never leave your device either way.
            </div>
            <Button variant="primary" disabled={!canContinueStep0} onClick={() => setStep(1)}>
              Continue
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-5">
            <h2 className="font-display text-xl">Which best describes your body shape?</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {BODY_SHAPES.map((shape) => (
                <button
                  key={shape.id}
                  onClick={() => setBodyShape(shape.id)}
                  className={`flex flex-col items-center gap-2 border p-5 ${bodyShape === shape.id ? "border-terracotta bg-sand/50" : "border-stone/25"}`}
                >
                  <span className="text-3xl text-stone">{shape.glyph}</span>
                  <span className="text-xs">{shape.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button variant="primary" disabled={!canContinueStep1} onClick={() => setStep(2)}>Continue</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <h2 className="font-display text-xl">How do you like your clothes to fit?</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {FIT_PREFERENCES.map((pref) => (
                <button
                  key={pref.id}
                  onClick={() => setFitPreference(pref.id)}
                  className={`flex flex-col gap-1 border p-5 text-left ${fitPreference === pref.id ? "border-terracotta bg-sand/50" : "border-stone/25"}`}
                >
                  <span className="font-medium">{pref.label}</span>
                  <span className="text-xs text-stone">{pref.copy}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button variant="accent" disabled={!canFinish} onClick={finish}>See My Result</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-3xl">✓</span>
            <h2 className="font-display text-2xl">Your size profile is saved</h2>
            <p className="max-w-sm text-sm text-stone">
              We'll now show a personal size recommendation on every product page. Remember — it's an estimate,
              so double check the size chart if you're between sizes.
            </p>
            {!customer && (
              <p className="text-xs text-stone">
                <Link to="/login" className="underline">Log in or create an account</Link> to keep this profile for next time.
              </p>
            )}
            <Link to="/catalog">
              <Button variant="primary">Shop Now</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
