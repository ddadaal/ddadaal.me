import { lazyLoad } from "src/utils/lazy";

interface DbConfig<TData> {
  watchPath: string;

  loader: () => Promise<TData>;
}

// export const createDataSource = <TData>(config: DbConfig<TData>) => {

//   let invalidated = true;
//   let data: TData | undefined = undefined;

//   chokidar.watch(config.watchPath, {
//     ignoreInitial: true,
//     useFsEvents: false,
//   }).on("all", async () => {
//     console.log("FS events occurred in ", config.watchPath);
//     invalidated = true;
//   });

//   return async () => {
//     if (!data || invalidated) {
//       data = await config.loader();
//       invalidated = false;
//     }

//     return data;
//   };
// };


export const createDataSource = <TData>(config: DbConfig<TData>) => {
  return lazyLoad(config.loader);
};
