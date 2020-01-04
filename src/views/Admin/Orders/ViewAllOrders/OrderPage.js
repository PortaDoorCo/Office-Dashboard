import React, { Component } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col
} from 'reactstrap';

import SelectedOrder from './SelectedOrder/SelectedOrder';
import EditSelectedOrder from './SelectedOrder/EditSelectedOrder';
import Invoice from '../../Invoice/Invoice';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateOrder, loadOrders } from '../../../../redux/orders/actions';
import Launch from '@material-ui/icons/Launch';
import Edit from '@material-ui/icons/Edit';
import Dashboard from '@material-ui/icons/Dashboard';
import Description from '@material-ui/icons/Description';
import ArrowBack from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DoorPDF from './PrintOuts/DoorPDF';
import DrawerPDF from './PrintOuts/DrawerPDF';

class OrderPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      orderEdit: false,
      page: [],
      tooltipOpen: false
    };
  }

  breakdown = e => {
    e.preventDefault();
    this.setState({ page: 'breakdowns' });
  };

  invoice = e => {
    e.preventDefault();
    this.setState({ page: 'invoice' });
  };

  close = e => {
    e.preventDefault();
    this.setState({ page: [] });
  };

  editable = () => {
    this.setState({
      edit: !this.state.edit
    });
  };

  toggleTooltip = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  };

  updateOrderProduction = async () => {
    const orderId = this.props.selectedOrder[0].id;
    const order = {
      'status': 'In Production'
    };
    await this.props.updateOrder(orderId, order);
    await this.props.loadOrders();
    await this.props.toggle();
  };

  downloadPDF = () => {
    const data = this.props.selectedOrder[0];

    if (data.orderType === "Door Order") {
      DoorPDF(data);
    } else {
      DrawerPDF(data)
    }
  };

  render() {
    const props = this.props;

   


    if (this.state.page === 'invoice') {
      return (
        <div className="animated noPrint">
          <Modal
            isOpen={props.modal}
            toggle={props.toggle}
            className="modal-lg"
          >
            <ModalHeader toggle={props.toggle}>Order</ModalHeader>
            <ModalBody>
              <Row>
                <Col>
                  <IconButton onClick={props.toggle && this.close}>
                    <ArrowBack style={{ width: '40', height: '40' }} />
                  </IconButton>
                </Col>
                <Col />
                <Col />
              </Row>

              <div>
                <Invoice />
              </div>
            </ModalBody>
            <ModalFooter>
              <IconButton onClick={props.toggle && this.close}>
                <ArrowBack style={{ width: '40', height: '40' }} />
              </IconButton>
            </ModalFooter>
          </Modal>
        </div>
      );
    } else {
      return (
        <div className="animated noPrint resize">
          <Modal
            isOpen={props.modal}
            toggle={props.toggle}
            className="modal-lg"
          >
            <ModalHeader toggle={props.toggle}>Order</ModalHeader>
            <ModalBody>
              {this.props.edit ? (
                <div>
                  <Row>
                    <Col>
                      <IconButton onClick={this.props.editable}>
                        <ArrowBack style={{ width: '40', height: '40' }} />
                      </IconButton>
                    </Col>
                    <Col />
                    <Col />
                  </Row>
                </div>
              ) : (
                  <div>
                    <Row></Row>
                    <Row>
                      <Col>
                        <Tooltip title="Edit" placement="top">
                          <IconButton onClick={this.props.editable}>
                            <Edit style={{ width: '40', height: '40' }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Breakdowns" placement="top">
                          <IconButton onClick={this.downloadPDF}>
                            <Dashboard style={{ width: '40', height: '40' }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Invoice" placement="top">
                          <IconButton onClick={this.invoice}>
                            <Description style={{ width: '40', height: '40' }} />
                          </IconButton>
                        </Tooltip>
                      </Col>
                      <Col />
                      <Col />
                      <Col>
                        <div className="float-right">
                          <div>
                            <strong>Order Status: </strong>{' '}
                            {!this.props.selectedOrder[0] ? (
                              <div />
                            ) : (
                                this.props.selectedOrder[0].status
                              )}
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}
              <div>
                {!this.props.edit ? (
                  <SelectedOrder
                    selectedOrder={props.selectedOrder}
                  // ref={el => (this.componentRef = el)}
                  />
                ) : (
                    <div>
                      <EditSelectedOrder
                        selectedOrder={props.selectedOrder}
                        editable={this.props.editable}
                        toggle={props.toggle}
                      />
                    </div>
                  )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={props.toggle}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    }
  }
}

const mapStateToProps = (state, prop) => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateOrder,
      loadOrders
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderPage);
