// sum.ts
export function sum(a, b) {
  return a + b;
}

// sum.test.ts
import { sum } from "./sum.test";

test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
