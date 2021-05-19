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

  const top_rail_add =
    part && part.mt_df_design && part.mt_df_design.TOP_RAIL_ADD;
  const btm_rail_add =
    part && part.mt_df_design && part.mt_df_design.BTM_RAIL_ADD;

  const topRail = numQty(info.topRail) + part.edge.LIP_FACTOR / 2;
  const bottomRail = numQty(info.bottomRail) + part.edge.LIP_FACTOR / 2;
  const leftStile = numQty(info.leftStile) + part.edge.LIP_FACTOR / 2;
  const rightStile = numQty(info.rightStile) + part.edge.LIP_FACTOR / 2;
  const vertMull = numQty(vMidRail);
  const horizMull = numQty(hMidRail);
  const panelsH = parseInt(info.panelsH);
  const panelsW = parseInt(info.panelsW);
  const height = numQty(info.height);
  const width = numQty(info.width);
  const qty = parseInt(info.qty);

  const lites = part.lite ? part.lite.NAME : "";

  const edge_factor = part.edge.LIP_FACTOR;
  const panel_factor = part.panel.PANEL_FACTOR;

  const VERTICAL_GRAIN = part.VERTICAL_GRAIN;

  const panelName = part.panel?.NAME;

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

  let door;

  const glassDoor = (index) => {
    const lite = info[`lite_${index}`]?.NAME;
    return {
      qty: qty,
      measurement: `${lite !== "Glass" ?  lite : ""}`,
      pattern: "",
      width: 0,
      height: 0,
      panel: "Glass"
    };
  };

  const glassOnlyDoor = {
    qty: "",
    measurement: "GLASS",
    pattern: "",
    width: 0,
    height: 0,
    panel: "Glass"
  };

  if (VERTICAL_GRAIN) {
    door = [
      {
        qty: `(${panelsH * panelsW * qty})`,
        measurement: `${fraction(
          Math.round(eval(breakdowns.panel_width) * 16) / 16
        )} x ${fraction(Math.round(eval(breakdowns.panel_height) * 16) / 16)}`,
        pattern: part && part.panel && part.panel.Flat ? "PF" : "PR",
        width: Math.round(eval(breakdowns.panel_width) * 16) / 16,
        height: Math.round(eval(breakdowns.panel_height) * 16) / 16,
        panel: panelName
      },
    ];
  } else {
    door = [
      {
        qty: `(${panelsH * panelsW * qty})`,
        measurement: `${fraction(
          Math.round(eval(breakdowns.panel_height) * 16) / 16
        )} x ${fraction(Math.round(eval(breakdowns.panel_width) * 16) / 16)}`,
        pattern: part && part.panel && part.panel.Flat ? "PF" : "PR",
        width: Math.round(eval(breakdowns.panel_width) * 16) / 16,
        height: Math.round(eval(breakdowns.panel_height) * 16) / 16,
        panel: panelName
      },
    ];
  }

  const doorMulti = {
    qty: qty,
    measurement: `${fraction(
      Math.round(eval(breakdowns.panel_width) * 16) / 16
    )} x ${fraction(Math.round(eval(breakdowns.panel_height) * 16) / 16)}`,
    pattern: part && part.panel && part.panel.Flat ? "PF" : "PR",
    width: Math.round(eval(breakdowns.panel_width) * 16) / 16,
    height: Math.round(eval(breakdowns.panel_height) * 16) / 16,
    panel: panelName
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
              measurement: `${fraction(panelWidth)} x ${fraction(
                unevenSplitInput(v)
              )}`,
              pattern: part && part.panel && part.panel.Flat ? "PF" : "PR",
              width: Math.round(panelWidth),
              height: Math.round(unevenSplitInput(v)),
              panel: panelName
            };
          }
        }),
    ];

    const bottom = {
      qty: `(${qty})`,
      measurement: `${fraction(panelWidth)} x ${fraction(panelHeight)}`,
      pattern: part && part.panel && part.panel.Flat ? "PF" : "PR",
      width: Math.round(panelWidth),
      height: Math.round(panelHeight),
      panel: panelName
    };

    if (glassCheck(panelsH - 1)) {
      return [...unEven, glassDoor(panelsH)];
    } else {
      return [...unEven, bottom];
    }
  };

  const doorFunc = () => {
    console.log({ check_this: unevenSplit() });

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

    console.log({ arr });

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
