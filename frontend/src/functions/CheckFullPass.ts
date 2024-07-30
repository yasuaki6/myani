import { staticServerBaseURL } from "../config.ts";

const ChackFullPATH = (path: string | undefined) => {
  if (path) {
    if (/^https?:\/\//i.test(path)) {
      return path;
    } else {
      return staticServerBaseURL + path;
    }
  } else {
    return path;
  }
};

export default ChackFullPATH;
