import React from 'react';
import {
  Route,
} from 'react-router';

import Auth from 'services/auth';

function RouteAuth(props) {
  const {
    credential,
    ...rest
  } = props;

  if (!Auth.hasCredentialLocal(credential)) Auth.clearAuth();
  
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Route {...rest} />
  );
}

export default RouteAuth;
