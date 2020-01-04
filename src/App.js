import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';
import Cookies from "js-cookie";
import Login from "./views/Pages/Login/Login";
import Register from "./views/Pages/Register/Register";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { loadOrders, loadCustomers, countOrders, loadSales, loadShippingMethod } from "./redux/orders/actions";
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
} from "./redux/part_list/actions";
import io from 'socket.io-client';
const socket = io('https://server.portadoor.com/');

const loading = () => <div className="animated fadeIn pt-3 text-center"><div className="sk-spinner sk-spinner-pulse"></div></div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

const PrivateRoute = ({ component: Component, ...rest }, isLogged) => (
  <Route
    {...rest}
    render={props => {
      console.log('isauthhhhhh', rest.isLogged)
      return rest.isLogged ? (
        <Component {...props} />
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
    }
  }

  componentDidMount = async() => {
    this.cookies()
    socket.on('order_submitted', res => (NotificationManager.success(`Order #${res.orderNum} added`, 'New Order', 2000)))
    socket.on('status_updated', (res, updatedStatus) => (NotificationManager.success(`Order #${res.orderNum} has been updated to ${updatedStatus.status}`, `An order has been updated`, 2000)))


    const props = this.props;
    await props.loadOrders();
    await props.loadSales();
    await props.countOrders();
    await props.getWoodtypes();
    await props.getDesigns();
    await props.getEdges();
    await props.getFinish();
    await props.getGrades();
    await props.getMoulds();
    await props.getPanels();
    await props.getHinges();
    await props.getBoxThickness();
    await props.getBoxBottoms();
    await props.getAssembly();
    await props.getNotch();
    await props.getDrawerFinish();
    await props.loadShippingMethod();


  }

  componentDidUpdate(prevProps) {
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
    getWoodtypes,
    getDesigns,
    getEdges,
    getFinish,
    getGrades,
    getMoulds,
    getPanels,
    getHinges, 
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
)(App);
