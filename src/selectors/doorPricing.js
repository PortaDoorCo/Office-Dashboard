import { createSelector } from "reselect";
import numQty from "numeric-quantity";

const partListSelector = state => {
  const orders = state.form.DoorOrder;

    if (orders) {
      if ((!state.form.DoorOrder.values && !state.form.DoorOrder.values.part_list)) {
        return [];
      } else {
        return state.form.DoorOrder.values.part_list;
      }
    } else {
      return [];
    }
  
};

const taxRate = state => {
  const orders = state.form.DoorOrder;
  if (state.part_list.loadedFinish) {
    if (orders) {
      if (!orders.values.job_info) {
        return [];
      } else {
        return state.form.DoorOrder.values.job_info.customer.TaxRate;
      }
    } else {
      return [];
    }
  } else {
    return [];
  }
};


export const itemPriceSelector = createSelector(
  [partListSelector],
  (parts) =>
    parts.map((part, index) => {
      const wood = part.woodtype ? part.woodtype.PRICE : 0;
      const design = part.design ? part.design.DESIGNCOST : 0;
      const edge = part.edges ? part.edges.ADDCOST : 0;
      const hinge = part.hinges ? part.hinges.Price : 0;
      let miscItems = part.miscItems ? part.miscItems.map(i => { return i.Price}) : []
      let miscItemsPrice = (miscItems.reduce((acc, item) => acc + item, 0))
    
      console.log(miscItemsPrice)

      if (part.dimensions) {
        const linePrice = part.dimensions.map(i => {
          let widths = numQty(i.width);
          let heights = numQty(i.height);
          let lites = i.lites ? i.lites.addcost : 0

          const price =
            (((Math.ceil(widths) * Math.ceil(heights)) / 144) * wood +
              (design + edge + miscItemsPrice + hinge + lites)) || 0;

          if (heights > -1) {
            return price;
          } else {
            return 0;
          }
        });
        return linePrice;
      } else {
        return 0;
      }
    })
);

export const linePriceSelector = createSelector(
  [partListSelector],
  (parts) =>
    parts.map((part, index) => {
      const wood = part.woodtype ? part.woodtype.PRICE : 0;
      const design = part.design ? part.design.DESIGNCOST : 0;
      const edge = part.edges ? part.edges.ADDCOST : 0;
      const hinge = part.hinges ? part.hinges.Price : 0;
      let miscItems = part.miscItems ? part.miscItems.map(i => { return i.Price}) : []
      let miscItemsPrice = (miscItems.reduce((acc, item) => acc + item, 0))


      if (part.dimensions) {
        const linePrice = part.dimensions.map(i => {
          let widths = numQty(i.width);
          let heights = numQty(i.height);
          let lites = i.lites ? i.lites.addcost : 0

          const price =
            (((Math.ceil(widths) * Math.ceil(heights)) / 144) * wood +
              (design + edge + miscItemsPrice + hinge + lites)) *
            parseInt(i.qty) || 0;

          if (heights > -1) {
            return price;
          } else {
            return 0;
          }
        });
        return linePrice;
      } else {
        return 0;
      }
    })
);

export const addPriceSelector = createSelector(
  [partListSelector],
  (parts) =>
    parts.map((part, index) => {
      if (part.addPrice) {
        return parseFloat(part.addPrice);
      } else {
        return 0;
      }
    })
);


export const subTotalSelector = createSelector(
  [linePriceSelector, addPriceSelector],
  (prices, add) =>
    prices.map((i, index) => {
      if (i) {
        let price = parseFloat(i.reduce((acc, item) => acc + item, 0))
        let sum = price += add[index]
        return sum
      } else {
        return 0;
      }
    })
);

export const taxSelector = createSelector(
  [subTotalSelector, taxRate],
  
  (subTotal, tax) => subTotal.reduce((acc, item) => acc + item, 0) * tax
);

export const totalSelector = createSelector(
  [subTotalSelector, taxSelector],
  (subTotal, tax) => subTotal.reduce((acc, item) => acc + item, 0) + tax
);

