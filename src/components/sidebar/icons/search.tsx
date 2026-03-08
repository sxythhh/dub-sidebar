import { SVGProps } from "react";

export function Search({
  "data-hovered": _,
  ...rest
}: { "data-hovered"?: boolean } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <path
        d="M11.3333 11.3327L8.69998 8.69934M9.99999 5.33268C9.99999 7.91001 7.91065 9.99935 5.33332 9.99935C2.75599 9.99935 0.666656 7.91001 0.666656 5.33268C0.666656 2.75535 2.75599 0.666016 5.33332 0.666016C7.91065 0.666016 9.99999 2.75535 9.99999 5.33268Z"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="1.33333"
        strokeLinecap="round"
      />
    </svg>
  );
}
