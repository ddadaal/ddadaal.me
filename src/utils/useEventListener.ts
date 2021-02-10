import React, { useEffect, useRef } from "react";

export function useEventListener
<R extends EventTarget, K extends keyof HTMLElementEventMap>(
  element: R | React.RefObject<R>,
  eventType: K,
  listener: (this: R, ev: HTMLElementEventMap[K]) => void,
  deps: unknown[] = [],
): void {

  const savedListener = useRef<typeof listener | null>(null);

  useEffect(() => {
    savedListener.current = listener;
  }, [listener]);

  useEffect(() => {
    const actualElem = "current" in element ? element.current : element;
    if (!actualElem) { throw "Element is null."; }

    const currentSavedListener = savedListener.current;
    if (!currentSavedListener) { throw "Listener is null"; }

    const eventHandler = (e: HTMLElementEventMap[K]) =>
      currentSavedListener.call(actualElem, e);
    actualElem.addEventListener(eventType, eventHandler);

    return () => {
      actualElem.removeEventListener(eventType, listener);

    };
  }, [element, eventType, ...deps]);
}
