


export default (v, part) => {
    const calc = v.map(item => {
        const sides = ((parseInt(item.depth) - part.boxThickness.SIDE_DEDUCTION)) * parseInt(item.qty)
        const fronts = (parseInt(item.width) * 2) * parseInt(item.qty)
        const depth = (parseInt(item.height))
        // const sum = ((sides + fronts) * depth) / 144
        const sum = ((parseInt(item.width) - part.boxThickness.BOTTOM_WIDTH_REDUCTION) * (parseInt(item.depth) - part.boxThickness.BOTTOM_LENGTH_DEDUCTION)) / 144
        return sum
    })
    const sum = calc.reduce((acc, item) => acc + item, 0);
    return sum.toFixed(2)
}
