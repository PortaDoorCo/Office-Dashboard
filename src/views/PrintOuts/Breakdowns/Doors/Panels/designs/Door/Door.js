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

  let edge_factor = part?.edge?.LIP_FACTOR ? part?.edge?.LIP_FACTOR : 0;
  let lip_factor = part?.edge?.LIP_FACTOR ? part?.edge?.LIP_FACTOR : 0;

  const topRail = info.topRail ? numQty(info.topRail) + lip_factor / 2 : 0;
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

  const orderType = info?.orderType?.value
    ? info.orderType?.value
    : part?.orderType?.value;

  let inset = 0;
  if (part.profile) {
    inset = part.profile?.INSET;
  } else {
    inset = part.design?.INSET;
  }

  const lites = info.lite ? info.lite.NAME : "";
  const panel_factor = part?.panel?.PANEL_FACTOR;

  console.log({inset})

  const panelName = info?.panel?.NAME ? info?.panel?.NAME : part?.panel?.NAME;
  const panelFlat = info?.panel?.Flat ? info?.panel?.Flat : part?.panel?.Flat;

  const VERTICAL_GRAIN = part.VERTICAL_GRAIN;

  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  const unevenInset = 0.75;

  const unevenSplitArray = Array.from(Array(panelsH).keys())
    .slice(1)
    .map((i, v) => {
      return (
        numQty(info[`unevenSplitInput${v}`]) -
        topRail +
        panel_factor +
        lip_factor
      );
    });

  const unevenSplitTotal =
    unevenSplitArray.length > 0 ? unevenSplitArray.reduce(reducer) : 0;

  const glassDoor = (index) => {
    const lite = info[`lite_${index}`]?.NAME;



    

    return {
      qty: qty,
      measurement: `${lite !== "Glass" ? lite : ""}`,
      pattern: "GL",
      width: 0,
      height: 0,
      panel: "Glass",
      count: 0,
      multiplier: qty,
    };
  };

  const glassOnlyDoor = {
    qty: "",
    measurement: "GLASS",
    pattern: "",
    width: 0,
    height: 0,
    panel: "Glass",
    multiplier: qty,
  };

  const unevenSplit = () => {
    const panelWidth =
      (width - leftStile - rightStile - vertMull * (panelsW - 1)) / panelsW;
    const panelHeight =
      height -
      topRail -
      numQty(info[`unevenSplitInput${0}`]) -
      horizMull * (panelsH - 1) +
      panel_factor +
      (lip_factor/ 2);


  
      // console.log({height})
      // console.log({unevenSplitTotal})
      // console.log({horizMull})
      // console.log({bottomRail})
      // console.log({panel_factor})
      // console.log({lip_factor})

    const unevenSplitInput = (v) =>
      numQty(info[`unevenSplitInput${v}`]) -
      topRail +
      panel_factor +
      lip_factor / 2;

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
              )} x ${fraction(unevenSplitInput(v))}`,
              pattern: panelFlat ? "PF" : "PR",
              width: Math.round(panelWidth),
              height: Math.round(unevenSplitInput(v)),
              panel: panelName,
              multiplier: qty,
              count: qty,
            };
          }
        }),
    ];

    const bottom = {
      qty: `(${qty})`,
      measurement: `${fraction(
        Math.round(eval(breakdowns.panel_width) * 16) / 16
      )} x ${fraction(panelHeight)}`,
      pattern: panelFlat ? "PF" : "PR",
      width: Math.round(panelWidth),
      height: Math.round(panelHeight),
      panel: panelName,
      multiplier: qty,
      count: qty,
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

  let door;

  if (orderType === "Door") {
    if (info.unevenCheck) {
      door = unevenSplit();
    } else {
      door = [
        {
          qty: `(${panelsH * panelsW * qty})`,
          measurement: `${fraction(
            Math.round(eval(breakdowns.panel_width) * 16) / 16
          )} x ${fraction(
            Math.round(eval(breakdowns.panel_height) * 16) / 16
          )}`,
          pattern: panelFlat ? "PF" : "PR",
          width: Math.round(eval(breakdowns.panel_width) * 16) / 16,
          height: Math.round(eval(breakdowns.panel_height) * 16) / 16,
          panel: panelName,
          count: panelsH * panelsW * qty,
          multiplier: panelsH * panelsW * qty,
        },
      ];
    }
  } else if (orderType === "DF") {
    if (VERTICAL_GRAIN) {
      door = [
        {
          qty: `(${panelsH * panelsW * qty})`,
          measurement: `${fraction(
            Math.round(eval(breakdowns.panel_width) * 16) / 16
          )} x ${fraction(
            Math.round(eval(breakdowns.panel_height) * 16) / 16
          )}`,
          pattern: panelFlat ? "PF" : "PR",
          width: Math.round(eval(breakdowns.panel_width) * 16) / 16,
          height: Math.round(eval(breakdowns.panel_height) * 16) / 16,
          count: panelsH * panelsW * qty,
          panel: panelName,
        },
      ];
    } else {
      door = [
        {
          qty: `(${panelsH * panelsW * qty})`,
          measurement: `${fraction(
            Math.round(eval(breakdowns.panel_height) * 16) / 16
          )} x ${fraction(Math.round(eval(breakdowns.panel_width) * 16) / 16)}`,
          pattern: panelFlat ? "PF" : "PR",
          width: Math.round(eval(breakdowns.panel_width) * 16) / 16,
          height: Math.round(eval(breakdowns.panel_height) * 16) / 16,
          count: panelsH * panelsW * qty,
          panel: panelName,
        },
      ];
    }
  }

  const doorMulti = {
    qty: qty,
    measurement: `${fraction(
      Math.round(eval(breakdowns.panel_width) * 16) / 16
    )} x ${fraction(Math.round(eval(breakdowns.panel_height) * 16) / 16)}`,
    pattern: panelFlat ? "PF" : "PR",
    width: Math.round(eval(breakdowns.panel_width) * 16) / 16,
    height: Math.round(eval(breakdowns.panel_height) * 16) / 16,
    panel: panelName,
    multiplier: qty,
    count: qty,
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

  if (info.glass_index === 1 || info.glass_index === 2) {
    return doorFunc();
  } else {
    return door;
  }
};
