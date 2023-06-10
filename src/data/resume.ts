import { readArticleFromDir } from "src/data/articles";
import { createDataSource } from "src/data/data";

const resumeDir = "contents/resume";

const resumeData = createDataSource({
  watchPath: resumeDir,
  loader: async () => {
    return await readArticleFromDir(resumeDir);
  },
});

export const getResume = async () => {
  return await resumeData();
};

