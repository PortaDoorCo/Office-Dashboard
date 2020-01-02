import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';

import Cookies from "js-cookie";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { loadOrders, loadCustomers, countOrders, loadSales, loadShippingMethod } from "../../redux/orders/actions";
import {
  getWoodtypes,
  getDesigns,
  getEdges,
  getFinish,
  getGrades,
  getMoulds,
  getPanels,
  getHinges,
  getBoxThickness,
  getBoxBottoms,
  getAssembly,
  getNotch,
  getDrawerFinish
} from "../../redux/part_list/actions";
import { login } from "../../redux/users/actions";

import Loader from '../../views/Admin/Loader/Loader'
import { NotificationContainer } from 'react-notifications';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

  componentDidMount() {
    const props = this.props;
    console.log(this.props.customerDBLoaded);

    if (!this.props.customerDBLoaded) {
      props.loadOrders();
      props.loadSales();
      props.countOrders();
      props.loadCustomers();
      props.getWoodtypes();
      props.getDesigns();
      props.getEdges();
      props.getFinish();
      props.getGrades();
      props.getMoulds();
      props.getPanels();
      props.getHinges();
      props.getBoxThickness();
      props.getBoxBottoms();
      props.getAssembly();
      props.getNotch();
      props.getDrawerFinish();
      props.loadShippingMethod();
    }

    const token = Cookies.get("jwt");
    if (!this.props.loggedIn) {
      this.props.login(token);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.orders.sessionOrders !== prevProps.orders.sessionOrders) {
      this.props.countOrders();
      this.props.loadOrders();
    }
    if (this.props.orders.sessionCustomers !== prevProps.orders.sessionCustomers) {
      this.props.loadCustomers();
    }
  }

  render() {
    if (!this.props.customerDBLoaded && !this.props.ordersDBLoaded) {
      return <Loader />;
    } else {
      return (
        <div className="app">
          <NotificationContainer />
          <AppHeader fixed>
            <Suspense fallback={this.loading()}>
              <DefaultHeader />
            </Suspense>
          </AppHeader>
          <div className="app-body">
            <AppSidebar fixed display="lg">
              <AppSidebarHeader />
              <AppSidebarForm />
              <Suspense>
                <AppSidebarNav navConfig={navigation} {...this.props} />
              </Suspense>
              <AppSidebarFooter />
              <AppSidebarMinimizer />
            </AppSidebar>
            <main className="main">
              <AppBreadcrumb appRoutes={routes} />
              <Container fluid>
                <Suspense fallback={this.loading()}>
                  <Switch>
                    {routes.map((route, idx) => {
                      return route.component ? (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={props => (
                            <route.component {...props} />
                          )} />
                      ) : (null);
                    })}
                    <Redirect from="/" to="/dashboard" />
                  </Switch>
                </Suspense>
              </Container>
            </main>
            <AppAside fixed>
              <Suspense fallback={this.loading()}>
                <DefaultAside />
              </Suspense>
            </AppAside>
          </div>
          <AppFooter>
            <Suspense fallback={this.loading()}>
              <DefaultFooter />
            </Suspense>
          </AppFooter>
        </div>
      );
    }
  }
}

const mapStateToProps = (state, prop) => ({
  orders: state.Orders,
  sessionOrders: state.Orders.sessionOrders,
  sessionCustomers: state.Orders.sessionCustomers,
  customerDBLoaded: state.Orders.customerDBLoaded,
  ordersDBLoaded: state.Orders.ordersDBLoaded,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadOrders,
      loadCustomers,
      loadSales,
      loadShippingMethod,
      getWoodtypes,
      getDesigns,
      getEdges,
      getFinish,
      getGrades,
      getMoulds,
      getPanels,
      getHinges,
      login,
      countOrders,
      getBoxThickness,
      getBoxBottoms,
      getAssembly,
      getNotch,
      getDrawerFinish
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultLayout);

