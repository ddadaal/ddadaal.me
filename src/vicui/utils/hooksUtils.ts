import React, { useEffect, useRef } from "react";

export function useEventListener<R extends EventTarget, K extends keyof HTMLElementEventMap>(
  element: R,
  eventType: K,
  listener: (this: R, ev: HTMLElementEventMap[K]) => any,
) {

  const savedListener = useRef<typeof listener |  null>(null);

  useEffect(() => {
    savedListener.current = listener;
  }, [listener]);

  useEffect(() => {
    const eventHandler = (e: HTMLElementEventMap[K]) => savedListener.current!!.call(element, e);
    element.addEventListener(eventType, eventHandler);

    return () => {
      element.removeEventListener(eventType, listener);

    };
  }, [element, eventType]);
}
