"use client";

import { useState, useMemo } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCheck,
  IconArrowRight,
} from "@tabler/icons-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  isWeekend,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
} from "date-fns";

type Step = "info" | "calendar" | "time" | "confirmed";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MORNING_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
];
const AFTERNOON_SLOTS = [
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
];

const EASE = "cubic-bezier(0.32, 0.72, 0, 1)";

export function AgencyBookingWidget() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [step, setStep] = useState<Step>("info");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const today = useMemo(() => startOfDay(new Date()), []);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  const handleDateSelect = (day: Date) => {
    if (
      isBefore(day, today) ||
      isWeekend(day) ||
      !isSameMonth(day, currentMonth)
    )
      return;
    setSelectedDate(day);
    setSelectedTime(null);
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setSelectedDate(null);
    setSelectedTime(null);
    setStep("info");
  };

  const canContinueInfo =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.trim().length > 0 &&
    agreed;

  const showInfo = step === "info";
  const showCalendar = step === "calendar";
  const showTime = step === "time";
  const showConfirmed = step === "confirmed";

  const buttonLabel = showInfo
    ? "Continue"
    : showCalendar
      ? "Continue"
      : showTime
        ? "Confirm"
        : null;

  const buttonDisabled = showInfo
    ? !canContinueInfo
    : showCalendar
      ? !selectedDate
      : showTime
        ? !selectedTime
        : false;

  const handleButtonClick = () => {
    if (showInfo) setStep("calendar");
    else if (showCalendar) setStep("time");
    else if (showTime) setStep("confirmed");
  };

  const handleBack = () => {
    if (showCalendar) setStep("info");
    else if (showTime) setStep("calendar");
  };

  return (
    <div className="relative flex w-full flex-col overflow-hidden lg:max-w-[435px]">
      <div className="relative min-h-0 flex-1">
        {/* Info step */}
        <div
          style={{
            opacity: showInfo ? 1 : 0,
            transform: showInfo ? "translateX(0)" : "translateX(-12px)",
            transition: `opacity 250ms ${EASE}, transform 250ms ${EASE}`,
            pointerEvents: showInfo ? "auto" : "none",
            height: showInfo ? "auto" : 0,
            overflow: showInfo ? "visible" : "hidden",
          }}
          aria-hidden={!showInfo}
        >
          <h3 className="mb-5 text-[17px] font-semibold tracking-[-0.36px] text-black">
            Enter your details
          </h3>

          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-[#69527A]/50">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane"
                className="h-10 w-full rounded-lg border border-[rgba(87,62,105,0.13)] bg-white px-3.5 text-[14px] text-[#483953] outline-none transition-colors placeholder:text-[#483953]/40"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-[#69527A]/50">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="h-10 w-full rounded-lg border border-[rgba(87,62,105,0.13)] bg-white px-3.5 text-[14px] text-[#483953] outline-none transition-colors placeholder:text-[#483953]/40"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-[#69527A]/50">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="h-10 w-full rounded-lg border border-[rgba(87,62,105,0.13)] bg-white px-3.5 text-[14px] text-[#483953] outline-none transition-colors placeholder:text-[#483953]/40"
              />
            </div>
          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-2.5">
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              className={[
                "mt-[1px] flex size-[18px] shrink-0 items-center justify-center rounded-[5px] transition-colors",
                agreed
                  ? "bg-black"
                  : "border border-[rgba(87,62,105,0.13)] bg-white",
              ].join(" ")}
            >
              {agreed && (
                <IconCheck size={11} className="text-white" strokeWidth={3} />
              )}
            </button>
            <span className="text-[12px] leading-[17px] text-[#545454]/70">
              By proceeding, you agree to Content Reward&apos;s{" "}
              <span className="font-medium text-[#483953]">Terms</span> and{" "}
              <span className="font-medium text-[#483953]">Brand Policy</span>
            </span>
          </label>
        </div>

        {/* Calendar step */}
        <div
          style={{
            opacity: showCalendar ? 1 : 0,
            transform: showCalendar
              ? "translateX(0)"
              : showInfo
                ? "translateX(12px)"
                : "translateX(-12px)",
            transition: `opacity 250ms ${EASE}, transform 250ms ${EASE}`,
            pointerEvents: showCalendar ? "auto" : "none",
            position: showCalendar ? "relative" : "absolute",
            top: showCalendar ? undefined : 0,
            left: showCalendar ? undefined : 0,
            right: showCalendar ? undefined : 0,
          }}
          aria-hidden={!showCalendar}
        >
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-black/5 active:scale-[0.98]"
              >
                <IconChevronLeft size={18} className="text-black" />
              </button>
              <h3 className="text-[17px] font-semibold tracking-[-0.36px] text-black">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-black/5 active:scale-[0.98]"
              >
                <IconChevronLeft size={16} className="text-black/40" />
              </button>
              <button
                type="button"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-black/5 active:scale-[0.98]"
              >
                <IconChevronRight size={16} className="text-black/40" />
              </button>
            </div>
          </div>

          <div className="mb-1 grid grid-cols-7">
            {WEEKDAYS.map((d) => (
              <div
                key={d}
                className="py-1 text-center text-[12px] font-medium text-[#69527A]/50"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-0.5">
            {calendarDays.map((day) => {
              const inMonth = isSameMonth(day, currentMonth);
              const past = isBefore(day, today);
              const weekend = isWeekend(day);
              const disabled = !inMonth || past || weekend;
              const selected = selectedDate && isSameDay(day, selectedDate);
              const todayMark = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleDateSelect(day)}
                  className={[
                    "mx-auto size-10 rounded-lg text-[14px] font-medium transition-all",
                    selected
                      ? "bg-[#69527A] text-white"
                      : todayMark && inMonth && !past && !weekend
                        ? "text-[#69527A] ring-1 ring-[#69527A]/30 hover:bg-[#69527A]/8"
                        : disabled
                          ? "cursor-default text-[#69527A]/20"
                          : "text-[#483953] hover:bg-[#69527A]/8",
                    !disabled && !selected && "active:scale-[0.96]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time step */}
        <div
          className="overflow-y-auto"
          style={{
            opacity: showTime ? 1 : 0,
            transform: showTime ? "translateX(0)" : "translateX(12px)",
            transition: `opacity 250ms ${EASE}, transform 250ms ${EASE}`,
            pointerEvents: showTime ? "auto" : "none",
            position: showTime ? "relative" : "absolute",
            top: showTime ? undefined : 0,
            left: showTime ? undefined : 0,
            right: showTime ? undefined : 0,
            maxHeight: showTime ? undefined : 0,
          }}
          aria-hidden={!showTime}
        >
          <div className="mb-5 flex items-center gap-2">
            <button
              type="button"
              onClick={handleBack}
              className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-black/5 active:scale-[0.98]"
            >
              <IconChevronLeft size={18} className="text-black" />
            </button>
            <h3 className="text-[17px] font-semibold tracking-[-0.36px] text-black">
              {selectedDate ? format(selectedDate, "EEEE, MMM d") : ""}
            </h3>
          </div>

          <div className="mb-4">
            <span className="mb-2 block text-[12px] font-medium text-[#69527A]/50">
              Morning
            </span>
            <div className="grid grid-cols-3 gap-2">
              {MORNING_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={[
                    "h-9 rounded-lg text-[13px] font-medium transition-all active:scale-[0.97]",
                    selectedTime === slot
                      ? "bg-[#69527A]/10 text-[#69527A] ring-1.5 ring-[#69527A]"
                      : "bg-white text-[#483953] hover:bg-[#69527A]/[0.06]",
                  ].join(" ")}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-2 block text-[12px] font-medium text-[#69527A]/50">
              Afternoon
            </span>
            <div className="grid grid-cols-3 gap-2">
              {AFTERNOON_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={[
                    "h-9 rounded-lg text-[13px] font-medium transition-all active:scale-[0.97]",
                    selectedTime === slot
                      ? "bg-[#69527A]/10 text-[#69527A] ring-1.5 ring-[#69527A]"
                      : "bg-white text-[#483953] hover:bg-[#69527A]/[0.06]",
                  ].join(" ")}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Confirmed step */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: showConfirmed ? 1 : 0,
            transform: showConfirmed ? "scale(1)" : "scale(0.98)",
            transition: `opacity 300ms ${EASE}, transform 300ms ${EASE}`,
            pointerEvents: showConfirmed ? "auto" : "none",
          }}
          aria-hidden={!showConfirmed}
        >
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#69527A]/10">
              <IconCheck size={28} className="text-[#69527A]" />
            </div>
            <div>
              <h3 className="mb-1 text-[20px] font-semibold tracking-[-0.4px] text-[#483953]">
                You&apos;re booked
              </h3>
              <p className="text-[14px] leading-[20px] text-[#69527A]/70">
                {selectedDate && selectedTime
                  ? `${format(selectedDate, "EEEE, MMMM d")} at ${selectedTime}`
                  : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="mt-1 text-[14px] font-medium text-[#69527A] hover:underline"
            >
              Book another time
            </button>
          </div>
        </div>
      </div>

      {/* Sticky bottom button */}
      {!showConfirmed && buttonLabel && (
        <div className="pt-4">
          <button
            type="button"
            disabled={buttonDisabled}
            onClick={handleButtonClick}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-[11px] bg-black active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
            style={{ height: 48 }}
          >
            <div className="absolute inset-y-[2px] right-[2px] w-[44px] rounded-[9px] bg-white/[0.12] transition-[width] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:w-[calc(100%-4px)]" />
            <span className="relative text-[15px] font-medium leading-[20px] tracking-[-0.3px] text-white">
              {buttonLabel}
            </span>
            <div className="absolute bottom-[2px] right-[2px] top-[2px] flex w-[44px] items-center justify-center rounded-[9px]">
              {showTime ? (
                <IconCheck size={18} className="text-white" />
              ) : (
                <IconArrowRight size={18} className="text-white" />
              )}
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
