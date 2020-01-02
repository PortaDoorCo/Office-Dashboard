import React from "react";
import DoorEdit from './DoorEdit'
import DrawerEdit from './DrawerEdit'



class EditSelectedOrder extends React.Component {

  render() {
    console.log(this.props.selectedOrder)
    const { selectedOrder, editable, toggle } = this.props;

    console.log(selectedOrder)
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
