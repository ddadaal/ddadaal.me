import { watch } from "chokidar";
import { existsSync, readFileSync, writeFileSync } from "fs";

const arg = process.argv.at(-1);

const CHANGEMARK_JSON_FILE = "data/.changemark.json";

if (!existsSync(CHANGEMARK_JSON_FILE)) {
  console.log("Create changemark file");

  writeFileSync(CHANGEMARK_JSON_FILE, JSON.stringify({}));
}

const updateChangemark = (watchDir: string) => {
  const currentChangemark = JSON.parse(readFileSync(CHANGEMARK_JSON_FILE, "utf-8"));

  currentChangemark[watchDir] = Date.now();

  writeFileSync(CHANGEMARK_JSON_FILE, JSON.stringify(currentChangemark));
};

export const defineDataSource = (watchDir: string) => {

  if (arg === "watch") {


    console.log("[%s] Watching for changes", watchDir);
    updateChangemark(watchDir);

    watch(watchDir, { ignoreInitial: true }).on("all", (e) => {
      console.log("[%s] Change on %s detected. Update mark time", watchDir, e);
      updateChangemark(watchDir);
    });
  } else if (arg === "build") {
    console.log("[%s] Build data", watchDir);
    updateChangemark(watchDir);
  }
};

defineDataSource("contents");
defineDataSource("contents/resume");
