import currency from 'currency.js';
import numQty from 'numeric-quantity';

const pricing = (parts, pricer) => {
  const items = parts.map((i) => {
    let price = 0;

    const { width, length, woodtype, thickness, extraCost, qty } = i;

    if (width && length && woodtype && thickness) {
      price =
        ((numQty(width) * numQty(length)) / 144) *
        1.25 *
        woodtype[thickness?.db_name] *
        0.3;

      if (thickness.thickness_values === 1) {
        price = price * 1.25;
      }

      if (thickness.thickness_values === 1.125) {
        price = price * 1.5;
      }
    }

    return currency(price).multiply(qty).add(extraCost).value;
  });

  const withQty = items.map((i, index) => {
    const price = i ? i : 0;
    return currency(price).value;
  });

  return withQty;
};

export default pricing;
