import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';
// import frac2dec from '../frac2dec'

const fraction = (num) => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (info, part, breakdowns) => {
  const vMidRail = info.verticalMidRailSize ? info.verticalMidRailSize : 0;
  const hMidRail = info.horizontalMidRailSize ? info.horizontalMidRailSize : 0;

  const topRail = numQty(info.topRail) + (part.edge.LIP_FACTOR / 2);
  const bottomRail = numQty(info.bottomRail) + (part.edge.LIP_FACTOR / 2);
  const leftStile = numQty(info.leftStile) + (part.edge.LIP_FACTOR / 2);
  const rightStile = numQty(info.rightStile) + (part.edge.LIP_FACTOR / 2);
  const vertMull = numQty(vMidRail);
  const horizMull = numQty(hMidRail);
  const panelsH = parseInt(info.panelsH);
  const panelsW = parseInt(info.panelsW);
  const height = numQty(info.height);
  const width = numQty(info.width);
  const qty = parseInt(info.qty);

  const lites = info.lite ? info.lite.NAME : '';

  const inset = part.profile.INSET;
  const edge_factor = part.edge.LIP_FACTOR;
  const panel_factor = part.panel.PANEL_FACTOR;

  const panelName = part.panel.NAME;

  const add_len = 0;
  const INSET = 0;

  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  const unevenSplitArray = Array.from(Array(panelsH).keys())
    .slice(1)
    .map((i, v) => {
      return numQty(info[`unevenSplitInput${v}`]);
    });

  const unevenSplitTotal =
    unevenSplitArray.length > 0 ? unevenSplitArray.reduce(reducer) : 0;

  const glassDoor = {
    qty: qty,
    measurement: 'GLASS',
    pattern: '',
  };

  const door = [{
    qty: `(${panelsH * panelsW * qty})`, 
    measurement: `${fraction(
      Math.round(eval(breakdowns.panel_width) * 16) / 16
    )} x ${fraction(Math.round(eval(breakdowns.panel_height) * 16) / 16)}`,
    pattern: part && part.panel && part.panel.Flat ? '- PF' : '- PR',
    width: Math.round(eval(breakdowns.panel_width) * 16) / 16,
    height: Math.round(eval(breakdowns.panel_height) * 16) / 16
  }];

  const doorMulti = {
    qty: qty,
    measurement: `${fraction(
      Math.round(eval(breakdowns.panel_width) * 16) / 16
    )} x ${fraction(Math.round(eval(breakdowns.panel_height) * 16) / 16)}`,
    pattern: part && part.panel && part.panel.Flat ? '- PF' : '- PR',
    width: Math.round(eval(breakdowns.panel_width) * 16) / 16,
    height: Math.round(eval(breakdowns.panel_height) * 16) / 16
  };


  const doorFunc = () => {
    const arr = [
      ...Array.from(Array(panelsH).keys())
        .map((i, v) => {        
          if(info[`glass_check_${v}`]){
            return glassDoor;
          }
          else {
            return doorMulti;
          }
        })
    ];

    let new_arr = arr.reduce((ar, obj) => {
      let bool = false;
      if (!ar) {
        ar = [];
      }
      ar.forEach((a) => {
        if (a === obj) {
          a.count++;
          let b = a.count++;
          a.qty = `(${b * qty})`;
          bool = true;
        }
      });
      if (!bool) {
        obj.count = 1;
        obj.qty = `(${parseInt(info.qty)})`;
        ar.push(obj);
      }
      return ar;
    }, []);

    return new_arr;
  };

  const unevenSplit = [
    ...Array.from(Array(panelsH).keys())
      .slice(1)
      .map((i, v) => {
        return {
          qty: `(${qty})`,
          measurement: `${fraction(
            (width +
              add_len -
              leftStile -
              rightStile -
              vertMull * (panelsW - 1)) /
              panelsW +
              INSET * 2
          )} x ${fraction(numQty(info[`unevenSplitInput${v}`]) + INSET * 2)}`,
          pattern: part && part.panel && part.panel.Flat ? 'PF' : 'PR',
        };
      }),
    {
      qty: `(${qty})`,
      measurement: `${fraction(
        (width + add_len - leftStile - rightStile - vertMull * (panelsW - 1)) /
          panelsW +
          INSET * 2
      )} x ${fraction(
        height -
          unevenSplitTotal -
          horizMull * (panelsH - 1) -
          bottomRail -
          topRail +
          INSET * 2
      )}`,
      pattern: part && part.panel && part.panel.Flat ? 'PF' : 'PR',
    },
  ];

  if (info.unevenCheck) {
    return unevenSplit;
  } else if (panelName === 'Glass') {
    return [glassDoor];
  } else if (info.glass_index === 1 || 2){
    return doorFunc();
  } else {
    return door;
  }
};
