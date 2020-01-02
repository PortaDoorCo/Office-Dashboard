import { createSelector } from 'reselect';
import { formValueSelector } from 'redux-form'
import * as math from 'mathjs';
import numQty from 'numeric-quantity';


const woodtypeSelector = state => {

  const orders = state.form.Orders;

  if (state.part_list.loadedWoodtype) {
    if (orders) {
      return state.form.Orders.values.part_list.woodtype.PRICE;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};





const designSelector = state => {

  const orders = state.form.Orders;

  if (state.part_list.loadedDesign) {
    if (orders) {
      return state.form.Orders.values.part_list.design.DESIGNCOST;
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
};

const edgeSelector = state => {

  const orders = state.form.Orders;



  if (state.part_list.loadedEdge) {
    if (orders) {
      return state.form.Orders.values.part_list.edges.ADDCOST;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};



const finishSelector = state => {

  const orders = state.form.Orders;

  if (state.part_list.loadedFinish) {
    if (orders) {
      return state.form.Orders.values.part_list.finish.price;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

const hingeSelector = state => {

  const orders = state.form.Orders;

  if (state.part_list.loadedHinges) {
    if (orders) {
      return state.form.Orders.values.part_list.hinges.Price;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};



const dimensions = state => {

  const orders = state.form.Orders;


  if (state.part_list.loadedFinish) {
    if (orders) {
      if (!state.form.Orders.values.dimensions.table) {
        return [];
      } else {
        return state.form.Orders.values.dimensions.table;
      }
    } else {
      return [];
    }
  } else {
    return [];
  }

};

const subTotals = state => {

  if (state.Orders.subTotal) {
    return state.Orders.subTotal;
  } else {
    return 0;
  }
};



export const linePriceSelector = createSelector(
  [woodtypeSelector,
    designSelector,
    edgeSelector,
    finishSelector,
    hingeSelector,
    dimensions],
  (wood, design, edge, finish, hinges, dimension) => dimension.map(i => {

    console.log("Wood " + wood, "design " + design, "edge " + edge, "finish " + finish, "dimension " + JSON.stringify(dimension))

    let widths = numQty(i.width);
    let heights = numQty(i.height);
    const price = (((Math.ceil(widths) * (Math.ceil(heights)) / 144) * wood + (design + edge + finish + hinges)) * parseInt(i.qty) || 0);

    if (widths > -1) {
      return (
        price
      );
    } else {
      return 0;
    }

  })
);



export const subTotalSelector = createSelector(
  linePriceSelector,
  (price) => price.reduce((acc, item) => acc + item, 0)
);

export const totalSelector = createSelector(
  subTotals,
  (subTotal) => subTotal.reduce((acc, item) => acc + item, 0)
);
