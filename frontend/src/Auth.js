// React
import React, {Fragment} from 'react';

// Graphql
import {Query} from "react-apollo";
import {WHOAMI} from "./queries";

/**
 * This component is an unauthentication wrapper component.
 * What that means is that you can wrap any components in
 * this and they will only be accessible after authentication
 * through the graphql api.
 *
 * eg:
 * <Auth> ... </Auth>
 *
 * @param children
 * @param clearAuth
 * @param switchView
 * @returns {*}
 * @constructor
 */
const Auth = ({children, clearAuth, switchView, active}) => {
  return (
    <Query
      query={WHOAMI}
      fetchPolicy={'network-only'}
    >
      {({data, error, loading}) => {
        if (loading)
          return null;

        /**
         * If the active view is Sign In, we should ignore any errors.
         */
        if (active !== 'Sign In') {
          if (error || !(data.me && data.me.username)) {
            clearAuth(); // yeet user
            setTimeout(() => ( // delay to avoid recursive re-render
              switchView('Sign In')
            ), 100);
            return null;
          }
        }

        /**
         * Simply render children authentication
         */
        return (
          <Fragment>
            {children}
          </Fragment>
        );
      }}
    </Query>
  )
};

export default Auth;
