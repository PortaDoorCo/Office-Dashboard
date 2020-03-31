import Ratio from 'lb-ratio';

const fraction = num => {
    let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
    return fraction.toLocaleString();
};
export default (item, part) => {

    const depth = parseInt(item.depth)
    const sideDeduction = part.boxThickness.SIDE_DEDUCTION
    const thickness = part.boxThickness.NAME
    return {
        qty: (parseInt(item.qty) * 2),
        depth: depth,
        measurement: `${item.height} x ${fraction(depth - sideDeduction)} x ${thickness}`,
        pattern: "Sides"
    }

};
