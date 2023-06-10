export const lazyLoad = <T>(getter: () => Promise<T>) => {
  let loaded: T | undefined = undefined;

  return async () => {
    if (typeof loaded === "undefined") {
      loaded = await getter();
    }
    return loaded;
  };
};
