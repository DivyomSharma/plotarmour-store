const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number) {
  return currencyFormatter.format(amount);
}

export function slugToLabel(value: string) {
  return value.replace(/-/g, " ").toUpperCase();
}

export function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}
