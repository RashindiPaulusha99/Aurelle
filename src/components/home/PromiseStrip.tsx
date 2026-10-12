const PROMISES = [
  { label: "Island-wide delivery", icon: "🚚" },
  { label: "Easy 14-day returns", icon: "↩" },
  { label: "Secure payments — PayHere, card, COD", icon: "🔒" },
];

export function PromiseStrip() {
  return (
    <section className="border-y border-stone/15 bg-ivory">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
        {PROMISES.map((p) => (
          <div key={p.label} className="flex items-center justify-center gap-3 text-center text-sm">
            <span aria-hidden="true">{p.icon}</span>
            <span>{p.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
