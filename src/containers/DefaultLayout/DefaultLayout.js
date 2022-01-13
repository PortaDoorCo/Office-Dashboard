import React, { useState, Suspense, useEffect } from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { Container, Button } from 'reactstrap';
import Tour from 'reactour';

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
import customerNav from '../../_customerNav';
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
import { login, getUsers, updateAppTour } from '../../redux/users/actions';

import Loader from '../../views/Admin/Loader/Loader';
import { NotificationContainer } from 'react-notifications';
import db_url from '../../redux/db_url';
import io from 'socket.io-client';
import ErrorBoundary from '../../ErrorBoundry';
import _qcNav from '../../_qcNav';
import _salesNav from '../../_sales_nav';


const socket = io(db_url);

const cookie = Cookies.get('jwt');

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

let DefaultLayout = (props, context) => {

  let loading = () => (
    <div className="animated fadeIn pt-1 text-center">
      <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
  );


  useEffect(() => {
    if(!props.currentVersion){
      NotificationManager.info(
        'A new version of the app is now available!  Click the icon above to refresh the app',
        'A New Version is Available',
        5000
      );
    }
  },[props.currentVersion]);


  let history = useHistory();

  const steps = [
    {
      selector: '[data-tour="order-table"]',
      content: () => (
        <div>
          <p>Welcome to the Porta Door Dashboard!</p>
          <p>Let take a quick tour!</p>
        </div>
      ),
    },
    {
      selector: '.side-bar-tour',
      content: ({ goTo }) => (
        <div>
          <p>
            Here you will be able to navigate to different parts of the app.
            Click Door Order to create your first order.
          </p>
          <Button
            color="primary"
            onClick={async (e) => {
              e.preventDefault();
              await history.push('/door-order');
              await goTo(2);
            }}
          >
            Create Your First Order
          </Button>
        </div>
      ),
    },
    {
      selector: '',
      content: 'Welcome To Your First Order - Click Next to Proceed',
    },
    {
      selector: '.job-info-tour',
      content:
        'Here is where you will select your customer, shipping method, due date and shipping address.',
    },
    {
      selector: '.order-tour',
      content:
        'Here is where you enter the door info.  Select between a variety of options from woodtypes, designs, edges, etc.',
    },
    {
      selector: '.misc-item-tour',
      content:
        'Here is where you will add Miscellaneous Items and submit your order.',
    },
    {
      selector: '.side-bar-tour',
      content: ({ goTo }) => (
        <div>
          <p>
            As you can see there a few other options for order types. You can
            also view reports and customers. For now lets view the settings.
            Click Settings To Continue
          </p>
          <Button
            color="primary"
            onClick={async (e) => {
              e.preventDefault();
              await history.push('/settings');
              await goTo(7);
            }}
          >
            Go To Settings
          </Button>
        </div>
      ),
    },
    {
      selector: '.account-tour',
      content:
        'Here is where your account settings are.  Edit your name, email, and password.  It is generally good practice to change your password a few times a year.',
    },
    {
      selector: '.account-tour',
      content:
        'Click on Doors in the Settings Navigation bar at the top and then Cope and Stick - Then click next to proceed',
      position: 'top',
    },
    {
      selector: '.account-tour',
      content:
        'Here you can see all the attributes to the doors.  With elevated credentials you will be able to edit things such as pricing, breakdowns, and other attributes',
      position: 'top',
    },
    {
      selector: '.app',
      content: () => (
        <div>
          <center>
            <p>Now please enjoy :)</p>
            <p>
              Feel free to contact me on{' '}
              <a href="https://portadoor.slack.com">Slack</a>
            </p>
            <p>
              or by email{' '}
              <a href="mailto: justin@portadoor.com">justin@portadoor.com</a>
            </p>
            <p>❤️</p>
          </center>
        </div>
      ),
      position: 'top',
    },

    // ...
  ];

  const [isTourOpen, setIsTourOpen] = useState(true);

  const { customerDBLoaded, app_tour, userId, currentVersion, updateAppTour, role } = props;

  

  // 

  if (!customerDBLoaded) {
    return (
      <div>
        <Loader />
      </div>
    );
  } else {
    return (
      <ErrorBoundary>
        <div className="app">

          <Tour
            steps={steps}
            isOpen={app_tour}
            onRequestClose={async (e) => {
              e.preventDefault();
              await history.push('/');
              await updateAppTour(cookie, userId);
            }}
            updateDelay={1}
          />
          <NotificationContainer />
          <AppHeader fixed>
            <Suspense fallback={loading()}>
              <DefaultHeader currentVersion={currentVersion} />
            </Suspense>
          </AppHeader>
          <div className="app-body">
            <AppSidebar fixed display="lg" className="side-bar-tour">
              <AppSidebarHeader />
              <AppSidebarForm />
              <Suspense fallback={loading()}>
                <AppSidebarNav navConfig={role.type === 'customer' ? customerNav : role.type === 'quality_control' ? _qcNav : role.type === 'sales' ? _salesNav : navigation} {...props} />
              </Suspense>
              <AppSidebarFooter />
              <AppSidebarMinimizer />
            </AppSidebar>
            <main className="main">
              <AppBreadcrumb appRoutes={routes} />
              <Container fluid className="resize">
                <Suspense fallback={loading()}>
                  <Switch>
                    {routes.map((route, idx) => {
               
                      return route.component ? (
                        <Route
                          key={idx}
                          path={route.path}
                          exact={route.exact}
                          name={route.name}
                          render={(props) => {
                
                            return(
                              <route.component {...props} route={route} />
                            );
                          
                          }}
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
      </ErrorBoundary>
    );
  }
};

const mapStateToProps = (state, prop) => ({
  orders: state.Orders.orders,
  ordersDBLoaded: state.Orders.ordersDBLoaded,
  app_tour: state.users.app_tour,
  role: state.users.user.role,
  userId: state.users.user.id,
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
  currentVersion: state.users.current_version
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
      updateAppTour,

      socketReceiveUpdateStatus,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);
