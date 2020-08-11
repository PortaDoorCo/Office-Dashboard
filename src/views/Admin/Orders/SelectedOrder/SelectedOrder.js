import React from 'react';

import DoorSelect from './components/DoorOrder/DoorSelect';
import DrawerSelect from './components/DrawerOrder/DrawerSelect';

class SelectedOrder extends React.Component {


  render() {
    const { selectedOrder } = this.props;

    const order = selectedOrder;
<<<<<<< HEAD
=======

    // const company = order.CompanyName;



>>>>>>> staging

    return (
      <div>
        {order ? <div>
          {order.orderType === 'Door Order' ?
            <DoorSelect
              order={order}
            />
            : <DrawerSelect
              order={order} />
          }
        </div> : <div />}

      </div>
    );


  }
}



export default SelectedOrder;
