import numQty from 'numeric-quantity';
export default (info, part) => {
  const item = parseInt(info.item);

  return info.Stiles?.map((i) => {
    return {
      qty: `(${i.qty})`,
      qty_2: parseInt(i.qty),
      measurement: `${i.width} x ${i.length}`,
      pattern: i.position?.NAME,
      razor_pattern: i.position?.razor_pattern,
      width: Math.round(numQty(i.width) * 16) / 16,
      height: Math.round(numQty(i.length) * 16) / 16,
      multiplier: 1,
      item: item,
    };
  });
};
