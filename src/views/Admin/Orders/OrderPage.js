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
  Collapse,
} from 'reactstrap';
import { getFormValues } from 'redux-form';
import EditSelectedOrder from './SelectedOrder/EditSelectedOrder';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  updateOrder,
  loadOrders,
  deleteOrder,
  setSelectedOrder,
  uploadFilesToOrder,
} from '../../../redux/orders/actions';
import Edit from '@material-ui/icons/Edit';
import Print from '@material-ui/icons/Print';
import Attachment from '@material-ui/icons/Attachment';
import List from '@material-ui/icons/List';
import ArrowBack from '@material-ui/icons/ArrowBack';
import GetAppIcon from '@material-ui/icons/GetApp';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import Dns from '@material-ui/icons/Dns';
import Tooltip from '@material-ui/core/Tooltip';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Chat from '@material-ui/icons/Chat';

import { CSVLink, CSVDownload } from 'react-csv';

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
import moment from 'moment';

import MiscItemsAcknowledgement from './PrintOuts/Pages/MiscItems/AcknowledgementPDF';
import MiscItemsInvoice from './PrintOuts/Pages/MiscItems/InvoicePDF';
import MiscItemsPDF from './PrintOuts/Pages/MiscItems/MiscItemsPDF';

import AcknowledgementPDF from './PrintOuts/Pages/Door/AcknowledgementPDF';
import DrawerAcnowledgementPDF from './PrintOuts/Pages/Drawer/AcknowledgementPDF';
import DrawerInvoicePDF from './PrintOuts/Pages/Drawer/InvoicePDF';
import DrawerAssemblyListPDF from './PrintOuts/Pages/Drawer/AssemblyListPDF';
import DrawerBottomsPDF from './PrintOuts/Pages/Drawer/BottomsPDF';
import DrawerSidesPDF from './PrintOuts/Pages/Drawer/SidesPDF';

import DoorBalance from './Balance/Door_Order/Balance';
import DoorBalanceHistory from './Balance/Door_Order/BalanceHistory';

import MiscItemBalance from './Balance/MiscItems/Balance';
import MiscItemBalanceHistory from './Balance/MiscItems/BalanceHistory';

import DrawerBalance from './Balance/Drawer_Order/Balance';
import DrawerBalanceHistory from './Balance/Drawer_Order/BalanceHistory';
import DoorMiscItems from './MiscItems/DoorMiscItems';
import DrawerMiscItems from './MiscItems/DrawerMiscItems';

import CustomerCopyDoorPDF from './PrintOuts/Pages/Door/CustomerCopyPDF';
import CustomerCopyDrawerPDF from './PrintOuts/Pages/Drawer/CustomerCopyPDF';

import FileUploader from '../../../components/FileUploader/FileUploader';

import Door_Conversation_Notes from './Notes/DoorOrder/Conversation_Notes';
import Drawer_Conversation_Notes from './Notes/DrawerOrder/Conversation_Notes';
import Misc_Conversation_Notes from './Notes/MiscItems/Conversation_Notes';

import numQty from 'numeric-quantity';

import Cookies from 'js-cookie';

const cookie = Cookies.get('jwt');

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
      deleteModal: false,
      balanceOpen: false,
      miscItemsOpen: false,
      notesOpen: false,
    };
  }

  breakdown = (e) => {
    e.preventDefault();
    this.setState({ page: 'breakdowns' });
  };

  invoice = (e) => {
    e.preventDefault();
    this.setState({ page: 'invoice' });
  };

  close = (e) => {
    e.preventDefault();
    this.setState({ page: [] });
  };

  editable = () => {
    this.setState({
      edit: !this.state.edit,
    });
  };

  toggleTooltip = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  };

  toggleTracking = () =>
    this.setState({
      trackingOpen: !this.state.trackingOpen,
    });

  toggleBalance = () =>
    this.setState({
      balanceOpen: !this.state.balanceOpen,
    });

  toggleMiscItems = () =>
    this.setState({
      miscItemsOpen: !this.state.miscItemsOpen,
    });

  toggleFiles = () =>
    this.setState({
      filesOpen: !this.state.filesOpen,
    });

  toggleNotes = () =>
    this.setState({
      notesOpen: !this.state.notesOpen,
    });

  toggleDeleteModal = () =>
    this.setState({
      deleteModal: !this.state.deleteModal,
    });

  onUploaded = (e) => {
    const { uploadFilesToOrder, selectedOrder } = this.props;
    uploadFilesToOrder(selectedOrder, e, cookie);
  };

  deleteOrder = async () => {
    const { selectedOrder } = this.props;
    await this.props.deleteOrder(selectedOrder.id, cookie);
    await this.toggleDeleteModal();
    await this.props.toggle();
  };

  downloadPDF = () => {
    const {
      formState,
      drawerState,
      miscState,
      breakdowns,
      box_breakdowns,
      selectedOrder,
    } = this.props;
    const data = formState
      ? formState
      : drawerState
        ? drawerState
        : miscState
          ? miscState
          : [];
    if (data.orderType === 'Door Order') {
      this.state.selectedOption.map(async (option) => {
        switch (option.value) {
          case 'Breakdowns':
            const edgesPromiseArr1 = selectedOrder.part_list
              .filter((i) => i.edge && i.edge.photo && i.edge.photo.url)
              .map((i) => {
                return new Promise((resolve, reject) => {
                  toDataUrl(i.edge.photo.url, (result) => {
                    resolve(result);
                  });
                });
              });

            const mouldsPromiseArr1 = selectedOrder.part_list
              .filter(
                (i) => i.profile && i.profile.photo && i.profile.photo.url
              )
              .map((i) => {
                return new Promise((resolve, reject) => {
                  toDataUrl(i.profile.photo.url, (result) => {
                    resolve(result);
                  });
                });
              });

            const miterPromiseArr1 = selectedOrder.part_list
              .filter(
                (i) =>
                  i.miter_design &&
                  i.miter_design.photo &&
                  i.miter_design.photo.url
              )
              .map((i) => {
                return new Promise((resolve, reject) => {
                  toDataUrl(i.miter_design.photo.url, (result) => {
                    resolve(result);
                  });
                });
              });

            const MT_PromiseArr1 = selectedOrder.part_list
              .filter(
                (i) => i.mt_design && i.mt_design.photo && i.mt_design.photo.url
              )
              .map((i) => {
                return new Promise((resolve, reject) => {
                  toDataUrl(i.mt_design.photo.url, (result) => {
                    resolve(result);
                  });
                });
              });

            const panelsPromiseArr1 = selectedOrder.part_list
              .filter((i) => i.panel && i.panel.photo && i.panel.photo.url)
              .map((i) => {
                return new Promise((resolve, reject) => {
                  toDataUrl(i.panel.photo.url, (result) => {
                    resolve(result);
                  });
                });
              });

            const appliedProfilePromiseArr1 = selectedOrder.part_list
              .filter(
                (i) =>
                  i.applied_profile &&
                  i.applied_profile.photo &&
                  i.applied_profile.photo.url
              )
              .map((i) => {
                return new Promise((resolve, reject) => {
                  toDataUrl(i.applied_profile.photo.url, (result) => {
                    resolve(result);
                  });
                });
              });

            let edges1;
            let moulds1;
            let miter1;
            let mt_1;
            let panels1;
            let appliedProfiles1;

            try {
              edges1 = await Promise.all(edgesPromiseArr1);
              moulds1 = await Promise.all(mouldsPromiseArr1);
              miter1 = await Promise.all(miterPromiseArr1);
              mt_1 = await Promise.all(MT_PromiseArr1);
              panels1 = await Promise.all(panelsPromiseArr1);
              appliedProfiles1 = await Promise.all(appliedProfilePromiseArr1);
            } catch (err) {
              console.log('errrrrrr', err);
            }

            DoorPDF(
              data,
              edges1,
              moulds1,
              miter1,
              mt_1,
              panels1,
              appliedProfiles1,
              breakdowns
            );
            this.setState({ selectedOption: [] });
            break;
          case 'CustomerCopy':
            CustomerCopyDoorPDF(data, breakdowns);
            this.setState({ selectedOption: [] });
            break;
          case 'Assembly':
            AssemblyListPDF(data, breakdowns);
            this.setState({ selectedOption: [] });
            break;
          case 'Acknowledgement':
            AcknowledgementPDF(data, breakdowns);
            this.setState({ selectedOption: [] });
            break;
          case 'Invoice':
            InvoicePDF(data, breakdowns);
            this.setState({ selectedOption: [] });
            break;
          case 'Stiles':
            StilesPDF(data, breakdowns);
            this.setState({ selectedOption: [] });
            break;
          case 'Rails':
            RailsPDF(data, breakdowns);
            this.setState({ selectedOption: [] });
            break;
          case 'Panels':
            PanelsPDF(data, breakdowns);
            this.setState({ selectedOption: [] });
            break;
          case 'Materials':
            MaterialsPDF(data, breakdowns);
            this.setState({ selectedOption: [] });
            break;
          case 'Profiles':
            const edgesPromiseArr = selectedOrder.part_list
              .filter((i) => i.edge && i.edge.photo && i.edge.photo.url)
              .map((i) => {
                return new Promise((resolve, reject) => {
                  toDataUrl(i.edge.photo.url, (result) => {
                    resolve(result);
                  });
                });
              });

            const mouldsPromiseArr = selectedOrder.part_list
              .filter(
                (i) => i.profile && i.profile.photo && i.profile.photo.url
              )
              .map((i) => {
                return new Promise((resolve, reject) => {
                  toDataUrl(i.profile.photo.url, (result) => {
                    resolve(result);
                  });
                });
              });

            const miterPromiseArr = selectedOrder.part_list
              .filter(
                (i) =>
                  i.miter_design &&
                  i.miter_design.photo &&
                  i.miter_design.photo.url
              )
              .map((i) => {
                return new Promise((resolve, reject) => {
                  toDataUrl(i.miter_design.photo.url, (result) => {
                    resolve(result);
                  });
                });
              });

            const MT_PromiseArr = selectedOrder.part_list
              .filter(
                (i) => i.mt_design && i.mt_design.photo && i.mt_design.photo.url
              )
              .map((i) => {
                return new Promise((resolve, reject) => {
                  toDataUrl(i.mt_design.photo.url, (result) => {
                    resolve(result);
                  });
                });
              });

            const panelsPromiseArr = selectedOrder.part_list
              .filter((i) => i.panel && i.panel.photo && i.panel.photo.url)
              .map((i) => {
                return new Promise((resolve, reject) => {
                  toDataUrl(i.panel.photo.url, (result) => {
                    resolve(result);
                  });
                });
              });

            const appliedProfilePromiseArr = selectedOrder.part_list
              .filter(
                (i) =>
                  i.applied_profile &&
                  i.applied_profile.photo &&
                  i.applied_profile.photo.url
              )
              .map((i) => {
                return new Promise((resolve, reject) => {
                  toDataUrl(i.applied_profile.photo.url, (result) => {
                    resolve(result);
                  });
                });
              });

            let edges;
            let moulds;
            let miter;
            let mt;
            let panels;
            let appliedProfiles;

            try {
              edges = await Promise.all(edgesPromiseArr);
              moulds = await Promise.all(mouldsPromiseArr);
              miter = await Promise.all(miterPromiseArr);
              mt = await Promise.all(MT_PromiseArr);
              panels = await Promise.all(panelsPromiseArr);
              appliedProfiles = await Promise.all(appliedProfilePromiseArr);
            } catch (err) {
              console.log('errrrrrr', err);
            }

            ProfilesPDF(
              data,
              edges,
              moulds,
              miter,
              mt,
              panels,
              appliedProfiles,
              breakdowns
            );
            this.setState({ selectedOption: [] });
            break;
          case 'QC':
            QCPDF(data, breakdowns);
            this.setState({ selectedOption: [] });
            break;
          default:
            return;
        }
      });
    } else if (data.orderType === 'Drawer Order') {
      this.state.selectedOption.map(async (option) => {
        switch (option.value) {
          case 'Breakdowns':
            DrawerPDF(data, box_breakdowns);
            this.setState({ selectedOption: [] });
            break;
          case 'CustomerCopy':
            CustomerCopyDrawerPDF(data, breakdowns);
            this.setState({ selectedOption: [] });
            break;
          case 'Acknowledgement':
            DrawerAcnowledgementPDF(data, box_breakdowns);
            this.setState({ selectedOption: [] });
            break;
          case 'Invoice':
            DrawerInvoicePDF(data, box_breakdowns);
            this.setState({ selectedOption: [] });
            break;
          case 'Assembly':
            DrawerAssemblyListPDF(data, box_breakdowns);
            this.setState({ selectedOption: [] });
            break;
          case 'Bottoms':
            DrawerBottomsPDF(data, box_breakdowns);
            this.setState({ selectedOption: [] });
            break;
          case 'Sides':
            DrawerSidesPDF(data, box_breakdowns);
            this.setState({ selectedOption: [] });
            break;
          default:
            return;
        }
      });
    } else if (data.orderType === 'Misc Items') {
      this.state.selectedOption.map(async (option) => {
        switch (option.value) {
          case 'All':
            MiscItemsPDF(data, box_breakdowns);
            this.setState({ selectedOption: [] });
            break;
          case 'Acknowledgement':
            MiscItemsAcknowledgement(data, box_breakdowns);
            this.setState({ selectedOption: [] });
            break;
          case 'Invoice':
            MiscItemsInvoice(data, box_breakdowns);
            this.setState({ selectedOption: [] });
            break;
          default:
            return;
        }
      });
    }
  };

  handleChange = (selectedOption) => {
    this.setState({ selectedOption }, () =>
      console.log('Option selected:', this.state.selectedOption)
    );
  };

  render() {
    const props = this.props;

    const { selectedOrder } = this.props;

    let options;
    let s = selectedOrder ? selectedOrder : 'Door Order';

    let exportCsv = [];
    let a = [];

    let b = a.map((i,ind) => {
      return i;
    });

    console.log(b);


    if (s.orderType === 'Door Order') {
      options = [
        { value: 'Breakdowns', label: 'Breakdowns' },
        { value: 'CustomerCopy', label: 'Customer Copy' },
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

      exportCsv = s ? s.part_list.map((f,index) => {
        f.dimensions.forEach((j, ind) => {
          if(f.orderType.value === 'DF') {
            a.push([s.orderNum, '15DF', j.qty, f.woodtype && f.woodtype.NAME, numQty(j.width), numQty(j.height), f.edge.NAME, f.thickness && f.thickness.value]);
          } else {
            a.push([s.orderNum, 'D', j.qty, f.woodtype && f.woodtype.NAME, numQty(j.height), numQty(j.width),  f.edge.NAME, f.thickness && f.thickness.value]);
          }
        });
        return a;
      }) : [];
      

    } else if (s.orderType === 'Drawer Order') {
      options = [
        { value: 'Breakdowns', label: 'Breakdowns' },
        { value: 'CustomerCopy', label: 'Customer Copy' },
        { value: 'Acknowledgement', label: 'Acknowledgement' },
        { value: 'Invoice', label: 'Invoice' },
        { value: 'Assembly', label: 'Assembly List' },
        { value: 'Bottoms', label: 'Box Bottoms' },
        { value: 'Sides', label: 'Box Sides' },
      ];
    } else if (s.orderType === 'Misc Items') {
      options = [
        { value: 'All', label: 'All' },
        { value: 'Acknowledgement', label: 'Acknowledgement' },
        { value: 'Invoice', label: 'Invoice' },
      ];
    }

    return (
      <div className="animated noPrint resize">
        <Modal isOpen={props.modal} toggle={props.toggle} className="modal-lg">
          <ModalHeader toggle={props.toggle}>
            Order #{selectedOrder && selectedOrder.orderNum}
          </ModalHeader>
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

                    <Tooltip title="Balance" placement="top">
                      <IconButton onClick={this.toggleBalance}>
                        <AttachMoneyIcon
                          style={{ width: '40', height: '40' }}
                        />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Misc Items" placement="top">
                      <IconButton onClick={this.toggleMiscItems}>
                        <Dns style={{ width: '40', height: '40' }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="View Notes" placement="top">
                      <IconButton onClick={this.toggleNotes}>
                        <Chat style={{ width: '40', height: '40' }} />
                      </IconButton>
                    </Tooltip>
                  </Col>
                  <Col />
                  <Col />
                </Row>
              </div>
            ) : (
              <div>
                <Modal
                  isOpen={this.state.deleteModal}
                  toggle={this.toggleDeleteModal}
                >
                  <ModalHeader toggle={this.toggleDeleteModal}>
                    Delete Order
                  </ModalHeader>
                  <ModalBody>
                    Are You Sure You Want To Delete This Order?
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onClick={this.deleteOrder}>
                      Delete Order
                    </Button>{' '}
                    <Button color="secondary" onClick={this.toggleDeleteModal}>
                      Cancel
                    </Button>
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

                    <Tooltip title="Balance" placement="top">
                      <IconButton onClick={this.toggleBalance}>
                        <AttachMoneyIcon
                          style={{ width: '40', height: '40' }}
                        />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Misc Items" placement="top">
                      <IconButton onClick={this.toggleMiscItems}>
                        <Dns style={{ width: '40', height: '40' }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="View Notes" placement="top">
                      <IconButton onClick={this.toggleNotes}>
                        <Chat style={{ width: '40', height: '40' }} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="View Files" placement="top">
                      <IconButton onClick={this.toggleFiles}>
                        <Attachment style={{ width: '40', height: '40' }} />
                      </IconButton>
                    </Tooltip>
                  </Col>

                  <Col />

                  <Col>
                    <Row>
                      <Col lg="7">
                        <div className="mt-3 mb-2">
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

                        <CSVLink data={a.map((i,ind) => {
                          console.log({i});
                          return [...i, ind + 1];
                        })} filename={`${s && s.orderNum}.csv`} separator={','} className="mb-3">
                          {' '}
                          <IconButton onClick={this.toggleFiles}>
                            <GetAppIcon
                              style={{ width: '40', height: '40' }}
                            />
                          </IconButton>
                        </CSVLink>

  

                        <Tooltip
                          title="Delete Order"
                          placement="top"
                          className="mb-3"
                        >
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
                  <Col lg="12">
                    <Card>
                      <CardBody>
                        <h5>Files</h5>
                        <Table striped>
                          <tbody>
                            {selectedOrder
                              ? selectedOrder.files.map((i, index) => (
                                <tr>
                                  <th scope="row">{index + 1}</th>
                                  <td>{i.name}</td>
                                  <td style={{ textAlign: 'right' }}>
                                    <a href={i.url} target="_blank">
                                        View
                                    </a>
                                  </td>
                                </tr>
                              ))
                              : null}
                          </tbody>
                        </Table>
                        <FileUploader
                          onUploaded={this.onUploaded}
                          multi={true}
                        />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Collapse>
            </div>

            <div>
              <Collapse isOpen={this.state.trackingOpen}>
                <Row>
                  <Col lg="12">
                    <Card>
                      <CardBody>
                        <h5>Tracking History</h5>
                        <Table striped>
                          <tbody>
                            {selectedOrder && selectedOrder.tracking
                              ? selectedOrder.tracking
                                .slice(0)
                                .reverse()
                                .map((i, index) => (
                                  <tr key={index}>
                                    <th>{i.status}</th>
                                    <td>
                                      {moment(i.date).format(
                                        'dddd, MMMM Do YYYY, h:mm:ss a'
                                      )}
                                    </td>
                                  </tr>
                                ))
                              : null}
                          </tbody>
                        </Table>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Collapse>
            </div>

            <div>
              <Collapse isOpen={this.state.notesOpen}>
                <Row>
                  <Col lg="12">
                    <Card>
                      <CardBody>
                        <h2>Conversation Notes</h2>
                        {selectedOrder &&
                        selectedOrder.orderType === 'Door Order' ? (
                            <Door_Conversation_Notes
                              toggleBalance={this.toggleBalance}
                              selectedOrder={props.selectedOrder}
                            />
                          ) : selectedOrder &&
                          selectedOrder.orderType === 'Drawer Order' ? (
                              <Drawer_Conversation_Notes
                                toggleBalance={this.toggleBalance}
                                selectedOrder={props.selectedOrder}
                              />
                            ) : selectedOrder &&
                          selectedOrder.orderType === 'Misc Items' ? (
                                <Misc_Conversation_Notes
                                  toggleBalance={this.toggleBalance}
                                  selectedOrder={props.selectedOrder}
                                />
                              ) : (
                                <div />
                              )}
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Collapse>
            </div>

            <div>
              <Collapse isOpen={this.state.balanceOpen}>
                <Row>
                  <Col lg="4">
                    <Card>
                      <CardBody>
                        <h5>Balance</h5>
                        {/* <DoorBalance
                              toggleBalance={this.toggleBalance}
                              selectedOrder={props.selectedOrder}
                            /> */}
                        {selectedOrder &&
                        selectedOrder.orderType === 'Door Order' ? (
                            <DoorBalance
                              toggleBalance={this.toggleBalance}
                              selectedOrder={props.selectedOrder}
                            />
                          ) : selectedOrder &&
                          selectedOrder.orderType === 'Drawer Order' ? (
                              <DrawerBalance
                                toggleBalance={this.toggleBalance}
                                selectedOrder={props.selectedOrder}
                              />
                            ) : selectedOrder &&
                          selectedOrder.orderType === 'Misc Items' ? (
                                <MiscItemBalance
                                  toggleBalance={this.toggleBalance}
                                  selectedOrder={props.selectedOrder}
                                />
                              ) : (
                                <div />
                              )}
                      </CardBody>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <CardBody>
                        <h5>Balance History</h5>
                        {selectedOrder &&
                        selectedOrder.orderType === 'Door Order' ? (
                            <DoorBalanceHistory />
                          ) : selectedOrder &&
                          selectedOrder.orderType === 'Drawer Order' ? (
                              <DrawerBalanceHistory />
                            ) : selectedOrder &&
                          selectedOrder.orderType === 'Misc Items' ? (
                                <MiscItemBalanceHistory />
                              ) : (
                                <div />
                              )}
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Collapse>
            </div>

            <div>
              <Collapse isOpen={this.state.miscItemsOpen}>
                <Row>
                  <Col lg="12">
                    <Card>
                      <CardBody>
                        <h5>Misc Items</h5>
                        {selectedOrder &&
                        selectedOrder.orderType === 'Door Order' ? (
                            <DoorMiscItems
                              toggle={this.toggleMiscItems}
                              edit={!this.props.edit}
                            />
                          ) : selectedOrder &&
                          selectedOrder.orderType === 'Drawer Order' ? (
                              <DrawerMiscItems
                                toggle={this.toggleMiscItems}
                                edit={!this.props.edit}
                              />
                            ) : null}
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Collapse>
            </div>

            <div>
              {/* order edit here */}

              <div>
                <EditSelectedOrder
                  selectedOrder={props.selectedOrder}
                  editable={this.props.editable}
                  edit={!this.props.edit}
                  toggle={props.toggle}
                />
              </div>
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

const mapStateToProps = (state, prop) => ({
  formState: getFormValues('DoorOrder')(state),
  drawerState: getFormValues('DrawerOrder')(state),
  miscState: getFormValues('MiscItems')(state),
  breakdowns: state.part_list.breakdowns,
  box_breakdowns: state.part_list.box_breakdowns,
  selectedOrder: state.Orders.selectedOrder,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateOrder,
      loadOrders,
      deleteOrder,
      setSelectedOrder,
      uploadFilesToOrder,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrderPage);
