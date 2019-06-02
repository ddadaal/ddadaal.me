import React, { useEffect, useRef } from "react";

export function useEventListener<R extends EventTarget, K extends keyof HTMLElementEventMap>(
  element: R | React.RefObject<R>,
  eventType: K,
  listener: (this: R, ev: HTMLElementEventMap[K]) => any,
  deps: any[] = [],
) {

  const savedListener = useRef<typeof listener | null>(null);

  useEffect(() => {
    savedListener.current = listener;
  }, [listener]);

  useEffect(() => {
    const actualElem = "current" in element ? element.current!! : element;
    const eventHandler = (e: HTMLElementEventMap[K]) => savedListener.current!!.call(actualElem, e);
    actualElem.addEventListener(eventType, eventHandler);

    return () => {
      actualElem.removeEventListener(eventType, listener);

    };
  }, [element, eventType, ...deps]);
}
