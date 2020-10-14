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

import Cookies from 'js-cookie';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  loadOrders,
  getDeliveries,
  socketReceiveUpdateStatus
} from '../../redux/orders/actions';
import {
  loadMiscItems,
  loadShippingMethod,
  loadPaymentTypes,
  loadPaymentTerms,
} from '../../redux/misc_items/actions';
import {
  loadSales,
} from '../../redux/sales/actions';

import { loadCustomers } from '../../redux/customers/actions';

import {
  getAllProducts,
  getBreakdowns,
  getBoxBreakdowns,
  getPricing
} from '../../redux/part_list/actions';
import { login, getUsers } from '../../redux/users/actions';

import Loader from '../../views/Admin/Loader/Loader';
import { NotificationContainer } from 'react-notifications';


const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

  componentDidMount = async () => {
    const {
      loadShippingMethod,
      loadPaymentTypes,
      loadPaymentTerms,
      getBreakdowns,
      getBoxBreakdowns,
      getPricing,
      getUsers,
      login,
      loadSales,
      loadOrders,
      getDeliveries,
      loadedBreakdowns,
      loadedPaymentTypes,
      loadedPaymentTerms,
      loadedShippingMethods,
      loadedSales,
      loadedBoxBreakdowns,
      loadedPricing,
      loadCustomers,
      loadMiscItems,
      loadedMiscItems,
      getAllProducts,
      loadedProducts

    } = this.props;

    const cookie = await Cookies.get('jwt');

    if (cookie) {

  
      await getAllProducts(cookie);
      
      await getPricing(cookie);

      await loadOrders(cookie);
      await loadCustomers(cookie);
      await login(cookie);
      await getUsers(cookie);

      if (!loadedSales) {
        await loadSales(cookie);
      }

      if (!loadedMiscItems) {
        await loadMiscItems(cookie);
      }

      await getDeliveries(cookie);

   
  
 


      if (!loadedBreakdowns) {
        await getBreakdowns(cookie);
      }

      if (!loadedBoxBreakdowns) {
        await getBoxBreakdowns(cookie);
      }


      if (!loadedShippingMethods) {
        await loadShippingMethod(cookie);
      }


      if (!loadedPaymentTypes) {
        await loadPaymentTypes(cookie);
      }


      if (!loadedPaymentTerms) {
        await loadPaymentTerms(cookie);
      }

    } else {
      alert('not logged in');
    }
  }

  render() {

    const { customerDBLoaded, ordersDBLoaded, loadedProducts } = this.props;

    if (
      (!customerDBLoaded)
    ) {
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
  orders: state.Orders.orders,
  ordersDBLoaded: state.Orders.ordersDBLoaded,
  loggedIn: state.users.loggedIn,
  loadedOrders: state.part_list.loadedOrders,
  loadedBreakdowns: state.part_list.loadedBreakdowns,
  loadedBoxBreakdowns: state.part_list.loadedBoxBreakdowns,
  customerDBLoaded: state.customers.customerDBLoaded,
  loadedPaymentTypes: state.misc_items.loadedPaymentTypes,
  loadedPaymentTerms: state.misc_items.loadedPaymentTerms,
  loadedShippingMethods: state.misc_items.loadedShippingMethods,
  loadedSales: state.sales.loadedSales,
  loadedPricing: state.part_list.loadedPricing,
  customerDB: state.customers.customerDB,
  loadedMiscItems: state.misc_items.loadedMiscItems,
  loadedProducts: state.part_list.loadedProducts
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadOrders,
      loadCustomers,
      loadSales,
      loadShippingMethod,

      getAllProducts,

      getDeliveries,

      getBreakdowns,
      getBoxBreakdowns,

      getPricing,
      getUsers,
      loadPaymentTypes,
      loadPaymentTerms,

      loadMiscItems,

      login,

      socketReceiveUpdateStatus



    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultLayout);

