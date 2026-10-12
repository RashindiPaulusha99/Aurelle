type Tone = "new" | "sale" | "low-stock" | "neutral" | "status";

interface BadgeProps {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}

const TONE_CLASS: Record<Tone, string> = {
  new: "bg-ink text-ivory",
  sale: "bg-terracotta text-ivory",
  "low-stock": "bg-transparent text-terracotta border border-terracotta",
  neutral: "bg-sand text-ink",
  status: "bg-stone/20 text-ink",
};

export function Badge({ tone = "neutral", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-ui)] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${TONE_CLASS[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
