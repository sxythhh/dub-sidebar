export function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-[1px]">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="19" height="16" viewBox="0 0 19 16" fill="none">
          <defs>
            <linearGradient id={`star-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFC837" />
              <stop offset="100%" stopColor="#FF8008" />
            </linearGradient>
          </defs>
          <path
            d="M9.5 0L11.6329 6.11146H18.0534L12.7103 9.88854L14.8431 16L9.5 12.2229L4.15686 16L6.28972 9.88854L0.946574 6.11146H7.36712L9.5 0Z"
            fill={`url(#star-grad-${i})`}
          />
        </svg>
      ))}
    </div>
  );
}
