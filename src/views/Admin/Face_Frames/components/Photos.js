import React from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import SideBar from '../../../../components/DoorOrders/SideBar';



const CheckoutBox = (props) => {
  return(
    <div>
      {(props.formState && props.formState.part_list) ? (
        props.formState.part_list.map((part, i) => {
          return (
            <div key={i}>
              <Row style={{ height: '100%' }}>
                <Col>

                  <SideBar key={i} i={i} part={part} />

                </Col>
              </Row>
              <Row>
                <Col>

                </Col>
              </Row>
            </div>
          );
        })
      ) : (
        <div />
      )}
    </div>
  );
  
};

export default CheckoutBox;