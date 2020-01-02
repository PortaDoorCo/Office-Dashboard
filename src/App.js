import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';
import Cookies from "js-cookie";
import Login from "./views/Pages/Login/Login";
import Register from "./views/Pages/Register/Register";
import { connect } from 'react-redux';

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

  componentDidMount() {
    this.cookies()
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



export default connect(
  mapStateToProps,
  null
)(App);
