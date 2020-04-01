import React, { Component } from 'react';
import {
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col
} from 'reactstrap';
import NonEdit from './components/NonEdit';
import Edit from './components/Edit';
import {
  loadCustomerOrder
} from '../../../../redux/orders/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import OrderPage from '../../Orders/OrderPage';
import CompanyOrders from './components/CompanyOrders'
import Maps from './components/Maps'


class CustomerPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false,
      selectedOrder: [],
      modal: false,
      orderEdit: false,
      orders: []
    };

    this.toggle = this.toggle.bind(this);

    this.options = {
      sortIndicator: true,
      hideSizePerPage: true,
      paginationSize: 5,
      hidePageListOnlyOnePage: true,
      clearSearch: true,
      alwaysShowAllBtns: false,
      withFirstAndLast: false
    };
  }

  componentDidMount() { 
    this.setState({ orders: this.props.orders.filter(
      x => x.job_info.customer.id === this.props.selectedCompanies.id
    )});
  }




  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
    if (this.state.orderEdit) {
      this.setState({
        orderEdit: false
      });
    }
  };

  editable = () => {
    this.setState({
      orderEdit: !this.state.orderEdit
    });
  };

  onEdit = () => {
    this.setState({
      edit: !this.state.edit
    });
  };

  render() {
    const props = this.props;
    const { locations, defaultCenter } = this.props;


     let orders= this.props.orders.filter(
      x => x.job_info.customer.id === this.props.selectedCompanies.id
    )

    return (
      <div className="animated resize">
        <Modal isOpen={props.modal} toggle={props.toggle} className="modal-lg">
          <ModalHeader toggle={props.toggle}>Companies</ModalHeader>
          <ModalBody>
            <Row>
              <Col>
                <Col>
                  {this.state.edit === true ? (
                    <Edit
                      onEdit={this.onEdit}
                      selectedCompanies={props.selectedCompanies}
                    />
                  ) : (
                      <NonEdit
                        onEdit={this.onEdit}
                        selectedCompanies={props.selectedCompanies}
                        salesRep={props.salesRep}
                      />
                    )}
                </Col>
              </Col>

              <Col>
                <Card>
                  <div className="animated resize">
                    <Maps
                      selectedCompany={this.props.selectedCompanies}
                      locations={locations}
                      defaultCenter={defaultCenter}
                    />
                    <CompanyOrders
                      orders={orders}
                    />
                  </div>
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

        <OrderPage
          toggle={this.toggle}
          modal={this.state.modal}
          selectedOrder={this.state.selectedOrder}
          company={this.props.selectedCompanies.Company}
          editable={this.editable}
          edit={this.state.orderEdit}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  ordersDBLoaded: state.Orders.ordersDBLoaded,
  customerOrder: state.Orders.customerOrder
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadCustomerOrder
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerPage);
