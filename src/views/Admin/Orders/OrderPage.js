import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Attachment from '@material-ui/icons/Attachment';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Chat from '@material-ui/icons/Chat';
import Delete from '@material-ui/icons/Delete';
import Dns from '@material-ui/icons/Dns';
import FileCopy from '@material-ui/icons/FileCopy';
import GetAppIcon from '@material-ui/icons/GetApp';
import List from '@material-ui/icons/List';
import Print from '@material-ui/icons/Print';
import Cookies from 'js-cookie';
// import BoxLabelPDF from '../../PrintOuts/Pages/Drawer/BoxLabels';
import moment from 'moment';
import numQty from 'numeric-quantity';
import PDFMerger from 'pdf-merger-js/browser';
import React, { Component, createRef } from 'react';
import { CSVLink } from 'react-csv';
import CsvDownloader from 'react-csv-downloader';
import { connect } from 'react-redux';
import {
  Button,
  Card,
  CardBody,
  Col,
  Collapse,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from 'reactstrap';
import { bindActionCreators } from 'redux';
import { getFormValues } from 'redux-form';
import FileUploader from '../../../components/FileUploader/FileUploader';
import {
  deleteFilesFromOrder,
  deleteOrder,
  loadOrders,
  setSelectedOrder,
  submitOrder,
  updateOrder,
  uploadFilesToOrder,
} from '../../../redux/orders/actions';
import LoadingModal from '../../../utils/LoadingModal';
import CopyModal from '../../../utils/Modal';
import PrintModal from '../../PrintOuts/Modal/Modal';
import OrderEntry from '../OrderEntry/OrderEntry';
import Balance from './Balance/Balance';
import BalanceHistory from './Balance/BalanceHistory';
import MiscItems from './MiscItems';
import Navigation from './Navigation';
import ConversationNotes from './Notes/Conversation_Notes';
import exportEdges from '../../../utils/exportEdges';
import exportRazorGauge from '../../../utils/exportRazorGauge';
import { NotificationManager } from 'react-notifications';
import Tracking from './Tracking';

const cookie = Cookies.get('jwt');

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
      loadingModal: false,
      lipperExport: [],
      razorExport: [],
    };
    this.someRef = createRef();
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

  toggleTracking = () => {
    const scroll = document.getElementById('scrollModal');
    scroll.parentNode.scrollTo({ top: 0, behavior: 'smooth' });
    this.setState({
      trackingOpen: !this.state.trackingOpen,
    });
  };

  toggleBalance = () => {
    const scroll = document.getElementById('scrollModal');
    scroll.parentNode.scrollTo({ top: 0, behavior: 'smooth' });
    this.setState({
      balanceOpen: !this.state.balanceOpen,
    });
  };

  toggleMiscItems = () => {
    const scroll = document.getElementById('scrollModal');
    scroll.parentNode.scrollTo({ top: 0, behavior: 'smooth' });

    this.setState({
      miscItemsOpen: !this.state.miscItemsOpen,
    });
  };

  toggleFiles = () => {
    const scroll = document.getElementById('scrollModal');
    scroll.parentNode.scrollTo({ top: 0, behavior: 'smooth' });
    this.setState({
      filesOpen: !this.state.filesOpen,
    });
  };

  toggleNotes = () => {
    const scroll = document.getElementById('scrollModal');
    scroll.parentNode.scrollTo({ top: 0, behavior: 'smooth' });
    this.setState({
      notesOpen: !this.state.notesOpen,
    });
  };

  toggleDeleteModal = () =>
    this.setState({
      deleteModal: !this.state.deleteModal,
    });

  onUploaded = (e) => {
    const { uploadFilesToOrder, selectedOrder, user } = this.props;
    uploadFilesToOrder(selectedOrder, e, user, cookie);
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
    const { formState, submitOrder, user } = this.props;
    const data = formState ? formState : [];

    let newOrder = {
      ...data,
      job_info: {
        ...data.job_info,
        poNum: `${data.job_info?.poNum} - COPY`,
        status: 'Quote',
        Shipping_Scheduled: false,
      },
      status: 'Quote',
      tracking: [
        {
          status: `Order Copied from #${data.id + 100}`,
          date: moment().format(),
          user: user ? user?.FirstName : '',
        },
      ],
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
    delete newOrder['dueDate'];
    delete newOrder['DateOrdered'];
    delete newOrder['DateInvoiced'];
    delete newOrder['DateShipped'];
    delete newOrder['DateCompleted'];
    delete newOrder['DateInProduction'];
    delete newOrder['scan_date'];
    delete newOrder['Shipping_Scheduled'];

    delete newOrder['job_info.DateOrdered'];
    delete newOrder['job_info.DueDate'];
    delete newOrder['job_info.DateInvoiced'];
    delete newOrder['job_info.DateShipped'];
    delete newOrder['job_info.DateCompleted'];
    delete newOrder['job_info.DateInProduction'];
    delete newOrder['job_info.scan_date'];
    delete newOrder['job_info.Shipping_Scheduled'];

    newOrder['balance_history'] = [{ balance_paid: 0 }];
    newOrder['balance_paid'] = 0;
    newOrder['files'] = [];
    newOrder['Rush'] = false;
    newOrder['Sample'] = false;

    await submitOrder(newOrder, cookie);
    await this.props.toggle();
  };

  toggleLoadingModal = () => {
    this.setState({
      loadingModal: !this.state.loadingModal,
    });
  };

  exportEdgesHelper = () => {
    const { formState } = this.props;
    const data = {
      ...formState,
      Shipping_Scheduled: true,
    };

    if (data.Shipping_Scheduled) {
      exportEdges([data]);
    } else {
      NotificationManager.error(
        'This Order Does Not Have a Scheduled Due Date',
        'Error',
        2000
      );
    }
  };

  exportRazorHelper = () => {
    const { formState, breakdowns } = this.props;
    const data = {
      ...formState,
      Shipping_Scheduled: true,
    };

    if (data.Shipping_Scheduled) {
      exportRazorGauge([data], breakdowns);
    } else {
      NotificationManager.error(
        'This Order Does Not Have a Scheduled Due Date',
        'Error',
        2000
      );
    }
  };

  render() {
    const props = this.props;

    const { selectedOrder, printer_options, user, deleteFilesFromOrder } =
      this.props;

    const filesInfo =
      selectedOrder?.filesInfo?.length > 0
        ? selectedOrder?.filesInfo?.slice(0).reverse()
        : [];

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

        <Modal
          isOpen={props.modal}
          toggle={props.toggle}
          className="modal-lg"
          id="scrollModal"
        >
          <ModalHeader toggle={props.toggle}>
            Order #{selectedOrder && selectedOrder.id + 100}
          </ModalHeader>
          <ModalBody>
            {this.props.edit ? (
              <div>
                {user?.role?.type !== 'quality_control' ? (
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

                      {/* {!this.props.edit ? (
                        <Tooltip title="View Files" placement="top">
                          <IconButton onClick={this.toggleFiles}>
                            <Attachment style={{ width: '40', height: '40' }} />
                          </IconButton>
                        </Tooltip>
                      ) : null} */}
                    </Col>
                    <Col />
                    <Col />
                  </Row>
                ) : null}
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

                <Row>
                  {user?.role?.type !== 'quality_control' ? (
                    <Navigation
                      {...this.props}
                      toggleTracking={this.toggleTracking}
                      toggleBalance={this.toggleBalance}
                      toggleMiscItems={this.toggleMiscItems}
                      toggleNotes={this.toggleNotes}
                      toggleFiles={this.toggleFiles}
                    />
                  ) : (
                    <Col />
                  )}

                  <Col className="ml-5">
                    <Row>
                      <Col lg="6"></Col>

                      <Col>
                        <Tooltip title="Print" placement="top" className="mb-3">
                          <IconButton onClick={this.togglePrinter}>
                            <Print style={{ width: '40', height: '40' }} />
                          </IconButton>
                        </Tooltip>

                        {user.role?.type !== 'quality_control' &&
                        user.role?.type !== 'sales' ? (
                          <Tooltip
                            title="Copy Order"
                            placement="top"
                            className="mb-3"
                          >
                            <IconButton onClick={this.handleCopyModal}>
                              <FileCopy style={{ width: '40', height: '40' }} />
                            </IconButton>
                          </Tooltip>
                        ) : null}

                        {selectedOrder &&
                        selectedOrder.orderType === 'Door Order' &&
                        user.role?.type !== 'quality_control' &&
                        user.role?.type !== 'sales' ? (
                          <Tooltip
                            title="Export Edges"
                            placement="top"
                            className="mb-3"
                            onClick={this.exportEdgesHelper}
                          >
                            <IconButton>
                              <GetAppIcon
                                style={{ width: '40', height: '40' }}
                              />
                            </IconButton>
                          </Tooltip>
                        ) : null}

                        {selectedOrder &&
                        selectedOrder.orderType === 'Door Order' &&
                        user.role?.type !== 'quality_control' &&
                        user.role?.type !== 'sales' ? (
                          <Tooltip
                            title="Razorguage Export"
                            placement="top"
                            className="mb-3"
                            onClick={this.exportRazorHelper}
                          >
                            <IconButton>
                              <GetAppIcon
                                style={{ width: '40', height: '40' }}
                              />
                            </IconButton>
                          </Tooltip>
                        ) : null}

                        {(this.props.user &&
                          this.props.user.role &&
                          this.props.user.role &&
                          this.props.user.role.name === 'Administrator') ||
                        (this.props.user &&
                          this.props.user.role &&
                          this.props.user.role &&
                          this.props.user.role.name === 'Owner') ? (
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
                              ? selectedOrder.files
                                  ?.slice(0)
                                  .reverse()
                                  .map((i, index) => (
                                    <tr key={index}>
                                      {/* <th scope="row">{index + 1}</th> */}
                                      <td style={{ width: '75%' }}>{i.name}</td>
                                      <td>
                                        Uploaded by:{' '}
                                        {filesInfo.length > 0
                                          ? filesInfo[index]?.user
                                          : 'N/A'}
                                      </td>
                                      <td style={{ textAlign: 'right' }}>
                                        <a
                                          href={i.url}
                                          rel="noopener noreferrer"
                                          target="_blank"
                                        >
                                          <Button>View</Button>
                                        </a>
                                      </td>
                                      <td style={{ textAlign: 'right' }}>
                                        <Button
                                          onClick={() =>
                                            deleteFilesFromOrder(
                                              selectedOrder,
                                              i,
                                              cookie
                                            )
                                          }
                                        >
                                          Delete
                                        </Button>
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
                    <Tracking selectedOrder={selectedOrder} />
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
                        <ConversationNotes
                          toggleBalance={this.toggleBalance}
                          selectedOrder={props.selectedOrder}
                        />
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
                        <Balance
                          toggleBalance={this.toggleBalance}
                          selectedOrder={props.selectedOrder}
                        />
                      </CardBody>
                    </Card>
                  </Col>
                  <Col>
                    <Card>
                      <CardBody>
                        <h5>Balance History</h5>
                        <BalanceHistory
                          edit={!this.props.edit}
                          editable={this.props.editable}
                        />
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
                        <MiscItems
                          toggle={this.toggleMiscItems}
                          edit={!this.props.edit}
                        />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </Collapse>
            </div>

            <div>
              {/* order edit here */}

              <OrderEntry
                isEdit={true}
                editOrderType={props.selectedOrder?.orderType}
                selectedOrder={props.selectedOrder}
                editable={this.props.editable}
                edit={!this.props.edit}
                toggle={props.toggle}
                toggleTracking={this.toggleTracking}
                toggleBalance={this.toggleBalance}
                toggleMiscItems={this.toggleMiscItems}
                toggleNotes={this.toggleNotes}
                toggleFiles={this.toggleFiles}
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
          {...this.props}
          toggle={this.togglePrinter}
          modal={this.state.printModal}
          printer_options={printer_options}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, prop) => ({
  formState: getFormValues('Order')(state),
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
      deleteFilesFromOrder,
      submitOrder,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(OrderPage);
