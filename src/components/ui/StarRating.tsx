interface StarRatingProps {
  rating: number;
  outOf?: number;
  className?: string;
}

export function StarRating({ rating, outOf = 5, className = "" }: StarRatingProps) {
  return (
    <span className={`inline-flex text-terracotta ${className}`} aria-label={`${rating} out of ${outOf} stars`}>
      {Array.from({ length: outOf }, (_, i) => (
        <span key={i} aria-hidden="true">
          {i < rating ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}
