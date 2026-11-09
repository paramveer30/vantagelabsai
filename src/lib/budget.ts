// The contact form's optional budget is an open number, not a range.
// People type it however they like ("10000", "$10,000", "7500.50"); the
// form and the API share this check, and the team email gets it in one
// consistent format.

export const budgetPattern = /^\$?\s*\d[\d,]*(\.\d{1,2})?$/;

export function isValidBudget(value: string): boolean {
  return budgetPattern.test(value.trim());
}

// "10000" -> "$10,000"; "$7,500.5" -> "$7,500.50"
export function formatBudget(value: string): string {
  const amount = Number(value.replace(/[$,\s]/g, ""));
  if (!Number.isFinite(amount)) return value.trim();
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}
