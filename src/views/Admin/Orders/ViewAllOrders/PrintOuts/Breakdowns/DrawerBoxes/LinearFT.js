


export default (v, part) => {

    const calc = v.map(item => {
        const sides = ((parseInt(item.depth) - (part.boxThickness.Decimal * 2) + 0.6875) * 2) * parseInt(item.qty)
        const fronts = (parseInt(item.width) * 2) * parseInt(item.qty)
        const s = (sides + fronts) / 12
        return s
    })
    const sum = calc.reduce((acc, item) => acc + item, 0);
    return sum.toFixed(2)

    // console.log(part) 

    // const sides = ((parseInt(item.depth) - (part.boxThickness.Decimal * 2) + 0.6875) * 2)
    // const fronts = (parseInt(item.width) * 2)
    // const depth = (parseInt(item.height))
    // const linFt = (sides + fronts) / 12

    // return `${linFt.toFixed(2)} Linear Ft`
}
