import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';
// import frac2dec from '../frac2dec'

const fraction = num => {
    let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
    return fraction.toLocaleString();
};

export default (info, part) => {

    const vMidRail = info.verticalMidRailSize ? info.verticalMidRailSize : 0
    const hMidRail = info.horizontalMidRailSize ? info.horizontalMidRailSize : 0

    const top_rail_add = part.design.TOP_RAIL_ADD
    const btm_rail_add = part.design.BTM_RAIL_ADD

    const topRail = numQty(info.topRail) + top_rail_add
    const bottomRail = numQty(info.bottomRail) + btm_rail_add
    const leftStile = numQty(info.leftStile)
    const rightStile = numQty(info.rightStile)
    const vertMull = numQty(vMidRail)
    const horizMull = numQty(hMidRail)
    const panelsH = parseInt(info.panelsH)
    const panelsW = parseInt(info.panelsW)
    const height = numQty(info.height)
    const width = numQty(info.width)
    const qty = parseInt(info.qty)

    const lites = part.lites? part.lites.NAME : ''

    const inset = part.profile.INSET
    const edge_factor = part.edge.LIP_FACTOR
    const panel_factor = part.panel.PANEL_FACTOR

    const add_len = 0
    const INSET = 0

    const df = [
        {
            qty: `${info.qty}`,
            measurement: `${fraction(
                height +
                add_len -
                topRail -
                bottomRail +
                (INSET * 2)
            )} x ${fraction(
                width +
                add_len -
                leftStile -
                rightStile +
                (INSET * 2)
            )}`,
            pattern: 'PR'
        },
    ]




   

        return df;
    
};
