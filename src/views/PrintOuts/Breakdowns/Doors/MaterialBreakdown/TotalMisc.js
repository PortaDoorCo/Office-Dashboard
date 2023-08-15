import numQty from 'numeric-quantity';

export default (v, part) => {
  const calc = v.misc_items.map((i) => {
    if (i.category === 'preselect' && i.item && i.item.count_items) {
      return parseInt(i.qty, 10);
    } else if (i.category === 'custom') {
      return parseInt(i.qty, 10);
    }
    return 0; // Return 0 if neither condition is met
  });

  const sum = calc.reduce((acc, item) => acc + item, 0); // Start with a sum of 0

  return sum;
};
