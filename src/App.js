import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';
import Cookies from 'js-cookie';
import Login from './views/Pages/Login/Login';
import Register from './views/Pages/Register/Register';
import NewPassword from './views/Pages/NewPassword/NewPassword';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NotificationManager } from 'react-notifications';
import {
  loadOrders,
  loadAllOrders,
  getDeliveries,
  orderAdded,
  orderUpdated,
  orderDeleted,
} from './redux/orders/actions';
import { loadShippingMethod } from './redux/misc_items/actions';
import {
  getSingleProduct,
  productAdded,
  productDeleted,
  productUpdated,
} from './redux/part_list/actions';
import { loadSales } from './redux/sales/actions';
import { loadCustomers, loadAllCustomers } from './redux/customers/actions';
import { setLogin } from './redux/users/actions';
import {
  getAllProducts,
  getBreakdowns,
  getBoxBreakdowns,
  getPricing,
} from './redux/part_list/actions';
import {
  loadMiscItems,
  loadPaymentTypes,
  loadPaymentTerms,
  miscItemAdded,
  miscItemDeleted,
  miscItemUpdated
} from './redux/misc_items/actions';
import { login, getUsers } from './redux/users/actions';
import io from 'socket.io-client';
import db_url from './redux/db_url';

const socket = io(db_url);
const cookie = Cookies.get('jwt');

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

const PrivateRoute = ({ component: Component, ...rest }, isLogged) => (
  <Route
    {...rest}
    render={(props) => {
      return rest.isLogged ? (
        <Component {...props} isLogged={rest.isLogged} />
      ) : (
        <Redirect to={{ pathname: '/login' }} />
      );
    }}
  />
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: false,
      cookie: null
    };
  }

  cookies = (cb) => {
    const getCookie = Cookies.get('jwt');
    if (getCookie) {
      this.setState({
        isAuth: true,
      }, () => {
        this.props.setLogin();
        if (cb) cb();
      });
    }
  };

  componentDidMount = async () => {
    const {
      productAdded,
      productDeleted,
      productUpdated,
      orderAdded,
      orderUpdated,
      orderDeleted,
      miscItemAdded,
      miscItemDeleted,
      miscItemUpdated
    } = this.props;

    this.cookies();

   
    socket.on(
      'order_submitted',
      (res) => (
        NotificationManager.success(
          `Order #${res.orderNum} added`,
          'New Order',
          2000
        ),
        orderAdded(res)
      )
    );
    socket.on(
      'order_updated',
      (res) => (
        NotificationManager.success(
          `Order #${res.orderNum} updated`,
          'Order Updated',
          2000
        ),
        orderUpdated(res)
      )
    );
    socket.on(
      'status_updated',
      (res) => (
        NotificationManager.success(
          `Order #${res.orderNum} has been updated`,
          'An order has been updated',
          2000
        ),
        orderUpdated(res)
      )
    );

    socket.on(
      'order_deleted',
      (res) => (
        NotificationManager.success('Order Deleted', 'Order Deleted', 2000),
        orderDeleted(res)
      )
    );

    socket.on('delivery_added', (res) => this.props.getDeliveries(cookie));
    socket.on('customer_added', (res) =>
      this.props.loadCustomers(cookie, 2000)
    );
    socket.on('customer_updated', (res) =>
      this.props.loadCustomers(cookie, 2000)
    );

    socket.on(
      'product_updated',
      (res, entity) => (
        NotificationManager.success(
          'Product Updated',
          'Product Updated',
          2000
        ),
        productUpdated(res, entity)
      )
    );
    socket.on(
      'product_added',
      (res, entity) => (
        NotificationManager.success('Product Added', 'Product Added', 2000),
        productAdded(res, entity)
      )
    );
    socket.on(
      'product_deleted',
      (res) => (
        NotificationManager.success(
          'Product Deleted',
          'Product Deleted',
          2000
        ),
        productDeleted(res)
      )
    );
    socket.on(
      'misc_item_added',
      (res, entity) => (
        NotificationManager.success('Misc Item Added', 'Misc Item Added', 2000),
        miscItemAdded(res, entity)
      )
    );
    socket.on(
      'misc_item_updated',
      (res, entity) => (
        NotificationManager.success(
          'Misc Item Updated',
          'Misc Item Updated',
          2000
        ),
        miscItemUpdated(res)
      )
    );
    socket.on(
      'misc_item_deleted',
      (res) => (
        NotificationManager.success(
          'Misc Item Deleted',
          'Misc Item Deleted',
          2000
        ),
        miscItemDeleted(res)
      )
    );
    
  };

  componentDidUpdate = async (prevProps) => {
    const {
      getAllProducts,
      getPricing,
      login,
      getUsers,
      loadOrders,
      loadCustomers,
      loadSales,
      loadMiscItems,
      getDeliveries,
      getBreakdowns,
      getBoxBreakdowns,
      loadShippingMethod,
      loadPaymentTypes,
      loadPaymentTerms,
      loadAllCustomers,
      loadAllOrders,
      productAdded,
      productDeleted,
      productUpdated,
      orderAdded,
      orderUpdated,
      orderDeleted,
      miscItemAdded,
      miscItemDeleted,
      miscItemUpdated
    } = this.props;
    
    if (this.props.loggedIn !== prevProps.loggedIn) {
      const getData = async () => {
        const newCookie = Cookies.get('jwt');
        if(newCookie){
          await getAllProducts(newCookie);
          await getPricing(newCookie);
          await getBreakdowns(newCookie);
          await getBoxBreakdowns(newCookie);
          await loadOrders(newCookie);
          await loadCustomers(newCookie);
          await login(newCookie);
          await getUsers(newCookie);
          await loadMiscItems(newCookie);
          await getDeliveries(newCookie);
          await loadShippingMethod(newCookie);
          await loadPaymentTypes(newCookie);
          await loadPaymentTerms(newCookie);
          await loadSales(newCookie);
          await loadAllOrders(newCookie);
          await loadAllCustomers(newCookie);
        }
      };
      this.cookies(getData);      
    }


  };

  render() {
    return (
      <BrowserRouter>
        <React.Suspense fallback={loading()}>
          <Switch>
            <Route
              path="/login"
              name="Login"
              component={this.state.isAuth ? DefaultLayout : Login}
            />
            <Route
              path="/register"
              name="register"
              component={this.state.isAuth ? DefaultLayout : Register}
            />
            <Route
              path="/new-password"
              name="new-password"
              component={this.state.isAuth ? DefaultLayout : NewPassword}
            />
            <PrivateRoute
              path="/"
              name="Dashboard"
              component={DefaultLayout}
              isLogged={this.state.isAuth}
            />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedIn: state.users.loggedIn,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      loadOrders,
      loadCustomers,
      loadSales,
      loadShippingMethod,
      setLogin,
      getDeliveries,
      getSingleProduct,
      productAdded,
      productDeleted,
      productUpdated,
      orderAdded,
      orderUpdated,
      orderDeleted,
      getUsers,
      getAllProducts,
      getPricing,
      login,
      loadMiscItems,
      getBreakdowns,
      getBoxBreakdowns,
      loadPaymentTypes,
      loadPaymentTerms,
      loadAllCustomers,
      loadAllOrders,
      miscItemAdded,
      miscItemDeleted,
      miscItemUpdated
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(App);

