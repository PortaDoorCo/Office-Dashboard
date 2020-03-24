import React from "react";
// import DoorEdit from './DoorEdit'
import DoorOrder from './DoorOrders/DoorOrders'



class EditSelectedOrder extends React.Component {

  render() {
    
    const { selectedOrder, editable, toggle } = this.props;
    console.log(selectedOrder[0])
    return (
      <div>
        {selectedOrder[0].orderType === "Door Order" ?
          <DoorOrder
            selectedOrder={selectedOrder}
            // editable={editable}
            // toggle={toggle}
          /> :
          <div />
        }



      </div>

    );
  }
}





export default EditSelectedOrder;
