import React from 'react';
import { Route } from 'react-router';
import PropTypes from 'prop-types';
import ResolvingComponent from './ResolvingComponent';


export default function ResolvedRoute({ component, resolve, ...rest }) {
  return <Route {...rest}
    render={(props) => <ResolvingComponent resolve={resolve} component={component} />}
  />;
}
ResolvedRoute.propTypes = {
  resolve: PropTypes.func.isRequired,
  ...Route.propTypes,
}
