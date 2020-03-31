import Ratio from 'lb-ratio';

const fraction = num => {
    let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
    return fraction.toLocaleString();
};
export default (item, part) => {

    console.log(item)
    console.log(part)
    const sideDeduction = part.boxThickness.SIDE_DEDUCTION
    const lengthDeduction = part.boxThickness.BOTTOM_LENGTH_DEDUCTION
    const width = parseInt(item.width)
    const height = parseInt(item.height)
    const depth = parseInt(item.depth)


    return {
        qty: parseInt(item.qty),
        measurement: `${fraction(width - sideDeduction)} x ${fraction(depth-lengthDeduction)}`,
        pattern: 'Bottoms'
    }

   
};
