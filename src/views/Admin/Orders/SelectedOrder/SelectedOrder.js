import React from "react";

import DoorSelect from './components/DoorOrder/DoorSelect'
import DrawerSelect from './components/DrawerOrder/DrawerSelect'

class SelectedOrder extends React.Component {


  render() {
    const props = this.props;

    const order = props.selectedOrder[0]

    // const company = order.CompanyName;

 

    
    return (
      <div>
        {order ? <div>
          {order.orderType === "Door Order" ? 
        <DoorSelect
          order={order}
        />
        : <DrawerSelect 
            order={order} />
      }
        </div> : <div />}
        
      </div>
    )
    

  }
}



export default SelectedOrder
