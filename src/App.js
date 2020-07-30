import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';
import Cookies from "js-cookie";
import Login from "./views/Pages/Login/Login";
import Register from "./views/Pages/Register/Register";
import NewPassword from './views/Pages/NewPassword/NewPassword'
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { NotificationManager } from 'react-notifications';
import { loadOrders, getDeliveries } from "./redux/orders/actions";
import { loadShippingMethod } from "./redux/misc_items/actions";
import { loadSales} from "./redux/sales/actions";
import { loadCustomers } from './redux/customers/actions'
import { setLogin } from "./redux/users/actions";
import io from 'socket.io-client';
import db_url from './redux/db_url'
const socket = io(db_url);
socket.on('connect', () => console.log('conneee==>>>'))

const cookie = Cookies.get("jwt");

const loading = () => <div className="animated fadeIn pt-3 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

const PrivateRoute = ({ component: Component, ...rest }, isLogged) => (
  <Route
    {...rest}
    render={props => {

      return rest.isLogged ? (
        <Component {...props} isLogged={rest.isLogged} />
      ) : (
          <Redirect to={{ pathname: "/login" }} />
        )
    }
    }
  />
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: false
    };
  }

  cookies = () => {
    const getCookie = Cookies.get("jwt");
    if (getCookie) {
      this.setState({
        isAuth: true
      });
      this.props.setLogin()
    }
  }

  componentDidMount = () => {
    
    this.cookies()
    socket.on('order_submitted', res => (NotificationManager.success(`Order #${res.orderNum} added`, 'New Order', 2000), console.log(res)))
    socket.on('order_updated', res => (NotificationManager.success(`Order #${res.orderNum} updated`, 'Order Updated', 2000), console.log(res)))
    socket.on('status_updated', (res, updatedStatus) => (NotificationManager.success(`Order #${res.orderNum} has been updated`, `An order has been updated`, 2000)))
    socket.on('order_deleted', res => (NotificationManager.success(`Order Deleted`, 'Order Deleted', 2000)))
    socket.on('delivery_added', res => this.props.getDeliveries(cookie))
  }

  componentDidUpdate = async (prevProps) => {
    if (this.props.loggedIn !== prevProps.loggedIn) {
      this.cookies()
    }
  }

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
              }
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
            {/* <AuthRoute exact path="/" component={Full} /> */}

            {/* <Route path="/" name="Home" render={props => <DefaultLayout {...props}/>} /> */}
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    );
  }
}


const mapStateToProps = state => ({
  loggedIn: state.users.loggedIn
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadOrders,
      loadCustomers,
      loadSales,
      loadShippingMethod,
      setLogin,
      getDeliveries

    },
    dispatch
  );


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
