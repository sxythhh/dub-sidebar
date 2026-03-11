"use client";

const STAR_PATHS = [
  "M53.609 63.3048L79.8529 27.7541L89.1454 70.7437L131.576 84.3495L92.9529 106.347L92.9317 150.301L59.7506 120.907L17.3089 134.47L35.4428 94.2996L9.23145 58.7273L53.609 63.3048Z",
  "M43.1438 233.548L27.4298 198.738L64.2138 210.5L92.9637 185.016L92.9743 223.11L126.457 242.173L89.6832 253.967L81.6274 291.236L58.8898 260.42L20.428 264.384L43.1438 233.548Z",
  "M183.526 318.19L153.948 315.116L176.04 295.492L169.866 266.831L195.637 281.473L221.407 266.831L215.233 295.492L237.336 315.116L207.748 318.19L195.637 344.957L183.526 318.19Z",
  "M331.836 259.794L309.443 290.131L301.505 253.436L265.302 241.833L298.268 223.057L298.279 185.545L326.587 210.638L362.811 199.056L347.335 233.335L369.705 263.693L331.836 259.794Z",
  "M355.734 94.2461L373.87 134.417L331.428 120.853L298.257 150.248L298.236 106.294L259.602 84.296L302.033 70.6903L311.325 27.7006L337.569 63.2514L381.947 58.6738L355.734 94.2461Z",
  "M219.794 -25.5139L278.96 -19.3573L234.766 19.8813L247.113 77.2184L195.572 47.9299L144.042 77.2184L156.379 19.8813L112.184 -19.3573L171.351 -25.5139L195.572 -79.0469L219.794 -25.5139Z",
];

interface Props {
  id: string;
  color: string;
}

export function PodiumStars({ id, color }: Props) {
  return (
    <>
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        style={{ transform: "scale(1.6)", zIndex: 1 }}
        viewBox="-15 -103 421 472"
      >
        <g filter={`url(#${id}-blur)`} opacity="0.16">
          {STAR_PATHS.map((d) => (
            <path d={d} fill={`url(#${id}-grad)`} key={d.slice(0, 20)} />
          ))}
        </g>
        <defs>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="472"
            id={`${id}-blur`}
            width="420.72"
            x="-14.77"
            y="-103.05"
          >
            <feFlood floodOpacity="0" result="bg" />
            <feBlend in="SourceGraphic" in2="bg" result="shape" />
            <feGaussianBlur result="blur" stdDeviation="12" />
          </filter>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id={`${id}-grad`}
            x1="194.844"
            x2="195.654"
            y1="-79.047"
            y2="344.956"
          >
            <stop stopColor={color} />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        style={{ transform: "scale(1.6)", zIndex: 1 }}
        viewBox="-7 -95 405 456"
      >
        <g filter={`url(#${id}-grain)`} opacity="0.16">
          {STAR_PATHS.map((d) => (
            <path d={d} fill={`url(#${id}-grad2)`} key={d.slice(0, 20)} />
          ))}
        </g>
        <defs>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="456"
            id={`${id}-grain`}
            width="404.72"
            x="-6.77"
            y="-95.047"
          >
            <feFlood floodOpacity="0" result="bg" />
            <feBlend in="SourceGraphic" in2="bg" result="shape" />
            <feTurbulence
              baseFrequency="0.999 0.999"
              numOctaves="3"
              seed="5844"
              type="fractalNoise"
            />
            <feDisplacementMap
              height="100%"
              in="shape"
              result="displaced"
              scale="32"
              width="100%"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feMerge>
              <feMergeNode in="displaced" />
            </feMerge>
          </filter>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id={`${id}-grad2`}
            x1="194.844"
            x2="195.654"
            y1="-79.047"
            y2="344.956"
          >
            <stop stopColor={color} />
            <stop offset="1" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}
