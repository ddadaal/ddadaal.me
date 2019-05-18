import { useState, useCallback } from "react";
import { useEventListener } from "../utils/hooksUtils";

interface StoppableEvent {
  stopPropagation(): void;
}

export type DropdownControl = [
  boolean, // open
  (e?: StoppableEvent, nextValue?: boolean) => void // toggle
];

export function useDropdown(defaultOpen: boolean = false): DropdownControl {

  const [open, setOpen] = useState(defaultOpen);

  // the event of toggle must be prevented from reaching window
  // where window would close the menu

  const toggle = useCallback((e?: StoppableEvent, nextValue?: boolean) => {
    if (e) { e.stopPropagation(); }
    if (typeof nextValue !== "undefined") {
      setOpen(nextValue);
    } else {
      setOpen((current) => !current);
    }
  }, [setOpen]);

  const close = (e: MouseEvent | TouchEvent) => toggle(e, false);

  useEventListener(window, "click", close);
  useEventListener(window, "touchstart", close);

  return [open, toggle];
}
