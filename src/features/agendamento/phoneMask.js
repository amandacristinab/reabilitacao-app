export function toDigits(value, max = 11) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, max);
}

export function formatBrMobilePhone(digits) {
  const d = toDigits(digits, 11);
  if (!d) return "";

  const ddd = d.slice(0, 2);
  const rest = d.slice(2);

  if (d.length <= 2) return `(${ddd}`;
  if (d.length <= 7) return `(${ddd}) ${rest}`;
  if (d.length <= 11) return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5, 9)}`;
}

