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
import { NotificationContainer, NotificationManager } from 'react-notifications';



const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

  // componentDidMount = async () => {
  //   const props = this.props;
  //   await props.loadOrders();
  //   await props.loadSales();
  //   await props.countOrders();
  //   await props.getWoodtypes();
  //   await props.getDesigns();
  //   await props.getEdges();
  //   await props.getFinish();
  //   await props.getGrades();
  //   await props.getMoulds();
  //   await props.getPanels();
  //   await props.getHinges();
  //   await props.getBoxThickness();
  //   await props.getBoxBottoms();
  //   await props.getAssembly();
  //   await props.getNotch();
  //   await props.getDrawerFinish();
  //   await props.loadShippingMethod();

  //   const token = Cookies.get("jwt");
  //   if (!this.props.loggedIn) {
  //     this.props.login(token);
  //   }
  // }

  onNewOrder = (e) => {

    console.log(e)
  }

  render() {


    if ((!this.props.loadedWoodtype
      && !this.props.loadedDesign
      && !this.props.loadedEdge
      && !this.props.loadedMould
      && !this.props.loadedPanel
      && !this.props.loadedGrade
      && !this.props.loadedFinish
      && !this.props.loadedBoxThickness
      && !this.props.loadedBoxBottoms
      && !this.props.loadedAssembly
      && !this.props.loadedNotchb
      && !this.props.loadedHinges
      && !this.props.loadedDrawerFinishes
      && !this.props.customerDBLoaded
      && !this.props.ordersDBLoaded
    )) {
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
  loadedWoodtype: state.part_list.loadedWoodtype,
  loadedDesign: state.part_list.loadedDesign,
  loadedEdge: state.part_list.loadedEdge,
  loadedMould: state.part_list.loadedMould,
  loadedPanel: state.part_list.loadedPanel,
  loadedFinish: state.part_list.loadedFinish,
  loadedBoxThickness: state.part_list.loadedBoxThickness,
  loadedBoxBottoms: state.part_list.loadedBoxBottoms,
  loadedAssembly: state.part_list.loadedAssembly,
  loadedNotch: state.part_list.loadedNotch,
  loadedHinges: state.part_list.loadedHinges,
  loadedDrawerFinishes: state.part_list.loadedDrawerFinishes
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

