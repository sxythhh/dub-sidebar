"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { CSSProperties, useEffect, useRef, useState } from "react";

export interface NewsArticle {
  href: string;
  title: string;
  summary: string;
  image: string;
}

const OFFSET_FACTOR = 4;
const SCALE_FACTOR = 0.03;
const OPACITY_FACTOR = 0.1;

const DEMO_ARTICLES: NewsArticle[] = [
  {
    href: "#",
    title: "Introducing Smart Folders",
    summary:
      "Automatically organize your links with rule-based smart folders.",
    image: "/placeholder.png",
  },
  {
    href: "#",
    title: "Partner Payouts v2",
    summary:
      "Streamlined payouts with auto-approval, multi-currency, and instant transfers.",
    image: "/placeholder.png",
  },
  {
    href: "#",
    title: "Conversion Tracking",
    summary:
      "Track leads, signups, and purchases across every short link you create.",
    image: "/placeholder.png",
  },
];

export function News({
  articles = DEMO_ARTICLES,
  onEmpty,
}: {
  articles?: NewsArticle[];
  onEmpty?: () => void;
}) {
  const [dismissedNews, setDismissedNews] = useState<string[]>([]);

  const cards = articles.filter(({ href }) => !dismissedNews.includes(href));
  const cardCount = cards.length;

  const [showCompleted, setShowCompleted] = useState(cardCount > 0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (cardCount === 0)
      timeout = setTimeout(() => {
        setShowCompleted(false);
        onEmpty?.();
      }, 2700);
    return () => clearTimeout(timeout);
  }, [cardCount, onEmpty]);

  if (!cards.length && !showCompleted) return null;

  return (
    <div
      className="group p-3 pt-4 transition-all duration-200 hover:pt-8"
      data-active={cardCount !== 0}
    >
      <div className="relative size-full">
        {cards.toReversed().map(({ href, title, summary, image }, idx) => (
          <div
            key={href}
            className={cn(
              "absolute left-0 top-0 size-full transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              cardCount - idx > 3
                ? [
                    "opacity-0 sm:group-hover:opacity-[var(--opacity)]",
                    "sm:group-has-[*[data-dragging=true]]:opacity-[var(--opacity)]",
                  ]
                : "opacity-[var(--opacity)]",
            )}
            style={
              {
                "--opacity":
                  cardCount - (idx + 1) >= 6
                    ? 0
                    : 1 - (cardCount - (idx + 1)) * OPACITY_FACTOR,
                transform: `translateY(-${(cardCount - (idx + 1)) * OFFSET_FACTOR}%) scale(${1 - (cardCount - (idx + 1)) * SCALE_FACTOR})`,
              } as CSSProperties
            }
            aria-hidden={idx !== cardCount - 1}
          >
            <NewsCard
              title={title}
              description={summary}
              image={image}
              href={href}
              hideContent={cardCount - idx > 2}
              active={idx === cardCount - 1}
              onDismiss={() =>
                setDismissedNews([href, ...dismissedNews.slice(0, 50)])
              }
            />
          </div>
        ))}
        {/* Invisible spacer to hold height — must match real card structure */}
        <div className="pointer-events-none invisible" aria-hidden>
          <NewsCard title="Title" description="Description" />
        </div>
        {showCompleted && !cardCount && (
          <div
            className="animate-slide-up-fade absolute inset-0 flex size-full flex-col items-center justify-center gap-3 [animation-duration:1s]"
            style={{ "--offset": "10px" } as CSSProperties}
          >
            <div className="animate-fade-in absolute inset-0 rounded-lg [animation-delay:2.3s] [animation-direction:reverse] [animation-duration:0.2s]" />
            <AnimatedStars className="w-1/5 text-sidebar-text-muted" />
            <span className="animate-fade-in text-xs font-medium text-sidebar-text-muted [animation-delay:2.3s] [animation-direction:reverse] [animation-duration:0.2s]">
              You&apos;re all caught up!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function NewsCard({
  title,
  description,
  image,
  onDismiss,
  hideContent,
  href,
  active,
}: {
  title: string;
  description: string;
  image?: string;
  onDismiss?: () => void;
  hideContent?: boolean;
  href?: string;
  active?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({
    start: 0,
    delta: 0,
    startTime: 0,
    maxDelta: 0,
  });
  const animation = useRef<Animation>(undefined);
  const [dragging, setDragging] = useState(false);

  const onDragMove = (e: PointerEvent) => {
    if (!ref.current) return;
    const dx = e.clientX - drag.current.start;
    drag.current.delta = dx;
    drag.current.maxDelta = Math.max(drag.current.maxDelta, Math.abs(dx));
    ref.current.style.setProperty("--dx", dx.toString());
  };

  const dismiss = () => {
    if (!ref.current) return;
    const cardWidth = ref.current.getBoundingClientRect().width;
    const translateX = Math.sign(drag.current.delta) * cardWidth;
    animation.current = ref.current.animate(
      { opacity: 0, transform: `translateX(${translateX}px)` },
      { duration: 250, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" },
    );
    animation.current.onfinish = () => onDismiss?.();
  };

  const stopDragging = (canceled: boolean) => {
    if (!ref.current) return;
    unbindListeners();
    setDragging(false);

    const dx = drag.current.delta;
    if (Math.abs(dx) > ref.current.clientWidth / (canceled ? 2 : 3)) {
      dismiss();
      return;
    }

    animation.current = ref.current.animate(
      { transform: "translateX(0)" },
      { duration: 250, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    );
    animation.current.onfinish = () =>
      ref.current?.style.setProperty("--dx", "0");
    drag.current = { start: 0, delta: 0, startTime: 0, maxDelta: 0 };
  };

  const onDragEnd = () => stopDragging(false);
  const onDragCancel = () => stopDragging(true);

  const onPointerDown = (e: React.PointerEvent) => {
    if (!active || !ref.current || animation.current?.playState === "running")
      return;
    bindListeners();
    setDragging(true);
    drag.current.start = e.clientX;
    drag.current.startTime = Date.now();
    drag.current.delta = 0;
    ref.current.style.setProperty("--w", ref.current.clientWidth.toString());
  };

  const onClick = () => {
    if (!ref.current) return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (
      isMobile &&
      drag.current.maxDelta < ref.current.clientWidth / 10 &&
      (!drag.current.startTime || Date.now() - drag.current.startTime < 250)
    ) {
      window.open(href, "_blank");
    }
  };

  const bindListeners = () => {
    document.addEventListener("pointermove", onDragMove);
    document.addEventListener("pointerup", onDragEnd);
    document.addEventListener("pointercancel", onDragCancel);
  };

  const unbindListeners = () => {
    document.removeEventListener("pointermove", onDragMove);
    document.removeEventListener("pointerup", onDragEnd);
    document.removeEventListener("pointercancel", onDragCancel);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative cursor-pointer select-none gap-2 rounded-lg border border-card-border bg-card-bg p-3 text-[0.8125rem]",
        "translate-x-[calc(var(--dx,0)*1px)] rotate-[calc(var(--dx,0)*0.05deg)]",
        "transition-shadow data-[dragging=true]:cursor-grabbing data-[dragging=true]:shadow-[0_4px_12px_0_#0000000D]",
      )}
      style={{ touchAction: "none" }}
      data-dragging={dragging}
      onPointerDown={onPointerDown}
      onClick={onClick}
    >
      <div className={cn(hideContent && "invisible")}>
        <div className="flex flex-col gap-1">
          <span className="line-clamp-1 font-medium text-sidebar-text">
            {title}
          </span>
          <p className="line-clamp-2 h-10 leading-5 text-sidebar-text-muted">
            {description}
          </p>
        </div>
        <div className="relative mt-3 aspect-[16/9] w-full shrink-0 overflow-hidden rounded border border-card-border bg-sidebar-hover">
          {image && (
            <Image
              src={image}
              alt=""
              fill
              sizes="10vw"
              className="rounded object-cover object-center"
              draggable={false}
              unoptimized
            />
          )}
        </div>
        <div
          className={cn(
            "h-0 overflow-hidden opacity-0 transition-[height,opacity] duration-200",
            "sm:group-has-[*[data-dragging=true]]:h-7 sm:group-has-[*[data-dragging=true]]:opacity-100 sm:group-hover:group-data-[active=true]:h-7 sm:group-hover:group-data-[active=true]:opacity-100",
          )}
        >
          <div className="flex items-center justify-between pt-3 text-xs">
            <Link
              href={href || "#"}
              target="_blank"
              className="font-medium text-sidebar-text-subtle transition-colors duration-75 hover:text-sidebar-text hover:underline"
            >
              Read more
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="cursor-pointer text-sidebar-text-muted transition-colors duration-75 hover:text-sidebar-text"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnimatedStars(props: React.SVGProps<SVGSVGElement>) {
  const paths = [
    "M2.51191 8.05756L3.9974 6.04528L4.52339 8.47863L6.92511 9.24876L4.7389 10.4939L4.7377 12.9818L2.85955 11.318L0.45721 12.0858L1.48365 9.81196L0 7.79846L2.51191 8.05756Z",
    "M1.91955 17.6938L1.03009 15.7235L3.11218 16.3893L4.73952 14.9468L4.74012 17.1031L6.63533 18.1821L4.55383 18.8496L4.09784 20.9592L2.81082 19.2149L0.633758 19.4393L1.91955 17.6938Z",
    "M9.86563 22.4849L8.19142 22.3109L9.44189 21.2001L9.09244 19.5778L10.5511 20.4066L12.0098 19.5778L11.6604 21.2001L12.9114 22.3109L11.2367 22.4849L10.5511 24L9.86563 22.4849Z",
    "M18.2605 19.1795L16.9929 20.8967L16.5436 18.8196L14.4944 18.1629L16.3604 17.1L16.361 14.9768L17.9634 16.3971L20.0138 15.7415L19.1377 17.6818L20.404 19.4001L18.2605 19.1795Z",
    "M19.6131 9.80894L20.6397 12.0827L18.2373 11.315L16.3598 12.9788L16.3586 10.4909L14.1718 9.24573L16.5735 8.4756L17.0995 6.04225L18.585 8.05454L21.0969 7.79543L19.6131 9.80894Z",
    "M11.9185 3.03014L15.2675 3.37862L12.766 5.59965L13.4649 8.84511L10.5475 7.18729L7.63071 8.84511L8.32902 5.59965L5.82744 3.37862L9.17647 3.03014L10.5475 0L11.9185 3.03014Z",
  ];

  // Stagger order: big star first, then surrounding stars
  const order = [5, 0, 4, 1, 3, 2];

  return (
    <svg
      viewBox="0 0 22 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="currentColor"
          style={{
            opacity: 0,
            transformOrigin: "center",
            transformBox: "fill-box",
            animation: `star-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${order[i] * 120}ms forwards`,
          }}
        />
      ))}
    </svg>
  );
}
