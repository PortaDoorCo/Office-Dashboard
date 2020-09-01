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
import NewCustomer from './components/NewCustomer';
import {
} from '../../../../redux/orders/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import OrderPage from '../../Orders/OrderPage';
import CompanyOrders from './components/CompanyOrders';
import Maps from './components/Maps';


class CustomerPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false,
      selectedOrder: null,
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

  // componentDidMount() {
  //   if (this.props.orders.length > 0) {
  //     this.setState({
  //       orders: this.props.orders.filter(
  //         x => x.job_info.customer.id === this.props.selectedCompanies.id
  //       )
  //     });
  //   }
  // }




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
  const { locations, defaultCenter, selectedCompanies, orders } = this.props;

  let updateOrders;

  if (this.props.orders.length > 0) {
    updateOrders = orders.filter(
      x => x.job_info.customer.id === this.props.selectedCompanies.id
    );
  }


  return (
    <div className="animated">
      <Modal isOpen={props.modal} toggle={props.toggle} className="modal-lg">
        <ModalHeader toggle={props.toggle}>Companies</ModalHeader>
        <ModalBody>

          <NewCustomer
            onEdit={this.onEdit}
            edit={false}
            toggle={this.props.toggle}
          />

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
  orders: state.Orders.orders,
  ordersDBLoaded: state.Orders.ordersDBLoaded,
  customerOrder: state.Orders.customerOrder,
  selectedCompanies: state.customers.selectedCompanies
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {

    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerPage);