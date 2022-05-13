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

  const top_rail_arch = info?.design?.TOP_RAIL_ADD
    ? info?.design?.TOP_RAIL_ADD
    : 0;
  const btm_rail_arch = info?.design?.BTM_RAIL_ADD
    ? info?.design?.BTM_RAIL_ADD
    : 0;

  let edge_factor = 0.125;
  let lip_factor = 0.125;

  const topRail = info.topRail
    ? Math.round(numQty(info.topRail) * 16) / 16 +
      lip_factor / 2 -
      top_rail_arch
    : 0;
  const bottomRail = info.bottomRail
    ? Math.round(numQty(info.bottomRail) * 16) / 16 +
      lip_factor / 2 -
      btm_rail_arch
    : 0;
  const leftStile = info.leftStile
    ? Math.round(numQty(info.leftStile) * 16) / 16 + lip_factor / 2
    : 0;
  const rightStile = info.rightStile
    ? Math.round(numQty(info.rightStile) * 16) / 16 + lip_factor / 2
    : 0;
  const vertMull = Math.round(numQty(vMidRail) * 16) / 16;
  const horizMull = Math.round(numQty(hMidRail) * 16) / 16;
  const panelsH = parseInt(info.panelsH) > 1 ? parseInt(info.panelsH) : 1;
  const panelsW = parseInt(info.panelsW) > 1 ? parseInt(info.panelsW) : 1;
  const height = Math.round(numQty(info.height) * 16) / 16;
  const width = Math.round(numQty(info.width) * 16) / 16;
  const qty = parseInt(info.qty);

  const orderType = info?.orderType?.value
    ? info.orderType?.value
    : part?.orderType?.value;

  let inset = 0;

  const lites = info.lite ? info.lite.NAME : '';
  const panel_factor = info?.panel?.PANEL_FACTOR;

  const panelName = info?.panel?.NAME ? info?.panel?.NAME : part?.panel?.NAME;
  const panelFlat = info?.panel?.Flat ? info?.panel?.Flat : part?.panel?.Flat;

  const VERTICAL_GRAIN = info.VERTICAL_GRAIN;

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
      measurement: `${lite !== 'Glass' ? lite : ''}`,
      pattern: 'GL',
      width: 0,
      height: 0,
      panel: 'Glass',
      count: 0,
      multiplier: qty,
    };
  };

  const glassOnlyDoor = {
    qty: '',
    measurement: 'GLASS',
    pattern: '',
    width: 0,
    height: 0,
    panel: 'Glass',
    multiplier: qty,
  };

  const unevenSplit = () => {
    const panelWidth =
      (width - leftStile - rightStile - vertMull * (panelsW - 1)) / panelsW;

    const panelHeight = (v) => {
      if (v < 3) {
        return (
          height -
          bottomRail -
          numQty(info[`unevenSplitInput${0}`]) -
          horizMull * (panelsH - 1) +
          panel_factor +
          lip_factor / 2
        );
      } else {
        if (info[`unequalMidRails`]) {
          return (
            height -
            bottomRail -
            numQty(info[`unevenSplitInput${v - 2}`]) -
            numQty(info[`horizontalMidRailSize${v - 2}`]) +
            panel_factor +
            lip_factor / 2
          );
        } else {
          return (
            height -
            bottomRail -
            numQty(info[`unevenSplitInput${v - 2}`]) -
            horizMull * (panelsH - 1) +
            panel_factor +
            lip_factor / 2
          );
        }
      }
    };

    let panelTotal = 0;

    const unevenSplitInput = (v) => {
      console.log({ v });

      let arr = new Array(v).fill('').map((_, i) => i + 1);

      console.log({ arr });

      let mullions = [];

      const a = arr.map((i, index) => {
        if (!info[`unequalMidRails`]) {
          console.log('hereeee');
          mullions.push(horizMull);
        } else {
          if (index === 0) {
            mullions.push(horizMull);
          }

          console.log({ index });
          console.log({ HRail: numQty(info[`horizontalMidRailSize${v}`]) });

          if (
            index === v - 1 &&
            !isNaN(numQty(info[`horizontalMidRailSize${v - 1}`]))
          ) {
            return mullions.push(numQty(info[`horizontalMidRailSize${v - 1}`]));
          } else {
            return 0;
          }
        }
      });

      console.log({ mullions });

      const mullionTotal = mullions?.reduce((acc, item) => acc + item, 0);

      const panel =
        numQty(info[`unevenSplitInput${v}`]) -
        topRail -
        panelTotal -
        mullionTotal +
        panel_factor * (v + 1) +
        lip_factor / 2;

      console.log({ panel });
      console.log({ panelTotal });
      console.log({ mullionTotal: mullionTotal });

      panelTotal += panel;

      return panel;
    };

    const glassCheck = (v) => info[`glass_check_${v}`];

    const unEven = [
      ...Array.from(Array(panelsH).keys())
        .slice(1)
        .map((i, v) => {
          if (glassCheck(v)) {
            return glassDoor(v);
          } else {
            const panelHeight = unevenSplitInput(v);
            return {
              qty: `(${qty})`,
              qty2: qty,
              measurement: `${fraction(
                Math.round(eval(breakdowns.panel_width) * 16) / 16
              )} x ${fraction(panelHeight)}`,
              pattern: panelFlat ? 'PF' : 'PR',
              width: Math.round(eval(breakdowns.panel_width) * 16) / 16,
              height: panelHeight,
              panel: panelName,
              multiplier: qty,
              count: qty,
            };
          }
        }),
    ];

    const bottom = {
      qty: `(${qty})`,
      qty2: qty,
      measurement: `${fraction(
        Math.round(eval(breakdowns.panel_width) * 16) / 16
      )} x ${fraction(panelHeight(parseInt(panelsH)))}`,
      pattern: panelFlat ? 'PF' : 'PR',
      width: Math.round(eval(breakdowns.panel_width) * 16) / 16,
      height: panelHeight(parseInt(panelsH)),
      panel: panelName,
      multiplier: qty,
      count: qty,
    };

    const unevenDoor = [...unEven, bottom];

    console.log({ unevenDoor });

    const convert = (arr) => {
      const res = {};
      arr.forEach((obj) => {
        const key = `${obj.measurement}${obj.height}${obj.multiplier}${obj.panel}${obj.pattern}${obj.qty}${obj.qty2}${obj.width}`;
        if (!res[key]) {
          res[key] = { ...obj, count: 0 };
        }
        res[key].qty = `(${res[key].count + res[key].qty2})`;
        res[key].qty2 = res[key].count + res[key].qty2;
        res[key].count += 1;
      });
      return Object.values(res);
    };

    console.log({ convert: convert(unevenDoor) });

    if (glassCheck(panelsH - 1)) {
      return [
        ...unEven,
        glassDoor(panelsH - 1), // <-------Needs Testing
      ];
    } else {
      return convert(unevenDoor);
    }
  };

  let door;

  if (orderType === 'Door') {
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
          pattern: panelFlat ? 'PF' : 'PR',
          width: Math.round(eval(breakdowns.panel_width) * 16) / 16,
          height: Math.round(eval(breakdowns.panel_height) * 16) / 16,
          panel: panelName,
          count: panelsH * panelsW * qty,
          multiplier: panelsH * panelsW * qty,
        },
      ];
    }
  } else if (orderType === 'DF') {
    if (VERTICAL_GRAIN) {
      door = [
        {
          qty: `(${panelsH * panelsW * qty})`,
          measurement: `${fraction(
            Math.round(eval(breakdowns.panel_width) * 16) / 16
          )} x ${fraction(
            Math.round(eval(breakdowns.panel_height) * 16) / 16
          )}`,
          pattern: panelFlat ? 'PF' : 'PR',
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
          pattern: panelFlat ? 'PF' : 'PR',
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
    pattern: panelFlat ? 'PF' : 'PR',
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
