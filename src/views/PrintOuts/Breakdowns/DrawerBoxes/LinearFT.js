
import numQty from 'numeric-quantity';

export default (v, part, breakdowns) => {

  

  const calc = v.map(item => {

    const depth = Math.round(numQty(item.depth) * 16) / 16;
    const width = Math.round(numQty(item.width) * 16) / 16;

    const sides = (depth * 2) * parseInt(item.qty);
    const fronts = (width * 2) * parseInt(item.qty);
    const s = (sides + fronts) / 12;
    return s;
  });
  const sum = calc.reduce((acc, item) => acc + item, 0);
  return sum.toFixed(2);

};
