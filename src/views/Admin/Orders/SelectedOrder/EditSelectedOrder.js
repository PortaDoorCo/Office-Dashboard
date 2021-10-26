import React from 'react';
// import DoorEdit from './DoorEdit'
import DoorOrder from './DoorOrders/DoorOrders';
import DrawerOrder from './DrawerOrders/DrawerOrder';
import MiscItems from './MiscItems/MiscItemsComponent';
import Mouldings from './Mouldings/MouldingsComponent';
import { connect } from 'react-redux';
import FaceFrame from './FaceFrames/FaceFrame';



class EditSelectedOrder extends React.Component {

  render() {
    
    const { editable, edit, toggle, selectedOrder, toggleTracking, toggleBalance, toggleMiscItems, toggleNotes, toggleFiles } = this.props;

    if(selectedOrder) {
      return (
        <div>
          {selectedOrder.orderType === 'Door Order' ?
            <DoorOrder
              editable={editable}
              edit={edit}
              toggle={toggle}
              toggleTracking={toggleTracking}
              toggleBalance={toggleBalance}
              toggleMiscItems={toggleMiscItems}
              toggleNotes={toggleNotes}
              toggleFiles={toggleFiles}
            />  
            :
            selectedOrder.orderType === 'Misc Items' ?
              <MiscItems
                editable={editable}
                edit={edit}
                toggle={toggle}
                toggleTracking={toggleTracking}
                toggleBalance={toggleBalance}
                toggleMiscItems={toggleMiscItems}
                toggleNotes={toggleNotes}
                toggleFiles={toggleFiles}
              />
              :
              selectedOrder.orderType === 'Mouldings' ?
                <Mouldings
                  editable={editable}
                  edit={edit}
                  toggle={toggle}
                  toggleTracking={toggleTracking}
                  toggleBalance={toggleBalance}
                  toggleMiscItems={toggleMiscItems}
                  toggleNotes={toggleNotes}
                  toggleFiles={toggleFiles}
                />
                :
                selectedOrder.orderType === 'Face Frame' ?
                  <FaceFrame
                    editable={editable}
                    edit={edit}
                    toggle={toggle}
                    toggleTracking={toggleTracking}
                    toggleBalance={toggleBalance}
                    toggleMiscItems={toggleMiscItems}
                    toggleNotes={toggleNotes}
                    toggleFiles={toggleFiles}
                  />
                  :

                  <DrawerOrder
                    editable={editable}
                    edit={edit}
                    toggle={toggle}
                    toggleTracking={toggleTracking}
                    toggleBalance={toggleBalance}
                    toggleMiscItems={toggleMiscItems}
                    toggleNotes={toggleNotes}
                    toggleFiles={toggleFiles}
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

