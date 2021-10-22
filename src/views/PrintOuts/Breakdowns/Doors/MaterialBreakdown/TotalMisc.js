import numQty from 'numeric-quantity';

export default (v, part) => {
  const calc = v.misc_items.map(i => {
    return parseInt(i.qty);
  });

  const sum = calc.reduce((acc, item) => acc + item);

  return sum;
};
