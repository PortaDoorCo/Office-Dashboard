import React, { Component } from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import OrderTable from './components/OrderTable'
import RestrictedOrderTable from './components/RestrictedOrderTable'
import CompanyTable2 from '../Customers/Customers/CompanyTable2'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadOrders, loadCustomers } from '../../../redux/customers/actions';
import {
  // getWoodtypes,
  // getDesigns,
  // getEdges,
  // getFinish,
  // getMoulds,
  // getPanels,
  // getHinges
} from '../../../redux/part_list/actions';
import { login } from '../../../redux/users/actions';
import Chart1 from './components/Chart1';
import Chart2 from './components/Chart2';
import Chart3 from './components/Chart3';
import Chart4 from './components/Chart4'
import Map from './components/Map'
import Maps from './components/Maps'
import StatusChart from '../Tracking/Tracking'




class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      orders: [],
      modal: false,
      selectedOrder: [],
      orderEdit: false
    };
  }



  render() {

    const { role, orders } = this.props;




    return (
      <div className="animated fadeIn">
        {role.type === 'management' || role.type === 'authenticated' || role.type === 'owner' ?
          <div>
            <Row>
              <Col lg="4">
                <Chart2 />
              </Col>
              <Col lg="4">
                <Chart3 />
              </Col>
              <Col lg="4">
                <Chart4 />
              </Col>
            </Row>
            <Row>
              <Col>
                <Chart1 />
              </Col>
            </Row>
            <Row>
              <Col style={{ height: 600 }}>
                <Maps />
              </Col>
            </Row>

          </div>
          :
          <div>
            <Row>
              <Col style={{ height: 600 }}>
                <Maps />
              </Col>
            </Row>
          </div>
        }

        <Row>
          <Col>
            {role.type === 'management' || role.type === 'authenticated' ?
              <OrderTable
                orders={this.props.orders}
              />
              :
              <RestrictedOrderTable
                orders={this.props.orders}
              />
            }
          </Col>

        </Row>

        <Row>
          <Col>
            <CompanyTable2
              customerDB={this.props.customerDB}
            />
          </Col>

        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  customerDB: state.customers.customerDB,
  woodtypes: state.part_list.woodtypes,
  designs: state.part_list.designs,
  edges: state.part_list.edges,
  moulds: state.part_list.moulds,
  panels: state.part_list.panels,
  finish: state.part_list.finish,
  hinges: state.part_list.hinges,
  customerDBLoaded: state.customers.customerDBLoaded,
  ordersDBLoaded: state.Orders.ordersDBLoaded,
  loadedWoodtype: state.part_list.loadedWoodtype,
  loadedDesign: state.part_list.loadedDesign,
  loadedEdge: state.part_list.loadedEdge,
  loadedMould: state.part_list.loadedMould,
  loadedPanel: state.part_list.loadedPanel,
  loadedGrade: state.part_list.loadedGrade,
  loadedFinish: state.part_list.loadedFinish,
  loadedHinges: state.part_list.loadedHinges,
  loggedIn: state.users.loggedIn,
  role: state.users.user.role
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // loadOrders,
      // loadCustomers,
      // getWoodtypes,
      // getDesigns,
      // getEdges,
      // getFinish,
      // getMoulds,
      // getPanels,
      // getHinges,
      login
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
