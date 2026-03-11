import { SVGProps, useEffect, useRef } from "react";

export function Compass({
  "data-hovered": hovered,
  ...rest
}: { "data-hovered"?: boolean } & SVGProps<SVGSVGElement>) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current || !hovered) return;
    ref.current.animate(
      [
        { transform: "rotate(0deg)" },
        { transform: "rotate(20deg)" },
        { transform: "rotate(-20deg)" },
        { transform: "rotate(0deg)" },
      ],
      { duration: 400, easing: "ease-in-out" },
    );
  }, [hovered]);

  return (
    <svg
      ref={ref}
      width="16"
      height="16"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transformOrigin: "center" }}
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.0273 0.0529348C12.0331 -0.234437 12.963 0.695457 12.6756 1.70126L10.5421 9.16853C10.3523 9.83294 9.83294 10.3523 9.16853 10.5421L1.70126 12.6756C0.695462 12.963 -0.234438 12.0331 0.0529349 11.0273L2.18644 3.56005C2.37627 2.89563 2.89563 2.37627 3.56004 2.18644L11.0273 0.0529348ZM4.69761 6.36426C4.69761 5.44378 5.4438 4.69759 6.36428 4.69759C7.28475 4.69759 8.03094 5.44378 8.03094 6.36426C8.03094 7.28473 7.28475 8.03092 6.36428 8.03092C5.4438 8.03092 4.69761 7.28473 4.69761 6.36426Z"
        fill="currentColor"
      />
    </svg>
  );
}
