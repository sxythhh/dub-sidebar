import { cn } from "@/lib/utils";

interface AnalyticsPocBestTimePillProps {
  label: string;
  className?: string;
}

function parseBestTimeLabel(label: string) {
  const normalizedLabel = label.trim();

  if (!normalizedLabel) {
    return {
      prefix: "Best",
      value: "",
    };
  }

  const [firstToken, ...remainingTokens] = normalizedLabel.split(/\s+/);
  if (!remainingTokens.length) {
    return {
      prefix: "",
      value: normalizedLabel,
    };
  }

  return {
    prefix: firstToken,
    value: remainingTokens.join(" "),
  };
}

export function AnalyticsPocBestTimePill({
  label,
  className,
}: AnalyticsPocBestTimePillProps) {
  const { prefix, value } = parseBestTimeLabel(label);
  const resolvedValue = value || label;

  return (
    <span
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full border border-[var(--ap-pill-border)] bg-[var(--ap-pill-bg)] px-3",
        className,
      )}
    >
      {prefix ? (
        <span className="font-inter text-[14px] font-normal leading-[1.2] tracking-[-0.09px] text-[var(--ap-text-secondary)]">
          {prefix}
        </span>
      ) : null}
      <span className="font-inter text-[14px] font-medium leading-[1.2] tracking-[-0.09px] text-[var(--ap-text)]">
        {resolvedValue}
      </span>
    </span>
  );
}
