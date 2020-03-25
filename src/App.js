import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';
import Cookies from "js-cookie";
import Login from "./views/Pages/Login/Login";
import Register from "./views/Pages/Register/Register";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { NotificationManager } from 'react-notifications';
import { loadOrders, loadCustomers, loadSales, loadShippingMethod } from "./redux/orders/actions";
import { setLogin } from "./redux/users/actions";
import {
  // getWoodtypes,
  // getDesigns,
  // getEdges,
  // getFinish,
  // getMoulds,
  // getPanels,
  // getHinges,
  // getBoxThickness,
  // getBoxBottoms,
  // getAssembly,
  // getNotch,
  // getDrawerFinish
} from "./redux/part_list/actions";
import io from 'socket.io-client';
const socket = io('https://infinite-woodland-96977.herokuapp.com/');

const loading = () => <div className="animated fadeIn pt-3 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

const PrivateRoute = ({ component: Component, ...rest }, isLogged) => (
  <Route
    {...rest}
    render={props => {
    
      return rest.isLogged ? (
        <Component {...props} isLogged={rest.isLogged}  />
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
  }

  componentDidUpdate = async(prevProps) => {
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
    // getWoodtypes,
    // getDesigns,
    // getEdges,
    // getFinish,
    // getMoulds,
    // getPanels,
    // getHinges, 
    // getBoxThickness,
    // getBoxBottoms,
    // getAssembly,
    // getNotch,
    // getDrawerFinish,
    setLogin,

  },
  dispatch
);


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
