


export default (v, part) => {
    const calc = v.map(item => {
        const sides = ((parseInt(item.depth) - (part.boxThickness.Decimal * 2) + 0.6875) * 2) * parseInt(item.qty)
        const fronts = (parseInt(item.width) * 2) * parseInt(item.qty)
        const depth = (parseInt(item.height))
        const sum = ((sides + fronts) * depth) / 144
        return sum
    })
    const sum = calc.reduce((acc, item) => acc + item, 0);
    return sum.toFixed(2)
}
