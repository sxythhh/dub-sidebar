import { AnalyticsPocCardHeader } from "./AnalyticsPocCardPrimitives";
import type { AnalyticsPocSectionHeaderProps } from "./types";

export function AnalyticsPocSectionHeader({
  title,
  icon,
  infoText,
  tooltipIcon,
  helperText,
  rightSlot,
  className,
}: AnalyticsPocSectionHeaderProps) {
  return (
    <AnalyticsPocCardHeader
      className={className}
      helperText={helperText}
      icon={icon}
      rightContent={rightSlot}
      title={title}
      tooltipIcon={tooltipIcon}
      tooltipText={infoText}
    />
  );
}
