const getAnimeCardSize = (windowSize: number) => {
  return windowSize < 768 ? 232 : windowSize < 1024 ? 232 : 348;
};

export default getAnimeCardSize;
