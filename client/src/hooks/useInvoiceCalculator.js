import { useMemo } from 'react';

export const useInvoiceCalculator = (items) => {
  return useMemo(() => {
    if (!items || items.length === 0) {
      return { subtotal: 0, taxTotal: 0, grandTotal: 0 };
    }

    const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const taxTotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice * (item.taxRate / 100)), 0);
    const grandTotal = subtotal + taxTotal;

    return { subtotal, taxTotal, grandTotal };
  }, [items]);
};
