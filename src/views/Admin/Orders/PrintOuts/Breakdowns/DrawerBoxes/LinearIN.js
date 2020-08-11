
import numQty from 'numeric-quantity';

export default (v, part) => {



  const calc = v.map(item => {
    const sides = (numQty(item.depth) * 2) * parseInt(item.qty);
    const fronts = (numQty(item.width) * 2) * parseInt(item.qty);
    const s = (sides + fronts);
    return s;
  });
  const sum = calc.reduce((acc, item) => acc + item, 0);
  return sum.toFixed(2);

<<<<<<< HEAD
  // const sides = ((parseInt(item.depth) - (part.boxThickness.Decimal * 2) + 0.6875) * 2)
  // const fronts = (parseInt(item.width) * 2)
  // const depth = (parseInt(item.height))
  // const linIN = (sides + fronts)

  // return `${linIN.toFixed(2)} Linear Inches`
=======

>>>>>>> staging
};
