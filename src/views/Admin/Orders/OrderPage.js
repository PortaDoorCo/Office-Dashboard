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
  submitOrder,
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
import FileCopy from '@material-ui/icons/FileCopy';

import { CSVLink } from 'react-csv';

import DoorPDF from '../../PrintOuts/Pages/Door/DoorPDF';
import DrawerPDF from '../../PrintOuts/Pages/Drawer/DrawerPDF';
import BoxLabelPDF from '../../PrintOuts/Pages/Drawer/BoxLabels';

import moment from 'moment';

import MiscItemsPDF from '../../PrintOuts/Pages/MiscItems/MiscItemsPDF';

import MouldingsPDF from '../../PrintOuts/Pages/Mouldings/MouldingsPDF';
import FaceFramesPDF from '../../PrintOuts/Pages/FaceFrames/FaceFramesPDF';

import DoorBalance from './Balance/Door_Order/Balance';
import DoorBalanceHistory from './Balance/Door_Order/BalanceHistory';

import MiscItemBalance from './Balance/MiscItems/Balance';
import MiscItemBalanceHistory from './Balance/MiscItems/BalanceHistory';

import MouldingsBalance from './Balance/Mouldings/Balance';
import MouldingsBalanceHistory from './Balance/Mouldings/BalanceHistory';

import DrawerBalance from './Balance/Drawer_Order/Balance';
import DrawerBalanceHistory from './Balance/Drawer_Order/BalanceHistory';
import DoorMiscItems from './MiscItems/DoorMiscItems';
import DrawerMiscItems from './MiscItems/DrawerMiscItems';

import MouldingsMiscItems from './MiscItems/MouldingsMiscItems';

import FileUploader from '../../../components/FileUploader/FileUploader';

import DoorConversationNotes from './Notes/DoorOrder/Conversation_Notes';
import DrawerConversationNotes from './Notes/DrawerOrder/Conversation_Notes';
import MiscConversationNotes from './Notes/MiscItems/Conversation_Notes';
import MouldingsConversationNotes from './Notes/Mouldings/Conversation_Notes';

import PrintModal from '../../PrintOuts/Modal/Modal';
import numQty from 'numeric-quantity';
import Sticky from 'react-stickynode';
import StickyBox from 'react-sticky-box';

import CopyModal from '../../../utils/Modal';

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
      printModal: false,
      copyModal: false,
    };
  }

  handleCopyModal = () => {
    this.setState({ copyModal: !this.state.copyModal });
  };

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

  togglePrinter = () => {
    this.setState({
      printModal: !this.state.printModal,
    });
  };

  handleChange = (selectedOption) => {
    this.setState({ selectedOption }, () =>
      console.log('Option selected:', this.state.selectedOption)
    );
  };

  copyOrder = async () => {
    const {
      formState,
      drawerState,
      miscState,
      mouldingsState,
      selectedOrder,
      submitOrder,
    } = this.props;
    const data = formState
      ? formState
      : drawerState
        ? drawerState
        : miscState
          ? miscState
          : mouldingsState
            ? mouldingsState
            : [];

    let newOrder = {
      ...data,
      job_info: {
        ...data.job_info,
        poNum: `${data.job_info.poNum} - COPY`,
        status: 'Quote',
      },
    };

    newOrder.part_list.map((i) => {
      delete i['id'];
      delete i['_id'];
      return null;
    });

    delete newOrder['id'];
    delete newOrder['_id'];
    delete newOrder['orderNum'];
    delete newOrder['created_at'];
    delete newOrder['updatedAt'];
    delete newOrder['published_at'];

    newOrder['balance_history'] = [{ balance_paid: 0 }];
    newOrder['balance_paid'] = 0;
    newOrder['files'] = [];
    newOrder['Rush'] = false;
    newOrder['Sample'] = false;

    await submitOrder(newOrder, cookie);
    await this.props.toggle();
  };

  downloadPDF = async (printerSettings) => {
    const {
      formState,
      drawerState,
      miscState,
      mouldingsState,
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
          : mouldingsState
            ? mouldingsState
            : [];

    if (data.orderType === 'Door Order') {
      const designPromiseArr1 = selectedOrder.part_list
        .filter((i) => i.design && i.design.photo && i.design.photo.url)
        .map((i) => {
          return new Promise((resolve, reject) => {
            toDataUrl(i.design.photo.url, (result) => {
              resolve(result);
            });
          });
        });

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
        .filter((i) => i.profile && i.profile.photo && i.profile.photo.url)
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
            i.miter_design && i.miter_design.photo && i.miter_design.photo.url
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

      let design1;
      let edges1;
      let moulds1;
      let miter1;
      let mt_1;
      let panels1;
      let appliedProfiles1;

      try {
        design1 = await Promise.all(designPromiseArr1);
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
        design1,
        edges1,
        moulds1,
        miter1,
        mt_1,
        panels1,
        appliedProfiles1,
        breakdowns,
        printerSettings,
        this.props.pricing
      );
    } else if (data.orderType === 'Drawer Order') {
      DrawerPDF(data, box_breakdowns, printerSettings, this.props.pricing);
    } else if (data.orderType === 'Misc Items') {
      MiscItemsPDF(data, box_breakdowns, printerSettings, this.props.pricing);
    } else if (data.orderType === 'Mouldings') {
      MouldingsPDF(data, box_breakdowns, printerSettings, this.props.pricing);
    } else if (data.orderType === 'Face Frame') {
      FaceFramesPDF(data, breakdowns, printerSettings, this.props.pricing);
    }
  };

  downloadBoxLabel = async (printerSettings) => {
    const {
      formState,
      drawerState,
      miscState,
      mouldingsState,
      box_breakdowns,
    } = this.props;
    const data = formState
      ? formState
      : drawerState
        ? drawerState
        : miscState
          ? miscState
          : mouldingsState
            ? mouldingsState
            : [];
    BoxLabelPDF(data, box_breakdowns);
  };

  render() {
    const props = this.props;

    const { selectedOrder, printer_options, user } = this.props;

    let options;
    let s = selectedOrder ? selectedOrder : 'Door Order';

    let exportCsv = [];
    let a = [];
    let razorGuage = [];

    let b = a.map((i, ind) => {
      return i;
    });

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

      exportCsv = s
        ? s.part_list.map((f, index) => {
          f.dimensions.forEach((j, ind) => {
            if (f.orderType.value === 'DF') {
              a.push([
                s.orderNum,
                '15DF',
                j.qty,
                f.woodtype && f.woodtype.NAME,
                numQty(j.width),
                numQty(j.height),
                f.edge && f.edge.NAME,
                  f.thickness?.thickness_values
                    ? f.thickness?.thickness_values
                    : f.thickness?.thickness_1 === '4/4'
                      ? 0.75
                      : f.thickness?.thickness_1 === '5/4'
                        ? 1
                        : f.thickness?.thickness_1 === '6/4'
                          ? 1.25
                          : 0.75,
              ]);
            } else {
              a.push([
                s.orderNum,
                'D',
                j.qty,
                f.woodtype && f.woodtype.NAME,
                numQty(j.width),
                numQty(j.height),
                f.edge && f.edge.NAME,
                  f.thickness?.thickness_values
                    ? f.thickness?.thickness_values
                    : f.thickness?.thickness_1 === '4/4'
                      ? 0.75
                      : f.thickness?.thickness_1 === '5/4'
                        ? 1
                        : f.thickness?.thickness_1 === '6/4'
                          ? 1.25
                          : 0.75,
              ]);
            }
          });
          return a;
        })
        : [];

      const razor = s
        ? s.part_list.map((f, index) => {
          console.log({ f });

          f.dimensions.forEach((j, ind) => {
            console.log({ j });

            if (numQty(j.leftStile) === numQty(j.rightStile)) {
              razorGuage.push([
                `0${s.orderNum.toString()}`,
                  f.woodtype?.NAME,
                  numQty(j.leftStile) + f.edge?.LIP_FACTOR / 2,
                  numQty(j.height) + f.edge?.LIP_FACTOR
                    ? f.edge?.LIP_FACTOR
                    : 0,
                  numQty(j.qty) * 2,
                  'L / R',
                  f.design?.NAME,
                  ind + 1,
                  f.profile?.NAME,
              ]);
            } else {
              razorGuage.push([
                `0${s.orderNum.toString()}`,
                  f.woodtype?.NAME,
                  numQty(j.leftStile) + f.edge?.LIP_FACTOR / 2,
                  j.qty,
                  numQty(j.height) + f.edge?.LIP_FACTOR
                    ? f.edge?.LIP_FACTOR
                    : 0,
                  numQty(j.qty) * 1,
                  'L',
                  f.design?.NAME,
                  ind + 1,
                  f.profile?.NAME,
              ]);

              razorGuage.push([
                `0${s.orderNum.toString()}`,
                  f.woodtype?.NAME,
                  numQty(j.rightStile) + f.edge?.LIP_FACTOR / 2,
                  j.qty,
                  numQty(j.height) + f.edge?.LIP_FACTOR
                    ? f.edge?.LIP_FACTOR
                    : 0,
                  numQty(j.qty) * 1,
                  'R',
                  f.design?.NAME,
                  ind + 1,
                  f.profile?.NAME,
              ]);
            }

            if (numQty(j.topRail) === numQty(j.bottomRail)) {
              razorGuage.push([
                `0${s.orderNum.toString()}`,
                  f.woodtype?.NAME,
                  numQty(j.topRail) + f.edge?.LIP_FACTOR / 2,
                  numQty(j.width) - 3.5,
                  numQty(j.qty) * 2,
                  'T / B',
                  f.design?.NAME,
                  ind + 1,
                  f.profile?.NAME,
              ]);
            } else {
              razorGuage.push([
                `0${s.orderNum.toString()}`,
                  f.woodtype?.NAME,
                  numQty(j.topRail) + f.edge?.LIP_FACTOR / 2,
                  numQty(j.width) - 3.5,
                  numQty(j.qty) * 1,
                  'T',
                  f.design?.NAME,
                  ind + 1,
                  f.profile?.NAME,
              ]);
              razorGuage.push([
                `0${s.orderNum.toString()}`,
                  f.woodtype?.NAME,
                  numQty(j.bottomRail) + f.edge?.LIP_FACTOR / 2,
                  j.qty,
                  numQty(j.width) - 3.5,
                  numQty(j.qty) * 1,
                  'B',
                  f.design?.NAME,
                  ind + 1,
                  f.profile?.NAME,
              ]);
            }
          });
          return razorGuage;
        })
        : [];
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
    } else if (s.orderType === 'Misc Items' || s.orderType === 'Mouldings') {
      options = [
        { value: 'All', label: 'All' },
        { value: 'Acknowledgement', label: 'Acknowledgement' },
        { value: 'Invoice', label: 'Invoice' },
      ];
    }

    return (
      <div className="animated noPrint resize">
        <CopyModal
          message={'Would you like to copy this order?'}
          title={'Copy Order'}
          actionButton={'Copy Order'}
          toggle={this.handleCopyModal}
          modal={this.state.copyModal}
          action={this.copyOrder}
        />
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

                    <Tooltip title="View Files" placement="top">
                      <IconButton onClick={this.toggleFiles}>
                        <Attachment style={{ width: '40', height: '40' }} />
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
                  {user?.role?.type !== 'quality_control' ? (
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
                  ) : (
                    <Col />
                  )}

                  <Col className="ml-5">
                    <Row>
                      <Col lg="6"></Col>
                      <Col>
                        {/* {(s.orderType === 'Drawer Order') ? 
                          <Tooltip title="Box Labels" placement="top" className="mb-3">
                            <IconButton onClick={this.downloadBoxLabel}>
                              <LabelIcon style={{ width: '40', height: '40' }} />
                            </IconButton>
                          </Tooltip> : null
                        } */}

                        <Tooltip title="Print" placement="top" className="mb-3">
                          <IconButton onClick={this.togglePrinter}>
                            <Print style={{ width: '40', height: '40' }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title="Copy Order"
                          placement="top"
                          className="mb-3"
                        >
                          <IconButton onClick={this.handleCopyModal}>
                            <FileCopy style={{ width: '40', height: '40' }} />
                          </IconButton>
                        </Tooltip>

                        {selectedOrder &&
                        selectedOrder.orderType === 'Door Order' ? (
                            <CSVLink
                              data={a.map((i, ind) => {
                                return [
                                  ...i,
                                  ind + 1,
                                  `*${i[0]}X${('00' + (ind + 1)).slice(-3)}*`,
                                ];
                              })}
                              filename={`${s && s.orderNum}.csv`}
                              separator={','}
                              className="mb-3"
                            >
                              {' '}
                              <Tooltip
                                title="Export Edges"
                                placement="top"
                                className="mb-3"
                              >
                                <IconButton>
                                  <GetAppIcon
                                    style={{ width: '40', height: '40' }}
                                  />
                                </IconButton>
                              </Tooltip>
                            </CSVLink>
                          ) : null}

                        {selectedOrder &&
                        selectedOrder.orderType === 'Door Order' ? (
                            <CSVLink
                              data={razorGuage}
                              filename={`${s && s.orderNum} Razor Guage.csv`}
                              separator={','}
                              className="mb-3"
                            >
                              {' '}
                              <Tooltip
                                title="Razorguage Export"
                                placement="top"
                                className="mb-3"
                              >
                                <IconButton>
                                  <GetAppIcon
                                    style={{ width: '40', height: '40' }}
                                  />
                                </IconButton>
                              </Tooltip>
                            </CSVLink>
                          ) : null}

                        {(this.props.user &&
                          this.props.user.role &&
                          this.props.user.role &&
                          this.props.user.role.name === 'Administrator') ||
                        (this.props.user &&
                          this.props.user.role &&
                          this.props.user.role &&
                          this.props.user.role.name === 'Management') ? (
                            <Tooltip
                              title="Delete Order"
                              placement="top"
                              className="mb-3"
                            >
                              <IconButton onClick={this.toggleDeleteModal}>
                                <Delete style={{ width: '40', height: '40' }} />
                              </IconButton>
                            </Tooltip>
                          ) : null}
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
                                    <a
                                      href={i.url}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                    >
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
                            <DoorConversationNotes
                              toggleBalance={this.toggleBalance}
                              selectedOrder={props.selectedOrder}
                            />
                          ) : selectedOrder &&
                          selectedOrder.orderType === 'Drawer Order' ? (
                              <DrawerConversationNotes
                                toggleBalance={this.toggleBalance}
                                selectedOrder={props.selectedOrder}
                              />
                            ) : selectedOrder &&
                          selectedOrder.orderType === 'Misc Items' ? (
                                <MiscConversationNotes
                                  toggleBalance={this.toggleBalance}
                                  selectedOrder={props.selectedOrder}
                                />
                              ) : selectedOrder &&
                          selectedOrder.orderType === 'Mouldings' ? (
                                  <MouldingsConversationNotes
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
                        (selectedOrder.orderType === 'Door Order' ||
                          selectedOrder.orderType === 'Face Frame') ? (
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
                              ) : selectedOrder &&
                          selectedOrder.orderType === 'Mouldings' ? (
                                  <MouldingsBalance
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
                        (selectedOrder.orderType === 'Door Order' ||
                          selectedOrder.orderType === 'Face Frame') ? (
                            <DoorBalanceHistory
                              edit={!this.props.edit}
                              editable={this.props.editable}
                            />
                          ) : selectedOrder &&
                          selectedOrder.orderType === 'Drawer Order' ? (
                              <DrawerBalanceHistory
                                edit={!this.props.edit}
                                editable={this.props.editable}
                              />
                            ) : selectedOrder &&
                          selectedOrder.orderType === 'Misc Items' ? (
                                <MiscItemBalanceHistory
                                  edit={!this.props.edit}
                                  editable={this.props.editable}
                                />
                              ) : selectedOrder &&
                          selectedOrder.orderType === 'Mouldings' ? (
                                  <MouldingsBalanceHistory
                                    edit={!this.props.edit}
                                    editable={this.props.editable}
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
              <Collapse isOpen={this.state.miscItemsOpen}>
                <Row>
                  <Col lg="12">
                    <Card>
                      <CardBody>
                        <h5>Misc Items</h5>
                        {selectedOrder &&
                        (selectedOrder.orderType === 'Door Order' ||
                          selectedOrder.orderType === 'Face Frame') ? (
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
                            ) : selectedOrder &&
                          selectedOrder.orderType === 'Mouldings' ? (
                                <MouldingsMiscItems
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

              <EditSelectedOrder
                selectedOrder={props.selectedOrder}
                editable={this.props.editable}
                edit={!this.props.edit}
                toggle={props.toggle}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={props.toggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        <PrintModal
          toggle={this.togglePrinter}
          modal={this.state.printModal}
          printer_options={printer_options}
          selectedOrder={props.selectedOrder}
          downloadPDF={this.downloadPDF}
          formState
          drawerState
          miscState
          mouldingsState
          breakdowns
          box_breakdowns
        />
      </div>
    );
  }
}

const mapStateToProps = (state, prop) => ({
  formState: getFormValues('DoorOrder')(state),
  drawerState: getFormValues('DrawerOrder')(state),
  miscState: getFormValues('MiscItems')(state),
  mouldingsState: getFormValues('Mouldings')(state),
  breakdowns: state.part_list.breakdowns,
  box_breakdowns: state.part_list.box_breakdowns,
  selectedOrder: state.Orders.selectedOrder,
  printer_options: state.misc_items.printer_options,
  pricing: state.part_list.pricing,
  user: state.users.user,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateOrder,
      loadOrders,
      deleteOrder,
      setSelectedOrder,
      uploadFilesToOrder,
      submitOrder,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrderPage);
