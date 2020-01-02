import { createSelector } from "reselect";
import numQty from "numeric-quantity";

const partListSelector = state => {
  const orders = state.form.EditOrder;

  if (state.part_list.loadedFinish) {
    if (orders) {
      if (!state.form.EditOrder.values.part_list) {
        return [];
      } else {
        return state.form.EditOrder.values.part_list;
      }
    } else {
      return [];
    }
  } else {
    return [];
  }
};

export const itemPriceSelector = createSelector(
  partListSelector,
  parts =>
    parts.map((part, i) => {
      const wood = part.woodtype.PRICE;
      const design = part.design.DESIGNCOST;
      const edge = part.edges.ADDCOST;
      const finish = part.finish.price;
      const hinge = part.hinges.Price;

      const linePrice = part.dimensions.map(i => {
        let widths = numQty(i.width);
        let heights = numQty(i.height);

        const price =
          (((Math.ceil(widths) * Math.ceil(heights)) / 144) * wood +
            (design + edge + finish + hinge)) *
          parseInt(i.qty) || 0;

        if (widths > -1) {
          return price;
        } else {
          return 0;
        }
      });

      return linePrice;
    })
);

export const linePriceSelector = createSelector(
  partListSelector,
  parts =>
    parts.map((part, i) => {
      const wood = part.woodtype.PRICE;
      const design = part.design.DESIGNCOST;
      const edge = part.edges.ADDCOST;
      const finish = part.finish.price;
      const hinge = part.hinges.Price;

      const linePrice = part.dimensions.map(i => {
        let widths = numQty(i.width);
        let heights = numQty(i.height);

        const price =
          (((Math.ceil(widths) * Math.ceil(heights)) / 144) * wood +
            (design + edge + finish + hinge)) *
          parseInt(i.qty) || 0;

        if (widths > -1) {
          return price;
        } else {
          return 0;
        }
      });

      return linePrice;
    })
);

export const subTotalSelector = createSelector(
  linePriceSelector,
  price =>
    price.map(i => {
      return i.reduce((acc, item) => acc + item, 0);
    })
);

export const totalSelector = createSelector(
  subTotalSelector,
  subTotal => subTotal.reduce((acc, item) => acc + item, 0)
);
