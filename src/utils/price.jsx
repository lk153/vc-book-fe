export function formatPrice(value) {
  const locale = 'en-US';
  return new Intl.NumberFormat(locale).format(value);
}