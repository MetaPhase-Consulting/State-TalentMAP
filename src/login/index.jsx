import React from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { keys, pick } from 'lodash';

import TokenValidation from './Components/TokenValidation';

import { tokenValidationRequest } from './actions';
import { auth } from './sagas';

// Get functional component prop-type config
const props$ = {
  types: TokenValidation.propTypes,
  defaults: TokenValidation.defaultProps,
};

props$.keys = keys(props$.types);

const Login = (props) => {
  const Element = TokenValidation;
  const isSignedIn = !!auth.get();

  // Just to be safe we don't too much automated injecting that we'll just take the ones that
  // are configured on the components
  const options = pick(props, props$.keys);
  return (!isSignedIn ?
    <Element {...options} /> :
    <Redirect to="/" />
  );
};

Login.propTypes = props$.types;
Login.defaultProps = props$.defaults;

const mapStateToProps = state => ({
  login: state.login,
});

export const mapDispatchToProps = dispatch => ({
  tokenValidationRequest: token => dispatch(tokenValidationRequest(token)),
});

const connected = connect(mapStateToProps, mapDispatchToProps)(Login);

export default connected;
