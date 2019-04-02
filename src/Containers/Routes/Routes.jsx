import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import mappedRoutesArray from './RoutesMap';

const Routes = ({ type, typeIsNot, ...rest }) => (
  <Switch {...rest}>
    {
      mappedRoutesArray.filter(
        (f) => {
          if (typeIsNot) {
            return type ? f.type !== type : true;
          }
          return type ? f.type === type : true;
        },
      ).map(route => (
        <Route
          key={route.key || route.path}
          exact={route.exact}
          path={route.path}
          component={() => route.component(rest)}
        />
      ))
    }
  </Switch>
);

Routes.propTypes = {
  type: PropTypes.string,
  typeIsNot: PropTypes.bool,
};

Routes.defaultProps = {
  type: '',
  typeIsNot: false,
};

export default Routes;
