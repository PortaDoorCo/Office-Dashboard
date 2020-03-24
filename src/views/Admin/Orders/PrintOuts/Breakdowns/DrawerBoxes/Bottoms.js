import Ratio from 'lb-ratio';

const fraction = num => {
    let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
    return fraction.toLocaleString();
};
export default (item, part) => {

    return {
        qty: parseInt(item.qty),
        measurement: `${fraction((parseInt(item.width) - (part.boxThickness.Decimal * 2) + 0.5))} x ${fraction((parseInt(item.depth) - (part.boxThickness.Decimal * 2) + 0.5))}`,
        pattern: 'Bottoms'
    }

   
};
