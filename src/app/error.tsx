"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <button
        onClick={() => reset()}
        className="rounded-lg bg-foreground/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-foreground/20"
      >
        Try again
      </button>
    </div>
  );
}
