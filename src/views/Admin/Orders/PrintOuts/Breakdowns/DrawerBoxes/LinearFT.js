
import numQty from 'numeric-quantity';

export default (v, part, breakdowns) => {

  const calc = v.map(item => {
    const sides = (numQty(item.depth) * 2) * parseInt(item.qty);
    const fronts = (numQty(item.width) * 2) * parseInt(item.qty);
    const s = (sides + fronts) / 12;
    return s;
  });
  const sum = calc.reduce((acc, item) => acc + item, 0);
  return sum.toFixed(2);

};
