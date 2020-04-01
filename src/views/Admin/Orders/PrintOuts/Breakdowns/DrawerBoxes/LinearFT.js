


export default (v, part) => {

    const calc = v.map(item => {
        const sides = ((parseInt(item.depth) - part.boxThickness.SIDE_DEDUCTION)) * parseInt(item.qty)
        const fronts = (parseInt(item.width) * 2) * parseInt(item.qty)
        const s = (sides + fronts) / 12
        return s
    })
    const sum = calc.reduce((acc, item) => acc + item, 0);
    return sum.toFixed(2)

}
