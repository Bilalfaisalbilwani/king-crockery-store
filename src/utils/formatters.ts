export function formatPKR(amount: number): string {
  return `₨ ${Math.round(amount).toLocaleString('en-PK')}`;
}

export function calculateDiscountPct(price: number, originalPrice?: number | null): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function generateWhatsAppLink(
  phoneNumber: string,
  message: string
): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
}
