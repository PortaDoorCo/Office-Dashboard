import { createSelector } from 'reselect';
import { createObjectSelector } from 'reselect-map';
import { formValueSelector } from 'redux-form';
import * as math from 'mathjs';
import numQty from 'numeric-quantity';

const partListSelector = state => {
  const orders = state.form.Orders;

  if (state.part_list.loadedFinish) {
    if (orders) {
      if (!state.form.Orders.values.part_list) {
        return [];
      } else {
        return state.form.Orders.values.part_list;
      }
    } else {
      return [];
    }
  } else {
    return [];
  }
};

export const partSelector = createSelector(
  [partListSelector],
  parts =>
    parts.map((part, index) => {
      const wood = part.woodtype.PRICE;
      const design = part.design.DESIGNCOST;
      const edge = part.edges.ADDCOST;
      const finish = part.finish.price;
      const hinge = part.hinges.Price;

 
    })
);
