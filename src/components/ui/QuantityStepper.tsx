interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ quantity, onChange, min = 1, max = 99 }: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center border border-stone/30">
      <button
        type="button"
        aria-label="Decrease quantity"
        className="focus-ring px-3 py-2 text-ink hover:bg-sand disabled:opacity-30"
        disabled={quantity <= min}
        onClick={() => onChange(Math.max(min, quantity - 1))}
      >
        −
      </button>
      <span className="min-w-[2.5rem] text-center text-sm">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="focus-ring px-3 py-2 text-ink hover:bg-sand disabled:opacity-30"
        disabled={quantity >= max}
        onClick={() => onChange(Math.min(max, quantity + 1))}
      >
        +
      </button>
    </div>
  );
}
