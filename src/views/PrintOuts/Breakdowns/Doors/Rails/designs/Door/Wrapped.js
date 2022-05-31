import Ratio from 'lb-ratio';
import frac2dec from '../../../frac2dec';
import numQty from 'numeric-quantity';
import _ from 'lodash';

const fraction = (num) => {
  let fraction = Ratio.parse(num).toQuantityOf(2, 3, 4, 8, 16);
  return fraction.toLocaleString();
};

export default (info, part, breakdowns) => {
  const vMidRail = info.verticalMidRailSize ? info.verticalMidRailSize : 0;
  const hMidRail = info.horizontalMidRailSize ? info.horizontalMidRailSize : 0;

  let edge_factor = 0.125;
  let lip_factor = 0.125;

  const topRail = info.wrapWidth
    ? Math.round(numQty(info.wrapWidth) * 16) / 16 + lip_factor / 2
    : 0;
  const bottomRail = info.wrapWidth
    ? Math.round(numQty(info.wrapWidth) * 16) / 16 + lip_factor / 2
    : 0;
  const leftStile = info.wrapWidth
    ? Math.round(numQty(info.wrapWidth) * 16) / 16 + lip_factor / 2
    : 0;
  const rightStile = info.wrapWidth
    ? Math.round(numQty(info.wrapWidth) * 16) / 16 + lip_factor / 2
    : 0;
  const vertMull = Math.round(numQty(vMidRail) * 16) / 16;
  const horizMull = Math.round(numQty(hMidRail) * 16) / 16;
  const panelsH = parseInt(info.panelsH);
  const panelsW = parseInt(info.panelsW);
  const height = Math.round(numQty(info.height) * 16) / 16;
  const width = Math.round(numQty(info.width) * 16) / 16;
  const qty = parseInt(info.qty);
  const item = parseInt(info.item);

  let inset = 0;

  const unequalMidRails = info[`unequalMidRails`];

  console.log({ info });

  const unEven = [
    ...Array.from(Array(panelsH).keys())
      .slice(1)
      .map((i, v) => {
        console.log({ i });
        if (v === 0) {
          return {
            qty: `(${qty})`,
            qty_2: qty,
            measurement: `${fraction(
              eval(breakdowns.horizontal_mid_rail_width)
            )} x ${fraction(
              Math.round(eval(breakdowns.horizontal_mid_rail_height) * 16) / 16
            )}`,
            pattern: 'HM',
            razor_pattern: 'H Mull',
            width: eval(breakdowns.horizontal_mid_rail_width),
            height: eval(breakdowns.horizontal_mid_rail_height),
            multiplier: 1,
            item: item,
          };
        } else {
          return {
            qty: `(${qty})`,
            qty_2: qty,
            measurement: `${fraction(
              eval(numQty(info[`horizontalMidRailSize${v}`]))
            )} x ${fraction(
              Math.round(eval(breakdowns.horizontal_mid_rail_height) * 16) / 16
            )}`,
            pattern: 'HM',
            razor_pattern: 'H Mull',
            width: eval(numQty(info[`horizontalMidRailSize${v}`])),
            height: eval(breakdowns.horizontal_mid_rail_height),
            multiplier: 1,
            item: item,
          };
        }
      }),
  ];

  console.log({ unEven });

  if (eval(breakdowns.topRail_width) === eval(breakdowns.bottomRail_width)) {
    if ((panelsW > 1 && panelsH > 1) || (panelsH > 1 && panelsW === 1)) {
      return _.flatten([
        {
          qty: `(${qty * 2})`,
          qty_2: qty * 2,
          measurement: `${fraction(topRail)} x ${fraction(
            Math.round(eval(breakdowns.topRail_height) * 16) / 16
          )}`,
          pattern: 'TB',
          razor_pattern: 'T / B',
          width: topRail,
          height: eval(breakdowns.topRail_height),
          multiplier: 2,
          item: item,
        },
        unequalMidRails
          ? unEven.map((i) => {
              console.log({ i });
              return i;
            })
          : {
              qty: `(${(panelsH - 1) * qty})`,
              qty_2: (panelsH - 1) * qty,
              measurement: `${fraction(
                eval(breakdowns.horizontal_mid_rail_width)
              )} x ${fraction(
                Math.round(eval(breakdowns.horizontal_mid_rail_height) * 16) /
                  16
              )}`,
              pattern: 'HM',
              razor_pattern: 'H Mull',
              width: eval(breakdowns.horizontal_mid_rail_width),
              height: eval(breakdowns.horizontal_mid_rail_height),
              multiplier: panelsH - 1,
              item: item,
            },
      ]);
    } else {
      return [
        {
          qty: `(${qty * 2})`,
          qty_2: qty * 2,
          measurement: `${fraction(topRail)} x ${fraction(
            Math.round(eval(breakdowns.topRail_height) * 16) / 16
          )}`,
          pattern: 'TB',
          razor_pattern: 'T / B',
          width: topRail,
          height: eval(breakdowns.topRail_height),
          multiplier: 2,
          item: item,
        },
      ];
    }
  } else {
    if (panelsH > 1) {
      return _.flattenDeep([
        {
          qty: `(${qty})`,
          qty_2: qty,
          measurement: `${fraction(topRail)} x ${fraction(
            Math.round(eval(breakdowns.topRail_height) * 16) / 16
          )}`,
          pattern: 'T',
          razor_pattern: 'T',
          width: topRail,
          height: eval(breakdowns.topRail_height),
          multiplier: 1,
          item: item,
        },
        {
          qty: `(${qty})`,
          qty_2: qty,
          measurement: `${fraction(bottomRail)} x ${fraction(
            Math.round(eval(breakdowns.bottomRail_height) * 16) / 16
          )}`,
          pattern: 'B',
          razor_pattern: 'B',
          width: bottomRail,
          height: eval(breakdowns.bottomRail_height),
          multiplier: 1,
          item: item,
        },
        unequalMidRails
          ? unEven.map((i) => {
              console.log({ i });
              return i;
            })
          : {
              qty: `(${(panelsH - 1) * qty})`,
              qty_2: (panelsH - 1) * qty,
              measurement: `${fraction(
                eval(breakdowns.horizontal_mid_rail_width)
              )} x ${fraction(
                Math.round(eval(breakdowns.horizontal_mid_rail_height) * 16) /
                  16
              )}`,
              pattern: 'HM',
              razor_pattern: 'H Mull',
              width: eval(breakdowns.horizontal_mid_rail_width),
              height: eval(breakdowns.horizontal_mid_rail_height),
              multiplier: panelsH - 1,
              item: item,
            },
      ]);
    } else {
      return [
        {
          qty: `(${qty})`,
          qty_2: qty,
          measurement: `${fraction(topRail)} x ${fraction(
            Math.round(eval(breakdowns.topRail_height) * 16) / 16
          )}`,
          pattern: 'T',
          razor_pattern: 'T',
          width: topRail,
          height: eval(breakdowns.topRail_height),
          multiplier: 1,
          item: item,
        },
        {
          qty: `(${qty})`,
          qty_2: qty,
          measurement: `${fraction(bottomRail)} x ${fraction(
            Math.round(eval(breakdowns.bottomRail_height) * 16) / 16
          )}`,
          pattern: 'B',
          razor_pattern: 'B',
          width: bottomRail,
          height: eval(breakdowns.bottomRail_height),
          multiplier: 1,
          item: item,
        },
      ];
    }
  }
};