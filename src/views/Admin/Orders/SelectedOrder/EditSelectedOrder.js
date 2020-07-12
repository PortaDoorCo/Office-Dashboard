import React from "react";
// import DoorEdit from './DoorEdit'
import DoorOrder from './DoorOrders/DoorOrders'
import DrawerOrder from './DrawerOrders/DrawerOrder'



class EditSelectedOrder extends React.Component {

  render() {
    
    const { selectedOrder, editable, edit, toggle } = this.props;


    if(selectedOrder[0]) {
      return (
        <div>
          {selectedOrder[0].orderType === "Door Order" ?
            <DoorOrder
              selectedOrder={selectedOrder}
              editable={editable}
              edit={edit}
              toggle={toggle}
            /> :
            <DrawerOrder
              selectedOrder={selectedOrder}
              editable={editable}
              edit={edit}
              toggle={toggle}
            />
          }
        </div>
  
      );
    } else {
      return (
        <div />
      )
    }
    
  }
}





export default EditSelectedOrder;
