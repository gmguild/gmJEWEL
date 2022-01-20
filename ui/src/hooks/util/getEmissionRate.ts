export const getEmissionRate = (blockNumber: number) => {
  if (blockNumber < 25000000) {
    return 10;
  } else if (blockNumber < 30000000) {
    return 5;
  } else if (blockNumber < 35000000) {
    return 3;
  } else if (blockNumber < 45000000) {
    return 1;
  } else {
    return 0.1;
  }
};
