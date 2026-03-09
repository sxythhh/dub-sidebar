import { SVGProps } from "react";

export function PieChart({
  "data-hovered": _,
  ...rest
}: { "data-hovered"?: boolean } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M13.1444 8.21619C13.2679 7.70895 13.3333 7.17899 13.3333 6.63375C13.3333 3.17685 10.7022 0.334483 7.33333 5.10075e-09V6.1623L13.1444 8.21619Z"
        fill="currentColor"

      />
      <path
        d="M12.7001 9.47332L6.44451 7.26231C6.17811 7.16815 6 6.9163 6 6.63375V0C2.63112 0.334483 0 3.17685 0 6.63375C0 10.3156 2.98477 13.3004 6.66667 13.3004C9.333 13.3004 11.6337 11.7351 12.7001 9.47332Z"
        fill="currentColor"

      />
    </svg>
  );
}
