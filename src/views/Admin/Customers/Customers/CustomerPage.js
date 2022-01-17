import React, { Component } from 'react';
import {
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
  CardBody,
  Table,
} from 'reactstrap';
import Edit from './components/Edit';
import { uploadFilesToCustomer } from '../../../../redux/customers/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import OrderPage from '../../Orders/OrderPage';
import CompanyOrders from './components/CompanyOrders';
import Maps from './components/Maps';
import Notes from './components/Notes';
import FileUploader from '../../../../components/FileUploader/FileUploader';
import Cookies from 'js-cookie';

const cookie = Cookies.get('jwt');

class CustomerPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false,
      selectedOrder: null,
      modal: false,
      orderEdit: false,
      orders: [],
    };

    this.toggle = this.toggle.bind(this);

    this.options = {
      sortIndicator: true,
      hideSizePerPage: true,
      paginationSize: 5,
      hidePageListOnlyOnePage: true,
      clearSearch: true,
      alwaysShowAllBtns: false,
      withFirstAndLast: false,
    };
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
    if (this.state.orderEdit) {
      this.setState({
        orderEdit: false,
      });
    }
  };

  editable = () => {
    this.setState({
      orderEdit: !this.state.orderEdit,
    });
  };

  onEdit = () => {
    this.setState({
      edit: !this.state.edit,
    });
  };

  onUploaded = (e) => {
    const { uploadFilesToCustomer, selectedCompanies } = this.props;
    uploadFilesToCustomer(selectedCompanies, e, cookie);
  };

  render() {
    const props = this.props;
    const { locations, defaultCenter, selectedCompanies, orders } = this.props;

    let updateOrders;

    if (this.props.orders.length > 0) {
      updateOrders = orders.filter(
        (x) => x.job_info?.customer?.id === this.props.selectedCompanies.id
      );
    }

    return (
      <div className="animated resize">
        <Modal isOpen={props.modal} toggle={props.toggle} className="modal-lg">
          <ModalHeader toggle={props.toggle}>Companies</ModalHeader>
          <ModalBody>
            <Row>
              <Col lg='6'>
                <Edit
                  onEdit={this.onEdit}
                  selectedCompanies={props.selectedCompanies}
                  edit={!this.state.edit}
                />

                <Row>
                  <Col lg="12">
                    <Card>
                      <CardBody>
                        <h4>Attachments</h4>
                        <Table striped>
                          <tbody>
                            {selectedCompanies
                              ? selectedCompanies?.files?.map((i, index) => (
                                <tr>
                                  <th scope="row">{index + 1}</th>
                                  <td>{i.name}</td>
                                  <td style={{ textAlign: 'right' }}>
                                    <a
                                      href={i.url}
                                      rel="noopener noreferrer"
                                      target="_blank"
                                    >
                                      <img
                                        src={i.url}
                                        alt={i.name}
                                        width="50"
                                        height="50"
                                      />
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
              </Col>

              <Col lg='6'>
                <Card>
                  <div className="animated resize">
                    <Maps
                      selectedCompany={this.props.selectedCompanies}
                      locations={locations}
                      defaultCenter={defaultCenter}
                    />
                    <CompanyOrders orders={updateOrders} company={selectedCompanies?.Company} />
                  </div>
                </Card>
                <Card>
                  <CardBody>
                    <Notes />
                  </CardBody>
                </Card>
                
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={props.toggle}>
              Close
            </Button>
          </ModalFooter>
        </Modal>

        {!this.state.modal ? (
          <OrderPage
            toggle={this.toggle}
            modal={this.state.modal}
            selectedOrder={this.state.selectedOrder}
            company={selectedCompanies && selectedCompanies.Company}
            editable={this.editable}
            edit={this.state.orderEdit}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  ordersDBLoaded: state.Orders.ordersDBLoaded,
  customerOrder: state.Orders.customerOrder,
  selectedCompanies: state.customers.selectedCompanies,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      uploadFilesToCustomer,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CustomerPage);
