import { createSelector } from 'reselect';
import { formValueSelector } from 'redux-form'
import * as math from 'mathjs';
import numQty from 'numeric-quantity';


const leftStileWidth = state => {

  const orders = state.form.Orders;

  if (state.part_list.loadedDesign) {
    if (orders) {
      return state.form.Orders.values.part_list.design.L_STILE_W;
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
};

const rightStileWidth = state => {

  const orders = state.form.Orders;

  if (state.part_list.loadedDesign) {
    if (orders) {
      return state.form.Orders.values.part_list.design.R_STILE_W;
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
};

const leftMillAdd = state => {

  const orders = state.form.Orders;

  if (state.part_list.loadedDesign) {
    if (orders) {
      return state.form.Orders.values.part_list.design.LS_MILL_AD;
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
};

const rightMillAdd = state => {

  const orders = state.form.Orders;

  if (state.part_list.loadedDesign) {
    if (orders) {
      return state.form.Orders.values.part_list.design.RS_MILL_AD;
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
};

const topRailWidth = state => {

  const orders = state.form.Orders;

  if (state.part_list.loadedDesign) {
    if (orders) {
      return state.form.Orders.values.part_list.design.TOP_RAIL_W;
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
};

const botRailWidth = state => {
  const orders = state.form.Orders;
  if (state.part_list.loadedDesign) {
    if (orders) {
      return state.form.Orders.values.part_list.design.BOT_RAIL_W;
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
};

const topRailMillAdd = state => {
  const orders = state.form.Orders;
  if (state.part_list.loadedDesign) {
    if (orders) {
      return state.form.Orders.values.part_list.design.TR_MILL_AD;
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
};

const botRailMillAdd = state => {
  const orders = state.form.Orders;
  if (state.part_list.loadedDesign) {
    if (orders) {
      return state.form.Orders.values.part_list.design.BR_MILL_AD;
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
};

const horizMullWidth = state => {
  const orders = state.form.Orders;
  if (state.part_list.loadedDesign) {
    if (orders) {
      return state.form.Orders.values.part_list.design.H_MULL_WTH;
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
};

const horizMullAdd = state => {
  const orders = state.form.Orders;
  if (state.part_list.loadedDesign) {
    if (orders) {
      return state.form.Orders.values.part_list.design.H_MULL_ADD;
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
};

const vertMullAdd = state => {
  const orders = state.form.Orders;
  if (state.part_list.loadedDesign) {
    if (orders) {
      return state.form.Orders.values.part_list.design.V_MULL_ADD;
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
};

const vertMullWidth = state => {
  const orders = state.form.Orders;
  if (state.part_list.loadedDesign) {
    if (orders) {
      return state.form.Orders.values.part_list.design.V_MULL_WTH;
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
};

const lipAdd = state => {
  const orders = state.form.Orders;
  if (state.part_list.loadedDesign) {
    if (orders) {
      return state.form.Orders.values.part_list.design.S_ADD_LEN;
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
};

const H_Panels = state => {
  const orders = state.form.Orders;
  if (state.part_list.loadedDesign) {
    if (orders) {
      return state.form.Orders.values.part_list.design.NUMHPANELS;
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
};

const W_Panels = state => {
  const orders = state.form.Orders;
  if (state.part_list.loadedDesign) {
    if (orders) {
      return state.form.Orders.values.part_list.design.NUMWPANELS;
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
};


const frameTenon = state => {
  const orders = state.form.Orders;
  if (state.part_list.loadedDesign) {
    if (orders) {
      return state.form.Orders.values.part_list.design.FRAMT;
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
};

const mullTenon = state => {
  const orders = state.form.Orders;
  if (state.part_list.loadedDesign) {
    if (orders) {
      return state.form.Orders.values.part_list.design.MULLT;
    } else {
      return 0;
    }
  }
  else {
    return 0;
  }
};


