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
import { loadCustomers, loadAllCustomers, customerAdded, customerUpdated, customerDeleted } from './redux/customers/actions';
import { currentVersion, setLogin } from './redux/users/actions';
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
  miscItemUpdated,
  loadCategories,
  loadPrinterOptions,
  printerOptionAdded,
  printerOptionUpdated
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
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout/DefaultLayout'));


const PrivateRoute = ({ component: Component, ...rest }, isLogged: boolean) => (
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

type PropTypes = {
  productAdded: (res: {}, entity: {}) => null,
  productDeleted: (res: {}) => null,
  productUpdated: (res: {}, entity: {}) => null,
  orderAdded: (res: {}) => null,
  orderUpdated:(res: {}) => null,
  orderDeleted:(res: {}) => null,
  miscItemAdded:(res: {}, entity: {}) => null,
  miscItemDeleted:(res: {}) => null,
  miscItemUpdated:(res: {}) => null,
  customerAdded:(res: {}) => null,
  customerUpdated:(res: {}) => null,
  customerDeleted:(res: {}) => null,
  printerOptionAdded:(res: {}, data: {}) => null,
  printerOptionUpdated:(res: {}, data: {}) => null,
  setLogin: () => null,
  getDeliveries: (cookie: {}) => null,
  getBreakdowns: (data: {}) => null,
  getBoxBreakdowns: (data: {}) => null,
  loadShippingMethod: (data: {}) => null,
  loadPaymentTypes: (data: {}) => null,
  loadPaymentTerms: (data: {}) => null,
  loadAllCustomers: (data: {}, user: {}) => null,
  loadAllOrders: (data: {}, user: {}) => null,
  loadCategories: (data: {}) => null,
  loadPrinterOptions: (data: {}) => null,
  getAllProducts: (data: {}) => null,
  getPricing: (data: {}) => null,
  login: (data: {}) => null,
  getUsers: (data: {}) => null,
  loadOrders: (data: {}, user: {}) => null,
  loadCustomers: (data: {}, user: {}) => null,
  loadSales: (data: {}) => null,
  loadMiscItems: (data: {}) => null,
  currentVersion: () => null,
  loggedIn: boolean,
  user: any,
  current_version: boolean,
  users: {
    loggedIn: boolean,
    user: any,
    current_version: boolean
  }
}

type StateTypes = {
  isAuth: boolean,
  cookie: any
}

class App extends Component<PropTypes, StateTypes> {
  constructor(props: any) {
    super(props);
    this.state = {
      isAuth: false,
      cookie: null
    };
  }

  cookies = (cb: any) => {
    const getCookie = Cookies.get('jwt');
    if (getCookie) {
      this.setState({
        isAuth: true,
      }, () => {
        this.props.login(getCookie);
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
      miscItemUpdated,
      customerAdded,
      customerUpdated,
      customerDeleted,
      printerOptionAdded,
      printerOptionUpdated,
      currentVersion
    } = this.props;

    this.cookies(null);


   
    socket.on(
      'order_submitted',
      (res: any) => (
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
      (res: {
        orderNum: number
      }) => (
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
      (res: {
        orderNum: number
      }) => (
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
      (res: {}) => (
        NotificationManager.success('Order Deleted', 'Order Deleted', 2000),
        orderDeleted(res)
      )
    );

    socket.on('delivery_added', () => this.props.getDeliveries(cookie));
    socket.on('customer_added', (res: {}) => customerAdded(res));
    socket.on('customer_updated', (res: {}) => customerUpdated(res));
    socket.on('customer_deleted', (res: {}) => customerDeleted(res));


    socket.on(
      'product_updated',
      (res: {}, entity: {}) => (
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
      (res: {}, entity: {}) => (
        NotificationManager.success('Product Added', 'Product Added', 2000),
        productAdded(res, entity)
      )
    );
    socket.on(
      'product_deleted',
      (res: {}) => (
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
      (res: {}, entity: {}) => (
        NotificationManager.success('Misc Item Added', 'Misc Item Added', 2000),
        miscItemAdded(res, entity)
      )
    );
    socket.on(
      'misc_item_updated',
      (res: {}) => (
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
      (res: {}) => (
        NotificationManager.success(
          'Misc Item Deleted',
          'Misc Item Deleted',
          2000
        ),
        miscItemDeleted(res)
      )
    );
    socket.on(
      'printer_option_added',
      (res: {}, data: {}) => (
        printerOptionAdded(res, data)
      )
    );

    socket.on(
      'printer_option_updated',
      (res: {},data: {}) => (
        printerOptionUpdated(res, data)
      )
    );

    socket.on(
      'message',
      (res: {
        message: string
      }) => (
        NotificationManager.warning(
          res && res.message,
          'Message from Admin',
          10000
        )
      )
    );  
    
    // const timeout = parseFloat(process.env.REACT_APP_NEW_DEPLOYMENT_TIMEOUT);

    // socket.on(
    //   'new_release',
    //   (res) => (
    //     setTimeout(() => currentVersion(), timeout)
    //   ) 
    // );
  };

  componentDidUpdate = async (prevProps: any) => {
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
      loadCategories,
      loadPrinterOptions,
      user
    } = this.props;
    
    if (this.props.loggedIn !== prevProps.loggedIn) {
      
      const getData = async () => {
        const newCookie = Cookies.get('jwt');
        if(newCookie){
          await login(newCookie);
          await getAllProducts(newCookie);
          await getPricing(newCookie);
          await loadPrinterOptions(newCookie);
          await loadCategories(newCookie);
          await getBreakdowns(newCookie);
          await getBoxBreakdowns(newCookie);

          await console.log({user});

          await loadOrders(newCookie, user);
          await loadCustomers(newCookie, user);
          await getUsers(newCookie);
          await loadMiscItems(newCookie);
          await loadShippingMethod(newCookie);
          await loadPaymentTypes(newCookie);
          await loadPaymentTerms(newCookie);
          await loadSales(newCookie);
          await getDeliveries(newCookie);
          await loadAllOrders(newCookie, user);
          await loadAllCustomers(newCookie, user);
          
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
              component={this.state.isAuth ? DefaultLayout : Login}
            />
            <Route
              path="/register"
              component={this.state.isAuth ? DefaultLayout : Register}
            />
            <Route
              path="/new-password"
              component={this.state.isAuth ? DefaultLayout : NewPassword}
            />
            <PrivateRoute
              path="/"
              name="Dashboard"
              component={DefaultLayout}
              isLogged={this.state.isAuth}
            />
            <PrivateRoute
              path="/user"
              name="User-Dashboard"
              component={DefaultLayout}
              isLogged={this.state.isAuth}

            />
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state: PropTypes) => ({
  loggedIn: state.users.loggedIn,
  user: state.users.user,
  current_version: state.users.current_version
});

const mapDispatchToProps = (dispatch: any) =>
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
      miscItemUpdated,
      loadCategories,
      customerAdded, 
      customerUpdated,
      customerDeleted,
      loadPrinterOptions,
      printerOptionAdded,
      printerOptionUpdated,
      currentVersion
    },
    dispatch
  );

export default connect<{loggedIn: boolean}>(mapStateToProps, mapDispatchToProps)(App);

