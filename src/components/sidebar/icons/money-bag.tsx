import { SVGProps, useEffect, useRef } from "react";

export function MoneyBag({
  "data-hovered": hovered,
  ...rest
}: { "data-hovered"?: boolean } & SVGProps<SVGSVGElement>) {
  const bagRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!bagRef.current || !hovered) return;
    bagRef.current.animate(
      [
        { transform: "scaleX(1) scaleY(1)" },
        { transform: "scaleX(1.15) scaleY(0.88)" },
        { transform: "scaleX(0.92) scaleY(1.1)" },
        { transform: "scaleX(1.05) scaleY(0.95)" },
        { transform: "scaleX(1) scaleY(1)" },
      ],
      { duration: 400, easing: "ease-in-out" },
    );
  }, [hovered]);

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 12 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g
        ref={bagRef}
        className="[transform-box:fill-box] [transform-origin:center]"
      >
        <path
          d="M0.567487 11.3535C0.19617 10.7936 5.6031e-06 10.1187 0 9.33334C0.300044 7.23302 1.68041 5.67287 3.16866 4.16667H8.90142C10.2937 5.64371 11.6971 7.21336 12 9.33333C12 10.1187 11.8038 10.7936 11.4325 11.3535C11.0638 11.9095 10.5486 12.3127 9.96957 12.6017C8.83122 13.1699 7.37236 13.3333 6 13.3333C4.62764 13.3333 3.16878 13.1699 2.03044 12.6017C1.45144 12.3127 0.936236 11.9095 0.567487 11.3535Z"
          fill="currentColor"

        />
        <path
          d="M8.60073 2.08518C8.88036 1.33948 8.5969 0.472331 7.83294 0.247323C7.2636 0.0796353 6.65171 0 6 0C5.34829 0 4.7364 0.0796353 4.16706 0.247323C3.4031 0.472331 3.11964 1.33948 3.39927 2.08518L3.8015 3.15777L3.77778 3.16667H8.22222L8.1985 3.15777L8.60073 2.08518Z"
          fill="currentColor"

        />
      </g>
    </svg>
  );
}
