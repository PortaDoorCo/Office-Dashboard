const PrivateRoute = ({ component: Component, ...rest }, isLogged) => (
  <Route
    {...rest}
    render={props =>
      rest.isLogged ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: '/login' }} />
      )
    }
  />
);

export default PrivateRoute;