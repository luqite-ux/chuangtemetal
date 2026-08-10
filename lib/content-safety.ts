export const PROHIBITED_PROMISE_TERMS = [
  "质保",
  "保修",
  "质量保证",
  "warranty",
  "warranties",
  "guarantee",
  "guaranteed",
] as const;

export function findProhibitedCopy(value: string): string[] {
  const normalized = value.toLocaleLowerCase("en");
  return PROHIBITED_PROMISE_TERMS.filter((term) => normalized.includes(term.toLocaleLowerCase("en")));
}

export function assertNoProhibitedCopy(value: string): void {
  const matches = findProhibitedCopy(value);
  if (matches.length > 0) {
    throw new Error(`Prohibited public copy: ${matches.join(", ")}`);
  }
}
