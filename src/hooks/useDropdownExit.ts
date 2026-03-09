import { useCallback, useEffect, useRef, useState } from "react";

const EXIT_DURATION = 120;

export function useDropdownExit() {
  const [open, setOpen] = useState(false);
  const [exiting, setExiting] = useState(false);
  const exitRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const close = useCallback(() => {
    if (exitRef.current) return;
    exitRef.current = true;
    setExiting(true);
    timerRef.current = setTimeout(() => {
      setOpen(false);
      setExiting(false);
      exitRef.current = false;
    }, EXIT_DURATION);
  }, []);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return { open, setOpen, exiting, close, isVisible: open || exiting };
}
