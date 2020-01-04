import React from "react";
import DoorEdit from './DoorEdit'
import DrawerEdit from './DrawerEdit'



class EditSelectedOrder extends React.Component {

  render() {
    
    const { selectedOrder, editable, toggle } = this.props;

    return (
      <div>
        {selectedOrder[0].orderType === "Door Order" ?
          <DoorEdit
            selectedOrder={selectedOrder}
            editable={editable}
            toggle={toggle}
          /> :
          <DrawerEdit
            selectedOrder={selectedOrder}
            editable={editable}
            toggle={toggle}
          />
        }



      </div>

    );
  }
}





export default EditSelectedOrder;
