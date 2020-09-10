import React from 'react';
// import DoorEdit from './DoorEdit'
import DoorOrder from './DoorOrders/DoorOrders';
import DrawerOrder from './DrawerOrders/DrawerOrder';
import MiscItems from './MiscItems/MiscItemsComponent';
import { connect } from 'react-redux';



class EditSelectedOrder extends React.Component {

  render() {
    
    const { editable, edit, toggle, selectedOrder } = this.props;

    if(selectedOrder) {
      return (
        <div>
          {selectedOrder.orderType === 'Door Order' ?
            <DoorOrder
              editable={editable}
              edit={edit}
              toggle={toggle}
            />  
            :
            selectedOrder.orderType === 'Misc Items' ?
              <MiscItems
                editable={editable}
                edit={edit}
                toggle={toggle}
              />
              :
              <DrawerOrder

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
      );
    }
    
  }
}





const mapStateToProps = (state, prop) => ({
  selectedOrder: state.Orders.selectedOrder

});



export default connect(
  mapStateToProps,
  null
)(EditSelectedOrder);

