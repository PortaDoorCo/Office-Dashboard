import Ratio from 'lb-ratio';
import numQty from 'numeric-quantity';


const fraction = num => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (item, part, breakdowns) => {

  const b = breakdowns[0];

  const height = item.height;
  const width = item.width;
  const boxThickness = part.box_thickness.NAME;

  return {
    qty: (parseInt(item.qty) * 2),
    measurement: `${fraction(numQty(eval(b.fronts_height)))} x ${fraction(numQty(eval(b.fronts_width)))} x ${fraction(numQty(eval(b.fronts_thickness)))}`,
    pattern: 'Fronts/Backs'
  };
};
