import numQty from "numeric-quantity";
import Ratio from "lb-ratio";
// import frac2dec from '../frac2dec'

const fraction = (num) => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (info, part, breakdowns) => {
    const vMidRail = info.verticalMidRailSize ? info.verticalMidRailSize : 0;
    const hMidRail = info.horizontalMidRailSize ? info.horizontalMidRailSize : 0;
    
    const top_rail_arch = part?.design?.TOP_RAIL_ADD;
    const btm_rail_arch = part?.design?.BTM_RAIL_ADD;
    const lip_factor = part?.edge?.LIP_FACTOR ? part?.edge?.LIP_FACTOR : 0;
  
    const topRail = info.topRail
      ? numQty(info.topRail) + lip_factor / 2
      : 0;
    const bottomRail = info.bottomRail
      ? numQty(info.bottomRail) + lip_factor / 2
      : 0;
    const leftStile = info.leftStile
      ? numQty(info.leftStile) + lip_factor / 2
      : 0;
    const rightStile = info.rightStile
      ? numQty(info.rightStile) + lip_factor / 2
      : 0;
    const vertMull = numQty(vMidRail);
    const horizMull = numQty(hMidRail);
    const panelsH = parseInt(info.panelsH);
    const panelsW = parseInt(info.panelsW);
    const height = numQty(info.height);
    const width = numQty(info.width);
    const qty = parseInt(info.qty);
    const edge_factor = part.edge?.LIP_FACTOR;
    
    let inset = 0;
    if (part.profile) {
      inset = part.profile?.INSET;
    } else {
      inset = part.design?.INSET;
    }

  const lites = info.lite ? info.lite.NAME : "";
  const panel_factor = part?.panel?.PANEL_FACTOR;
  const panelName = part?.panel?.NAME;

  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  const unevenSplitArray = Array.from(Array(panelsH).keys())
    .slice(1)
    .map((i, v) => {
      return numQty(info[`unevenSplitInput${v}`]);
    });

  const unevenSplitTotal =
    unevenSplitArray.length > 0 ? unevenSplitArray.reduce(reducer) : 0;

  const glassDoor = (index) => {
    const lite = info[`lite_${index}`]?.NAME;
    return {
      qty: qty,
      measurement: `${lite !== "Glass" ?  lite : ""}`,
      pattern: "GL",
      width: 0,
      height: 0,
      panel: "Glass",
      multiplier: qty
    };
  };

  const glassOnlyDoor = {
    qty: "",
    measurement: "GLASS",
    pattern: "",
    width: 0,
    height: 0,
    panel: "Glass",
    multiplier: qty
  };

  const door = [
    {
      qty: `(${panelsH * panelsW * qty})`,
      measurement: `${fraction(
        Math.round(eval(breakdowns.panel_width) * 16) / 16
      )} x ${fraction(Math.round(eval(breakdowns.panel_height) * 16) / 16)}`,
      pattern: part && part.panel && part.panel.Flat ? "PF" : "PR",
      width: Math.round(eval(breakdowns.panel_width) * 16) / 16,
      height: Math.round(eval(breakdowns.panel_height) * 16) / 16,
      panel: panelName,
      multiplier: panelsH * panelsW * qty
    },
  ];

  const doorMulti = {
    qty: qty,
    measurement: `${fraction(
      Math.round(eval(breakdowns.panel_width) * 16) / 16
    )} x ${fraction(Math.round(eval(breakdowns.panel_height) * 16) / 16)}`,
    pattern: part && part.panel && part.panel.Flat ? "PF" : "PR",
    width: Math.round(eval(breakdowns.panel_width) * 16) / 16,
    height: Math.round(eval(breakdowns.panel_height) * 16) / 16,
    panel: panelName,
    multiplier: qty
  };

  const unevenSplit = () => {
    const panelWidth =
      (width - leftStile - rightStile - vertMull * (panelsW - 1)) / panelsW;
    const panelHeight =
      height -
      unevenSplitTotal -
      horizMull * (panelsH - 1) -
      bottomRail -
      topRail;
    const unevenSplitInput = (v) => numQty(info[`unevenSplitInput${v}`]);
    const glassCheck = (v) => info[`glass_check_${v}`];

    const unEven = [
      ...Array.from(Array(panelsH).keys())
        .slice(1)
        .map((i, v) => {
          if (glassCheck(v)) {
            return glassDoor(v);
          } else {
            return {
              qty: `(${qty})`,
              measurement: `${fraction(
                Math.round(eval(breakdowns.panel_width) * 16) / 16
              )} x ${fraction(
                unevenSplitInput(v)
              )}`,
              pattern: part && part.panel && part.panel.Flat ? "PF" : "PR",
              width: Math.round(panelWidth),
              height: Math.round(unevenSplitInput(v)),
              panel: panelName,
              multiplier: qty
            };
          }
        }),
    ];

    const bottom = {
      qty: `(${qty})`,
      measurement: `${fraction(
        Math.round(eval(breakdowns.panel_width) * 16) / 16
      )} x ${fraction(panelHeight)}`,
      pattern: part && part.panel && part.panel.Flat ? "PF" : "PR",
      width: Math.round(panelWidth),
      height: Math.round(panelHeight),
      panel: panelName,
      multiplier: qty
    };

    if (glassCheck(panelsH - 1)) {
      return [
        ...unEven,
        glassDoor(panelsH - 1), // <-------Needs Testing
      ];
    } else {
      return [...unEven, bottom];
    }
  };

  const doorFunc = () => {

    let arr = [];

    if (info.unevenCheck) {
      arr = unevenSplit();
    } else {
      arr = [
        ...Array.from(Array(panelsH).keys()).map((i, v) => {
          if (info[`glass_check_${v}`]) {
            return glassDoor(v);
          } else {
            return doorMulti;
          }
        }),
      ];
    }


    let new_arr = arr.reduce((ar, obj) => {
      let bool = false;
      if (!ar) {
        ar = [];
      }
      ar.forEach((a) => {
        if (a.measurement === obj.measurement) {
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

  if (info.glass_index === 1 || 2) {
    return doorFunc();
  } else {
    return door;
  }
};
