import changemark from "data/.changemark.json";

const changemarkData: Record<string, number> = changemark;

interface DbConfig<TData> {
  watchPath: string;

  loader: () => Promise<TData>;
}

export const createDataSource = <TData>(config: DbConfig<TData>) => {
  let loaded: { data: TData; time: number } | null = null;

  const reload = async (now: number) => {
    console.log("[%s] Load data", config.watchPath);
    return loaded = {
      data: await config.loader(),
      time: now,
    };
  };

  return async () => {
    const now = Date.now();

    if (!loaded) {
      console.log("[%s] No data loaded. Load data", config.watchPath);
      loaded = await reload(now);
    }
    else {
      if (changemarkData[config.watchPath] && changemarkData[config.watchPath] > now) {
        console.log("[%s] Change detected. Reload data", config.watchPath);
        loaded = await reload(now);
      }
    }

    return loaded.data;
  };
};
