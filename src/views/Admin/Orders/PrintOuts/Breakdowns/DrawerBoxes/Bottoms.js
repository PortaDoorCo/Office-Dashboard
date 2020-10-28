import Ratio from 'lb-ratio';
import numQty from 'numeric-quantity'

const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};
export default (item, part, breakdowns) => {

  const b = breakdowns[0];

  const sideDeduction = part.box_thickness.SIDE_DEDUCTION;
  const lengthDeduction = part.box_thickness.BOTTOM_LENGTH_DEDUCTION;
  const bottomWidthReduction = part.box_thickness.BOTTOM_WIDTH_REDUCTION;
  const width = numQty(item.width);
  const height = numQty(item.height);
  const depth = numQty(item.depth);

  console.log('bottoms width', width)
  console.log('bottoms width', bottomWidthReduction)

  return {
    qty: parseInt(item.qty),
    measurement: `${fraction(eval(b.bottoms_width))} x ${fraction(eval(b.bottoms_depth))}`,
    pattern: 'Bottoms'
  };

   
};
