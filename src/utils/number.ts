export const ceilTo = (n: number, coeff: number) =>
  Math.ceil(n * coeff) / coeff;

export const add = (n1: number, n2: number) => {
  const n = n1 + n2;
  return Number(n.toFixed(2)); // fix javascript decimal addition (0.1 + 0.2 !== 0.299999999)
};
