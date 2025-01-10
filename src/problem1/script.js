const sum_to_n_a = function (n) {
  return (n * (n + 1)) / 2;
};
const testFn1 = sum_to_n_a(25);
console.log(testFn1);

const sum_to_n_b = function (n) {
  const arrayFromN = Array.from({ length: n }, (_, index) => index + 1);
  const result = arrayFromN.reduce((result, currentValue) => result + currentValue, 0);
  return result;
};
const testFn2 = sum_to_n_a(25);
console.log(testFn2);

const sum_to_n_c = function (n) {
  if (n === 1) return 1;
  return n + sum_to_n_c(n - 1);
};
const testFn3 = sum_to_n_c(25);
console.log(testFn3);