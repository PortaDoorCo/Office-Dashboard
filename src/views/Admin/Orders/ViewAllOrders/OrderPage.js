import React, { Component } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
  CardBody,
  Card,
  Table,
  Collapse
} from 'reactstrap';
// import SelectedOrder from './SelectedOrder/SelectedOrder';
import EditSelectedOrder from './SelectedOrder/EditSelectedOrder';
import Invoice from '../../Invoice/Invoice';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateOrder, loadOrders, deleteOrder } from '../../../../redux/orders/actions';
import Edit from '@material-ui/icons/Edit';
import Print from '@material-ui/icons/Print';
import Attachment from '@material-ui/icons/Attachment';
import List from '@material-ui/icons/List';
import ArrowBack from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import DoorPDF from './PrintOuts/Pages/Door/DoorPDF';
import DrawerPDF from './PrintOuts/Pages/Drawer/DrawerPDF';
import AssemblyListPDF from './PrintOuts/Pages/Door/AssemblyPDF';
import StilesPDF from './PrintOuts/Pages/Door/StilesPDF';
import RailsPDF from './PrintOuts/Pages/Door/RailsPDF';
import PanelsPDF from './PrintOuts/Pages/Door/PanelsPDF';
import MaterialsPDF from './PrintOuts/Pages/Door/MaterialsPDF';
import QCPDF from './PrintOuts/Pages/Door/QCPDF';
import InvoicePDF from './PrintOuts/Pages/Door/InvoicePDF';

import Select from 'react-select';
import ProfilesPDF from './PrintOuts/Pages/Door/ProfilesPDF';
import moment from 'moment'


import AcknowledgementPDF from './PrintOuts/Pages/Door/AcknowledgementPDF';
import DrawerAcnowledgementPDF from './PrintOuts/Pages/Drawer/AcknowledgementPDF';
import DrawerInvoicePDF from './PrintOuts/Pages/Drawer/InvoicePDF';
import DrawerAssemblyListPDF from './PrintOuts/Pages/Drawer/AssemblyListPDF'
import DrawerBottomsPDF from './PrintOuts/Pages/Drawer/BottomsPDF'
import DrawerSidesPDF from './PrintOuts/Pages/Drawer/SidesPDF'
import Cookies from "js-cookie";

const cookie = Cookies.get("jwt");




const toDataUrl = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
};





class OrderPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      orderEdit: false,
      page: [],
      tooltipOpen: false,
      selectedOption: [],
      edgePhoto: null,
      trackingOpen: false,
      filesOpen: false,
      deleteModal: false
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

  toggleTracking = () => this.setState({
    trackingOpen: !this.state.trackingOpen
  })

  toggleFiles = () => this.setState({
    filesOpen: !this.state.filesOpen
  })

  toggleDeleteModal = () => this.setState({
    deleteModal: !this.state.deleteModal
  })

  deleteOrder = async () => {
    await this.props.deleteOrder(this.props.selectedOrder[0].id, cookie)
    await this.toggleDeleteModal()
    await this.props.toggle()
  }

  downloadPDF = () => {
    const data = this.props.selectedOrder[0];
    if (data.orderType === "Door Order") {
      this.state.selectedOption.map(async option => {
        switch (option.value) {
          case 'All':

            const edgesPromiseArr1 = this.props.selectedOrder[0].part_list.filter(i => i.edges && i.edges.photo && i.edges.photo.url).map(i => {
              return new Promise((resolve, reject) => {
                toDataUrl(i.edges.photo.url, (result) => {
                  resolve(result)
                });
              })
            });

            const mouldsPromiseArr1 = this.props.selectedOrder[0].part_list.filter(i => i.moulds && i.moulds.photo && i.moulds.photo.url).map(i => {
              return new Promise((resolve, reject) => {
                toDataUrl(i.moulds.photo.url, (result) => {
                  resolve(result)
                });
              })
            });



            const panelsPromiseArr1 = this.props.selectedOrder[0].part_list.filter(i => i.panels && i.panels.photo && i.panels.photo.url).map(i => {
              return new Promise((resolve, reject) => {
                toDataUrl(i.panels.photo.url, (result) => {
                  resolve(result)
                });
              })
            });

            let edges1;
            let moulds1;
            let panels1;

            try {
              edges1 = await Promise.all(edgesPromiseArr1);
              moulds1 = await Promise.all(mouldsPromiseArr1);
              panels1 = await Promise.all(panelsPromiseArr1);
            } catch (err) {
              console.log('errrrrrr', err);
            }

            DoorPDF(data, edges1, moulds1, panels1);
            this.setState({ selectedOption: [] })
            break;
          case 'Assembly':
            AssemblyListPDF(data);
            this.setState({ selectedOption: [] })
            break;
          case 'Acknowledgement':
            AcknowledgementPDF(data);
            this.setState({ selectedOption: [] })
            break;
          case 'Invoice':
            InvoicePDF(data);
            this.setState({ selectedOption: [] })
            break;
          case 'Stiles':
            StilesPDF(data);
            this.setState({ selectedOption: [] })
            break;
          case 'Rails':
            RailsPDF(data);
            this.setState({ selectedOption: [] })
            break;
          case 'Panels':
            PanelsPDF(data);
            this.setState({ selectedOption: [] })
            break;
          case 'Materials':
            MaterialsPDF(data);
            this.setState({ selectedOption: [] })
            break;
          case 'Profiles':

            const edgesPromiseArr = this.props.selectedOrder[0].part_list.filter(i => i.edges && i.edges.photo && i.edges.photo.url).map(i => {
              return new Promise((resolve, reject) => {
                toDataUrl(i.edges.photo.url, (result) => {
                  resolve(result)
                });
              })
            });

            const mouldsPromiseArr = this.props.selectedOrder[0].part_list.filter(i => i.moulds && i.moulds.photo && i.moulds.photo.url).map(i => {
              return new Promise((resolve, reject) => {
                toDataUrl(i.moulds.photo.url, (result) => {
                  resolve(result)
                });
              })
            });

            const panelsPromiseArr = this.props.selectedOrder[0].part_list.filter(i => i.panels && i.panels.photo && i.panels.photo.url).map(i => {
              return new Promise((resolve, reject) => {
                toDataUrl(i.panels.photo.url, (result) => {
                  resolve(result)
                });
              })
            });

            let edges;
            let moulds;
            let panels;

            try {
              edges = await Promise.all(edgesPromiseArr);
              moulds = await Promise.all(mouldsPromiseArr);
              panels = await Promise.all(panelsPromiseArr);
            } catch (err) {
              console.log('errrrrrr', err);
            }

            console.log('eeeee', edges, 'moooo', moulds, 'pannn', panels)
            ProfilesPDF(data, edges, moulds, panels);
            this.setState({ selectedOption: [] })
            break;
          case 'QC':
            QCPDF(data);
            this.setState({ selectedOption: [] })
            break;
          default:
            return
        }
      })

    } else {
      this.state.selectedOption.map(async option => {
        switch (option.value) {
          case 'All':
            DrawerPDF(data);
            this.setState({ selectedOption: [] })
            break;
          case 'Acknowledgement':
            DrawerAcnowledgementPDF(data);
            this.setState({ selectedOption: [] })
            break;
          case 'Invoice':
            DrawerInvoicePDF(data);
            this.setState({ selectedOption: [] })
            break;
          case 'Assembly':
            DrawerAssemblyListPDF(data);
            this.setState({ selectedOption: [] })
            break;
          case 'Bottoms':
            DrawerBottomsPDF(data);
            this.setState({ selectedOption: [] })
            break;
          case 'Sides':
            DrawerSidesPDF(data);
            this.setState({ selectedOption: [] })
            break;
          default:
            return
        }
      })
    }
  };

  handleChange = selectedOption => {
    this.setState(
      { selectedOption },
      () => console.log(`Option selected:`, this.state.selectedOption)
    );
  };

  render() {
    const props = this.props;

    // let options;

    // console.log(props)

    let options;
    let selectedOrder = props.selectedOrder[0] ? props.selectedOrder[0] : "Door Order"

    if (selectedOrder.orderType === "Door Order") {
      options = [
        { value: 'All', label: 'All' },
        { value: 'Assembly', label: 'Assembly List' },
        { value: 'Acknowledgement', label: 'Acknowledgement' },
        { value: 'Invoice', label: 'Invoice' },
        { value: 'Stiles', label: 'Stiles' },
        { value: 'Rails', label: 'Rails' },
        { value: 'Panels', label: 'Panels' },
        { value: 'Materials', label: 'Materials' },
        { value: 'Profiles', label: 'Profiles' },
        { value: 'QC', label: 'QC' },
      ];
    } else if (selectedOrder.orderType === "Drawer Order") {
      options = [
        { value: 'All', label: 'All' },
        { value: 'Acknowledgement', label: 'Acknowledgement' },
        { value: 'Invoice', label: 'Invoice' },
        { value: 'Assembly', label: 'Assembly List' },
        { value: 'Bottoms', label: 'Box Bottoms' },
        { value: 'Sides', label: 'Box Sides' },
      ];
    }



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

                      <Tooltip title="Tracking History" placement="top">
                        <IconButton onClick={this.toggleTracking}>
                          <List style={{ width: '40', height: '40' }} />
                        </IconButton>
                      </Tooltip>

                    </Col>
                    <Col />
                    <Col />
                  </Row>
                </div>
              ) : (
                  <div>

                    <Modal isOpen={this.state.deleteModal} toggle={this.toggleDeleteModal}>
                      <ModalHeader toggle={this.toggleDeleteModal}>Delete Order</ModalHeader>
                      <ModalBody>
                        Are You Sure You Want To Delete This Order?
                      </ModalBody>
                      <ModalFooter>
                        <Button color="danger" onClick={this.deleteOrder}>Delete Order</Button>{' '}
                        <Button color="secondary" onClick={this.toggleDeleteModal}>Cancel</Button>
                      </ModalFooter>
                    </Modal>


                    <Row></Row>
                    <Row>

                      <Col>
                        <Tooltip title="Edit" placement="top">
                          <IconButton onClick={this.props.editable}>
                            <Edit style={{ width: '40', height: '40' }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Tracking History" placement="top">
                          <IconButton onClick={this.toggleTracking}>
                            <List style={{ width: '40', height: '40' }} />
                          </IconButton>
                        </Tooltip>


                        {(props.selectedOrder[0] && props.selectedOrder[0].files.length > 0) ?
                          <Tooltip title="View Files" placement="top">
                            <IconButton onClick={this.toggleFiles}>
                              <Attachment style={{ width: '40', height: '40' }} />
                            </IconButton>
                          </Tooltip>
                          : null
                        }
                      </Col>

                      <Col />

                      <Col>
                        <Row>
                          <Col lg='7'>
                            <div className='mt-3 mb-2'>
                              <Select
                                value={this.state.selectedOption}
                                onChange={this.handleChange}
                                options={options}
                                isMulti={true}
                              />
                            </div>
                          </Col>
                          <Col>
                            <Tooltip title="Print" placement="top" className="mb-3">
                              <IconButton onClick={this.downloadPDF}>
                                <Print style={{ width: '40', height: '40' }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Order" placement="top" className="mb-3">
                              <IconButton onClick={this.toggleDeleteModal}>
                                <Delete style={{ width: '40', height: '40' }} />
                              </IconButton>
                            </Tooltip>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </div>
                )}
              <div>
                <Collapse isOpen={this.state.filesOpen}>
                  <Row>
                    <Col lg='12'>
                      <Card>
                        <CardBody>
                          <h5>Files</h5>
                          <Table striped>
                            <tbody>
                              {props.selectedOrder[0] ? props.selectedOrder[0].files.map((i, index) => (
                                <tr>
                                  <th scope="row">{index + 1}</th>
                                  <td>{i.name}</td>
                                  <td style={{ textAlign: 'right' }}><a href={i.url} target="_blank">View</a></td>
                                </tr>
                              )) : null}
                            </tbody>
                          </Table>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Collapse>
              </div>

              <div>
                <Collapse isOpen={this.state.trackingOpen}>
                  <Row>
                    <Col lg='12'>
                      <Card>
                        <CardBody>
                          <h5>Tracking History</h5>
                          <Table striped>
                            <tbody>
                              {(props.selectedOrder[0] && props.selectedOrder[0].tracking) ? props.selectedOrder[0].tracking.slice(0).reverse().map((i, index) => (
                                <tr>
                                  <th>{i.status}</th>
                                  <td>{moment(i.date).format("dddd, MMMM Do YYYY, h:mm:ss a")}</td>
                                </tr>
                              )) : null}
                            </tbody>
                          </Table>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Collapse>
              </div>

              <div>
                {/* order edit here */}
                {!this.props.edit ? (
                  <div />
                ) : (
                    <div>
                      <EditSelectedOrder
                        selectedOrder={props.selectedOrder}
                        // editable={this.props.editable}
                        // toggle={props.toggle}
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
      loadOrders,
      deleteOrder
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderPage);
