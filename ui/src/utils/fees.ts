export const getFees = (price: number): number => {
  const fee =
    price > 100000
      ? 0.0025
      : price > 10000
      ? 0.005
      : price > 1000
      ? 0.01
      : 0.015;
  return fee;
};
