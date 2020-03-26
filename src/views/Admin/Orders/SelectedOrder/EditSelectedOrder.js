import React from "react";
// import DoorEdit from './DoorEdit'
import DoorOrder from './DoorOrders/DoorOrders'



class EditSelectedOrder extends React.Component {

  render() {
    
    const { selectedOrder, editable, edit, toggle } = this.props;
    // console.log('selected order', selectedOrder[0])

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
            <div />
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
