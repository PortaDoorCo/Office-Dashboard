import Ratio from 'lb-ratio';

const fraction = num => {
    let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
    return fraction.toLocaleString();
};
export default (item, part, breakdowns) => {

    const b = breakdowns[0]

    const height = item.height;
    const depth = parseInt(item.depth)
    const sideDeduction = part.box_thickness.SIDE_DEDUCTION
    const boxThickness = part.box_thickness.NAME
    return {
        qty: (parseInt(item.qty) * 2),
        depth: depth,
        measurement: `${eval(b.sides_height)} x ${fraction(eval(b.sides_depth))} x ${eval(b.sides_thickness)}`,
        pattern: "Sides"
    }

};
