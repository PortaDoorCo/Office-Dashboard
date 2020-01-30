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

  componentDidMount = async() => {
    const props = this.props;

    const cookie = await Cookies.get("jwt");

    if(cookie){
      await props.login(cookie);
      await props.loadSales(cookie);
      await props.countOrders(cookie);
      await props.getWoodtypes(cookie);
      await props.getDesigns(cookie);
      await props.getEdges(cookie);
      await props.getFinish(cookie);
      await props.getMoulds(cookie);
      await props.getPanels(cookie);
      await props.getHinges(cookie);
      await props.getBoxThickness(cookie);
      await props.getBoxBottoms(cookie);
      await props.getAssembly(cookie);
      await props.getNotch(cookie);
      await props.getDrawerFinish(cookie);
      await props.loadShippingMethod(cookie);
      await props.loadOrders(cookie);
      
    } else {
      alert('not logged in')
    }

  }

  render() {


    // if (
    //   !this.props.orders.length>0
    // ) {
    //   return <Loader />;
    // } else {
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
// }

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
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
  loadedDrawerFinishes: state.part_list.loadedDrawerFinishes,
  loggedIn: state.users.loggedIn
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

