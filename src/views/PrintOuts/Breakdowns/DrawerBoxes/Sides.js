import Ratio from 'lb-ratio';
import numQty from 'numeric-quantity';

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};
export default (item, part, breakdowns) => {

  const b = breakdowns[0];

  const width = numQty(item.width);
  const height = numQty(item.height);
  const depth = numQty(item.depth);
  const sideDeduction = part.box_thickness.SIDE_DEDUCTION;
  const bottomWidthReduction = part.box_thickness.BOTTOM_WIDTH_DEDUCTION;
  const boxThickness = part.box_thickness.NAME;
  return {
    qty: (parseInt(item.qty) * 2),
    depth: depth,
    measurement: `${fraction(numQty(eval(b.sides_height)))} x ${fraction(numQty(eval(b.sides_depth)))} x ${fraction(numQty(eval(b.sides_thickness)))}`,
    pattern: 'Sides'
  };

};