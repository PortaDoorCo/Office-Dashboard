import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';

const fraction = num => {
    let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
    return fraction.toLocaleString();
};

export default (info, part) => {
    const add_len = part.design.S_ADD_LEN;



    const VMR = `( ${(parseInt(info.panelsH) * (parseInt(info.panelsW) - 1) * parseInt(info.qty))} ) ${fraction(info.leftStile)} x ${fraction(
        Math.floor(
            ((numQty(info.height) +
                add_len -
                numQty(info.topRail) -
                numQty(info.bottomRail) -
                numQty(info.horizontalMidRailSize) * (numQty(info.panelsH) - 1)) /
                numQty(info.panelsH) +
                part.design.TENON) *
            16
        ) / 16
    )} - VM`;

    const VMR2 = `( ${(info.panelsH - 1) * parseInt(info.qty)} ) ${fraction(info.leftStile)} x ${fraction(
        numQty(info.height) +
        add_len -
        numQty(info.leftStile) -
        numQty(info.rightStile) +
        part.design.TENON
    )} - VM`;

    if (info.panelsH && info.panelsW > 1) {

        return `${VMR}`;
    } else if (info.panelsH > 1 && info.panelsW) {
        return `${VMR2}`;
    } else {
        return null;
    }
};
