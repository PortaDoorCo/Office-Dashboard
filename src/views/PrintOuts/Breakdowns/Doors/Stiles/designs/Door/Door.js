import numQty from 'numeric-quantity';
import Ratio from 'lb-ratio';
import frac2dec from '../../../frac2dec';

const fraction = (num) => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (info, part, breakdowns) => {
  const vMidRail = info.verticalMidRailSize ? info.verticalMidRailSize : 0;
  const hMidRail = info.horizontalMidRailSize ? info.horizontalMidRailSize : 0;

  const top_rail_arch = info?.design?.TOP_RAIL_ADD;
  const btm_rail_arch = info?.design?.BTM_RAIL_ADD;

  let edge_factor =
    info.construction?.value !== 'Miter' && info?.edge?.LIP_FACTOR
      ? info?.edge?.LIP_FACTOR
      : 0;
  let lip_factor =
    info.construction?.value !== 'Miter' && info?.edge?.LIP_FACTOR
      ? info?.edge?.LIP_FACTOR
      : 0;

  const topRail = info.topRail
    ? Math.round(numQty(info.topRail) * 16) / 16 + lip_factor / 2
    : 0;
  const bottomRail = info.bottomRail
    ? Math.round(numQty(info.bottomRail) * 16) / 16 + lip_factor / 2
    : 0;
  const leftStile = info.leftStile
    ? Math.round(numQty(info.leftStile) * 16) / 16 + lip_factor / 2
    : 0;
  const rightStile = info.rightStile
    ? Math.round(numQty(info.rightStile) * 16) / 16 + lip_factor / 2
    : 0;
  const vertMull = Math.round(numQty(vMidRail) * 16) / 16;
  const horizMull = Math.round(numQty(hMidRail) * 16) / 16;
  const panelsH = info.panelsH ? parseInt(info.panelsH) : 1;
  const panelsW = info.panelsW ? parseInt(info.panelsW) : 1;
  const height = Math.round(numQty(info.height) * 16) / 16;
  const width = Math.round(numQty(info.width) * 16) / 16;
  const qty = parseInt(info.qty);
  const item = parseInt(info.item);

  let inset = 0;
  if (info.profile) {
    inset = info.profile?.INSET;
  } else {
    inset = info.design?.INSET;
  }

  const midStileHeight =
    (height -
      topRail -
      bottomRail -
      numQty(info[`unevenSplitInput${0}`]) -
      horizMull * (panelsH - 1)) /
      panelsH +
    inset +
    edge_factor / panelsH;

  const fullMidStileHeight =
    height - topRail - bottomRail + inset + edge_factor;

  const fullMidRailHeight = (i) =>
    numQty(info[`unevenSplitInput${i}`]) - topRail + inset + edge_factor;

  const fullMidRailBottom = () => {
    if (panelsH > 2 && info.unequalMidRails) {
      return (
        height -
        bottomRail -
        numQty(info[`horizontalMidRailSize${panelsH - 2}`]) -
        numQty(info[`unevenSplitInput${panelsH - 2}`]) +
        inset +
        edge_factor
      );
    } else {
      return (
        height -
        bottomRail -
        horizMull -
        numQty(info[`unevenSplitInput${panelsH - 2}`]) +
        inset +
        edge_factor
      );
    }
  };

  const middleMidRail = (i) => {
    if (panelsH > 2 && info.unequalMidRails) {
      return (
        numQty(info[`unevenSplitInput${i}`]) -
        numQty(info[`horizontalMidRailSize${i}`]) -
        fullMidRailHeight(i - 1) -
        topRail +
        inset +
        edge_factor
      );
    } else {
      return (
        numQty(info[`unevenSplitInput${i}`]) -
        horizMull -
        fullMidRailHeight(i - 1) -
        topRail +
        inset +
        edge_factor
      );
    }
  };

  const fullMidRailTop = (i) =>
    numQty(info[`unevenSplitInput${i}`]) - topRail + inset + edge_factor;

  const unEven = [
    ...Array.from(Array(panelsH).keys())
      .slice(1)
      .map((i, v) => {
        if (v === 0) {
          return {
            door_qty: qty,
            qty: `(${qty})`,
            qty_2: qty,
            measurement: `${fraction(
              eval(breakdowns.vertical_mid_rail_width)
            )} x ${fraction(Math.round(fullMidRailTop(v) * 16) / 16)}`,
            width: eval(breakdowns.vertical_mid_rail_width),
            height: fullMidRailTop(v),
            pattern: 'VM',
            razor_pattern: 'V Mull',
            multiplier: qty,
            item: item,
            count: qty,
          };
        } else {
          return {
            door_qty: qty,
            qty: `(${qty})`,
            qty_2: qty,
            measurement: `${fraction(
              eval(breakdowns.vertical_mid_rail_width)
            )} x ${fraction(Math.round(middleMidRail(v) * 16) / 16)}`,
            width: eval(breakdowns.vertical_mid_rail_width),
            height: middleMidRail(v),
            pattern: 'VM',
            razor_pattern: 'V Mull',
            multiplier: qty,
            item: item,
            count: qty,
          };
        }
      }),
  ];

  const convert = (arr) => {
    const res = {};
    arr.forEach((obj) => {
      const key = `${obj.measurement}${obj.height}${obj.multiplier}${obj.panel}${obj.pattern}${obj.qty}${obj.qty2}${obj.width}`;
      if (!res[key]) {
        res[key] = { ...obj, count: 0 };
      }
      res[key].qty = `(${res[key].count + res[key].qty_2})`;
      res[key].qty_2 = res[key].count + res[key].qty_2;
      res[key].count += 1;
    });
    return Object.values(res);
  };

  if (eval(breakdowns.leftStile_width) === eval(breakdowns.rightStile_width)) {
    if ((panelsW > 1 && panelsH > 1) || (panelsW > 1 && panelsH === 1)) {
      if (info.unevenCheck) {
        if (info.fullMidStile) {
          return [
            {
              door_qty: qty,
              qty: `(${qty * 2})`,
              qty_2: qty * 2,
              measurement: `${fraction(
                eval(breakdowns.leftStile_width)
              )} x ${fraction(eval(breakdowns.leftStile_height))}`,
              pattern: 'LR',
              razor_pattern: 'L / R',
              width: eval(breakdowns.leftStile_width),
              height: eval(breakdowns.leftStile_height),
              multiplier: 2,
              item: item,
            },
            {
              door_qty: qty,
              qty: `(${qty * (panelsW - 1)})`,
              qty_2: qty * (panelsW - 1),
              measurement: `${fraction(
                eval(breakdowns.vertical_mid_rail_width)
              )} x ${fraction(Math.round(fullMidStileHeight * 16) / 16)}`,
              width: eval(breakdowns.vertical_mid_rail_width),
              height: fullMidStileHeight,
              pattern: 'VM',
              razor_pattern: 'V Mull',
              multiplier: panelsW - 1,
              item: item,
            },
          ];
        } else {
          const arr = [
            {
              door_qty: qty,
              qty: `(${qty * 2})`,
              qty_2: qty * 2,
              measurement: `${fraction(
                eval(breakdowns.leftStile_width)
              )} x ${fraction(eval(breakdowns.leftStile_height))}`,
              pattern: 'LR',
              razor_pattern: 'L / R',
              width: eval(breakdowns.leftStile_width),
              height: eval(breakdowns.leftStile_height),
              multiplier: 2,
              item: item,
            },
            ...unEven,
            {
              door_qty: qty,
              qty: `(${qty * (panelsW - 1)})`,
              qty_2: qty * (panelsW - 1),
              measurement: `${fraction(
                eval(breakdowns.vertical_mid_rail_width)
              )} x ${fraction(Math.round(fullMidRailBottom() * 16) / 16)}`,
              width: eval(breakdowns.vertical_mid_rail_width),
              height: fullMidRailBottom(),
              pattern: 'VM',
              razor_pattern: 'V Mull',
              multiplier: panelsW - 1,
              item: item,
            },
          ];

          return convert(arr);
        }
      } else {
        return [
          {
            door_qty: qty,
            qty: `(${qty * 2})`,
            qty_2: qty * 2,
            measurement: `${fraction(
              eval(breakdowns.leftStile_width)
            )} x ${fraction(eval(breakdowns.leftStile_height))}`,
            pattern: 'LR',
            razor_pattern: 'L / R',
            width: eval(breakdowns.leftStile_width),
            height: eval(breakdowns.leftStile_height),
            multiplier: 2,
            item: item,
          },
          {
            door_qty: qty,
            qty: `(${
              panelsW > 1
                ? panelsH > 1
                  ? panelsH * qty
                  : (panelsW - 1) * qty
                : (panelsW - 1) * qty
            })`,
            qty_2:
              panelsW > 1
                ? panelsH > 1
                  ? panelsH * qty
                  : (panelsW - 1) * qty
                : (panelsW - 1) * qty,
            measurement: `${fraction(
              eval(breakdowns.vertical_mid_rail_width)
            )} x ${fraction(
              Math.round(eval(breakdowns.vertical_mid_rail_height) * 16) / 16
            )}`,
            width: eval(breakdowns.vertical_mid_rail_width),
            height: eval(breakdowns.vertical_mid_rail_height),
            pattern: 'VM',
            razor_pattern: 'V Mull',
            multiplier:
              panelsW > 1
                ? panelsH > 1
                  ? panelsH * qty
                  : (panelsW - 1) * qty
                : (panelsW - 1) * qty,
            item: item,
          },
        ];
      }
    } else {
      return [
        {
          door_qty: qty,
          qty: `(${qty * 2})`,
          qty_2: qty * 2,
          measurement: `${fraction(
            eval(breakdowns.leftStile_width)
          )} x ${fraction(eval(breakdowns.leftStile_height))}`,
          pattern: 'LR',
          razor_pattern: 'L / R',
          width: eval(breakdowns.leftStile_width),
          height: eval(breakdowns.leftStile_height),
          multiplier: 2,
          item: item,
        },
      ];
    }
  } else {
    if (panelsW > 1) {
      return [
        {
          door_qty: qty,
          qty: `(${qty})`,
          qty_2: qty,
          measurement: `${fraction(
            eval(breakdowns.leftStile_width)
          )} x ${fraction(eval(breakdowns.leftStile_height))}`,
          pattern: 'L',
          razor_pattern: 'L',
          width: eval(breakdowns.leftStile_width),
          height: eval(breakdowns.leftStile_height),
          multiplier: 1,
          item: item,
        },
        {
          door_qty: qty,
          qty: `(${qty})`,
          qty_2: qty,
          measurement: `${fraction(
            eval(breakdowns.rightStile_width)
          )} x ${fraction(eval(breakdowns.rightStile_height))}`,
          pattern: 'R',
          razor_pattern: 'R',
          width: eval(breakdowns.rightStile_width),
          height: eval(breakdowns.rightStile_height),
          multiplier: 1,
          item: item,
        },
        {
          door_qty: qty,
          qty: `(${
            panelsW > 1
              ? panelsH > 1
                ? panelsH * qty
                : (panelsW - 1) * qty
              : (panelsW - 1) * qty
          })`,
          qty_2:
            panelsW > 1
              ? panelsH > 1
                ? panelsH * qty
                : (panelsW - 1) * qty
              : (panelsW - 1) * qty,
          measurement: `${fraction(
            eval(breakdowns.vertical_mid_rail_width)
          )} x ${fraction(
            Math.round(eval(breakdowns.vertical_mid_rail_height) * 16) / 16
          )}`,
          pattern: 'VM',
          razor_pattern: 'V Mull',
          width: eval(breakdowns.vertical_mid_rail_width),
          height: eval(breakdowns.vertical_mid_rail_height),
          multiplier:
            panelsW > 1
              ? panelsH > 1
                ? panelsH * qty
                : (panelsW - 1) * qty
              : (panelsW - 1) * qty,
          item: item,
        },
      ];
    } else {
      return [
        {
          door_qty: qty,
          qty: `(${qty})`,
          qty_2: qty,
          measurement: `${fraction(
            eval(breakdowns.leftStile_width)
          )} x ${fraction(eval(breakdowns.leftStile_height))}`,
          pattern: 'L',
          razor_pattern: 'L',
          width: eval(breakdowns.leftStile_width),
          height: eval(breakdowns.leftStile_height),
          multiplier: 1,
          item: item,
        },
        {
          door_qty: qty,
          qty: `(${qty})`,
          qty_2: qty,
          measurement: `${fraction(
            eval(breakdowns.rightStile_width)
          )} x ${fraction(eval(breakdowns.rightStile_height))}`,
          pattern: 'R',
          razor_pattern: 'R',
          width: eval(breakdowns.rightStile_width),
          height: eval(breakdowns.rightStile_height),
          multiplier: 1,
          item: item,
        },
      ];
    }
  }
};
