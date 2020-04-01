import numQty from 'numeric-quantity';

export default (v, part) => {
    const calc = v.map(item => {
        const height = ((numQty(item.height)) * 2) * parseInt(item.qty)
        const width = (numQty(item.width) * 2) * parseInt(item.qty)
        const sum = (height + width)
        return sum
    })
    const sum = calc.reduce((acc, item) => acc + item, 0);
    return sum.toFixed(2)
}
