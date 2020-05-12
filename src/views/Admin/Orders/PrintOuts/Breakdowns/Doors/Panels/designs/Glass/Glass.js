import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';
// import frac2dec from '../frac2dec'



export default (info, part) => {
    const lites = part.lite ? part.lite.NAME : ''
    const none = [
        {
            qty: ``,
            measurement: `GLASS \n ${lites}`,
            pattern: ``
        },
    ]
    return none;
};
