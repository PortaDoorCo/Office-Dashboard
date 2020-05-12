import Ratio from 'lb-ratio';

const fraction = num => {
    let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
    return fraction.toLocaleString();
};
export default (item, part, breakdowns) => {

    const b = breakdowns[0]
    console.log(b)
    const sideDeduction = part.box_thickness.SIDE_DEDUCTION
    const lengthDeduction = part.box_thickness.BOTTOM_LENGTH_DEDUCTION
    const width = parseInt(item.width)
    const height = parseInt(item.height)
    const depth = parseInt(item.depth)

    return {
        qty: parseInt(item.qty),
        measurement: `${fraction(eval(b.bottoms_width))} x ${fraction(eval(b.bottoms_depth))}`,
        pattern: 'Bottoms'
    }

   
};
