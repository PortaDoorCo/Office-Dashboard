import React, { useState, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import Tour from 'reactour'

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

import { NotificationManager } from 'react-notifications';

import {
  loadOrders,
  getDeliveries,
  socketReceiveUpdateStatus,
} from '../../redux/orders/actions';
import {
  loadMiscItems,
  loadShippingMethod,
  loadPaymentTypes,
  loadPaymentTerms,
} from '../../redux/misc_items/actions';
import { loadSales } from '../../redux/sales/actions';

import { loadCustomers } from '../../redux/customers/actions';

import {
  getAllProducts,
  getBreakdowns,
  getBoxBreakdowns,
  getPricing,
} from '../../redux/part_list/actions';
import { login, getUsers } from '../../redux/users/actions';

import Loader from '../../views/Admin/Loader/Loader';
import { NotificationContainer } from 'react-notifications';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));


const steps = [
  {
    selector: '[data-tour="order-table"]',
    content: 'Welcome to the Porta Door Dashboard',
  },
  {
    selector: '.side-bar-tour',
    content: 'Here you will be able to navigate to different parts of the app.  Click Door Order to create your first order.',
  },
  {
    selector: '.job-info-tour',
    content: 'Here is where you will select your customer, shipping method, due date and shipping address.',
  },
  {
    selector: '.order-tour',
    content: 'Here is where you enter the door info.  Select between a variety of options from woodtypes, designs, edges, etc.',
  },
  {
    selector: '.misc-item-tour',
    content: 'Here is where you will add Miscellaneous Items and submit your order.',
  },
  {
    selector: '.side-bar-tour',
    content: 'Click on Settings to view more settings',
  },
  {
    selector: '.account-tour',
    content: 'Here is where your account settings are.  Edit your name, email, and password.  It is generally good practice to change your password a few times a year.',
  },
  {
    selector: '.account-tour',
    content: 'Click on Doors in the Settings Navigation bar at the top and then Cope and Stick',
    position: 'top'
  },
  {
    selector: '.account-tour',
    content: 'Here you can see all the attributes to the doors.  With elevated credentials you will be able to edit things such as pricing, breakdowns, and other attributes',
    position: 'top'
  },
  {
    selector: '.app',
    content: 'Now please enjoy :) -  Feel free to contact me on slack or by email Justin@portadoor.com',
    position: 'top'
  },

  // ...
];


let DefaultLayout = (props) => {
  let loading = () => (
    <div className="animated fadeIn pt-1 text-center">
      <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
  );

  const [isTourOpen, setIsTourOpen] = useState(true);


  const { customerDBLoaded } = props;

  if (!customerDBLoaded) {
    return (
      <div>
        <Loader />
      </div>
    );
  } else {
    return (
      <div className="app">
        <Tour
          steps={steps}
          isOpen={isTourOpen}
          onRequestClose={() => setIsTourOpen(false)}
          updateDelay={5}
        />
        <NotificationContainer />
        <AppHeader fixed>
          <Suspense fallback={loading()}>
            <DefaultHeader />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg" className="side-bar-tour">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={navigation} {...props} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} />
            <Container fluid>
              <Suspense fallback={loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={(props) => <route.component {...props} />}
                      />

                    ) : null;
                  })}
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
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
  loadedProducts: state.part_list.loadedProducts,
});

const mapDispatchToProps = (dispatch) =>
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

      socketReceiveUpdateStatus,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);
