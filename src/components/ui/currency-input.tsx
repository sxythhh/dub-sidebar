"use client";

import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function CurrencyInput({
  value,
  onChange,
  placeholder = "0",
  className,
  disabled,
}: CurrencyInputProps) {
  return (
    <div
      className={cn(
        "glass-input-bg flex items-center gap-0.5 rounded-xl h-10 p-3 border border-glass-border focus-within:outline-none focus-within:ring-1 focus-within:ring-foreground",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <span className="text-sm leading-[120%] tracking-[-0.09px] text-glass-text-secondary select-none">
        $
      </span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          if (v === "" || /^\d*\.?\d*$/.test(v)) onChange(v);
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent text-sm leading-[120%] tracking-[-0.09px] text-glass-text outline-none placeholder:text-text-muted"
      />
    </div>
  );
}

export { CurrencyInput };
