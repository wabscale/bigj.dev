// React
import React, {Fragment} from 'react';

// Graphql
import {Query} from "react-apollo";
import {WHOAMI} from "./queries";

// User imports
import {clearAuth} from "./utils";
import ComponentTree from "./ComponentTree";

/**
 * This component should be used to
 * What that means is that you can wrap any components in
 * this and they will only be accessible after authentication
 * through the graphql api.
 *
 * eg:
 * <WrapAuth> ... </WrapAuth>
 *
 * @param children
 * @returns {*}
 * @constructor
 */
const Auth = ({children}) => {
  return (
    <Query
      query={WHOAMI}
      fetchPolicy={'network-only'}
    >
      {({data, error, loading}) => {
        if (loading)
          return null;

        const component = ComponentTree.find(item => item.path === window.location.pathname);

        /**
         * If the active view is Sign In, we should ignore any errors.
         */
        if (component && component.auth) {
          if (error || !(data.me && data.me.username)) {
            console.log(component, error, data)
            return clearAuth();
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

/**
 * This function will take a rendered component, and wrap it
 * in the WrapAuth component if apply is true. If apply is false,
 * it will just return the component.
 * @param component
 * @param apply
 * @returns {*}
 * @constructor
 */
const WrapAuth = (component, apply) => {
  return apply ? (
    <Auth>
      {component}
    </Auth>
  ) : (
    <Fragment>
      {component}
    </Fragment>
  );
};

export default WrapAuth;
