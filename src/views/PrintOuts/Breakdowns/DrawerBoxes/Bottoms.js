import Ratio from 'lb-ratio';
import numQty from 'numeric-quantity';

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};
export default (item, part, breakdowns) => {

  const b = breakdowns[0];

  const sideDeduction = part.box_thickness.SIDE_DEDUCTION;
  const lengthDeduction = part.box_thickness.BOTTOM_LENGTH_DEDUCTION;
  const bottomWidthReduction = part.box_thickness.BOTTOM_WIDTH_REDUCTION;
  const height = Math.round(numQty(item.height) * 16) / 16;
  const width = Math.round(numQty(item.width) * 16) / 16;
  const depth = Math.round(numQty(item.depth) * 16) / 16;

  if(part.box_bottom_woodtype.NAME === 'No Box Bottom') {
    return {
      qty: 0,
      measurement: 'No Box Bottom',
      pattern: 'Bottoms'
    };
  } else {
    return {
      qty: parseInt(item.qty),
      measurement: `${fraction(numQty(eval(b.bottoms_width)))} x ${fraction(numQty(eval(b.bottoms_depth)))}`,
      width: fraction(numQty(eval(b.bottoms_width))),
      length: fraction(numQty(eval(b.bottoms_depth))),
      pattern: 'Bottoms'
    };
  }

};
