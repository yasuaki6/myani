const getTitleSize = (windowSize: number) => {
  return windowSize <= 500
    ? "1rem"
    : windowSize < 768
    ? "2rem"
    : windowSize < 1024
    ? "3rem"
    : "4rem";
};

export default getTitleSize;
