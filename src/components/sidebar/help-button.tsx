import { IconHelpCircle } from "@tabler/icons-react";

export function HelpButton() {
  return (
    <a
      href="https://dub.co/contact/support"
      target="_blank"
      className="flex size-11 shrink-0 items-center justify-center rounded-xl text-neutral-700 hover:bg-black/5 outline-none focus-visible:ring-2 focus-visible:ring-black/50"
    >
      <IconHelpCircle size={20} strokeWidth={2} />
    </a>
  );
}
