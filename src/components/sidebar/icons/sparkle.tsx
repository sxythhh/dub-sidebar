import { SVGProps } from "react";

export function Sparkle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.8333 6.66667C8.55093 6.66667 6.66667 8.55093 6.66667 12.8333C6.66667 8.55093 4.78241 6.66667 0.5 6.66667C4.78241 6.66667 6.66667 4.78241 6.66667 0.5C6.66667 4.78241 8.55093 6.66667 12.8333 6.66667Z"
        stroke="currentColor"
        strokeOpacity="0.56"
        strokeLinejoin="round"
      />
    </svg>
  );
}
