import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import {withApollo} from "react-apollo";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Navigator from './Navigator';
import Header from './Header';
import WrapAuth from './WrapAuth';
import {GET_CONFIG} from './queries';
import theme from './theme';
import ComponentTree from "./ComponentTree";

const drawerWidth = 256;

const styles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
    padding: '48px 36px 0',
    // background: '#494949',
  },
};


/**
 * This is the highest level user component in the react DOM.
 *
 * Only very high level state should be held here.
 */

class Paperbase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false, // boolean to indicate if drawer is open
      siteTitle: '',     // document.title and site title in menu
      active: 'View',    // currently active view
    };
  }

  /**
   * Calling this function will toggle the drawer. The mobileOpen
   * state is a boolean that indicates whether the menu drawer is
   * open. On desktop, this function will have no effect on what
   * is rendered
   */
  handleDrawerToggle = () => (
    this.setState(({mobileOpen}) => ({
      mobileOpen: !mobileOpen,
    }))
  );

  /**
   * After this component mounts, we need to fetch the siteTitle
   * config. This value should determine the document.title and
   * the title in the menu for the site. We explicitly do this
   * after the component mounts, so that we only re-render once.
   */
  componentDidMount() {
    const {client} = this.props;

    client.query({
      query: GET_CONFIG,
      variables: {
        key: 'siteTitle',
      },
    }).then(({data}) => {
      const siteTitle = data.getConfig.value;
      this.setState({siteTitle});
    });
  }

  render() {
    const {classes} = this.props;
    let {siteTitle} = this.state;

    document.title = siteTitle;

    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <div className={classes.root}>
            <CssBaseline/>
            <nav className={classes.drawer}>
              <Hidden smUp implementation="js">
                <Navigator
                  PaperProps={{style: {width: drawerWidth}}}
                  variant="temporary"
                  open={this.state.mobileOpen}
                  onDrawerToggle={this.handleDrawerToggle}
                />
              </Hidden>
              <Hidden xsDown implementation="css">
                <Navigator
                  PaperProps={{style: {width: drawerWidth}}}
                  onDrawerToggle={this.handleDrawerToggle}
                />
              </Hidden>
            </nav>
            <div className={classes.appContent}>
              <Header onDrawerToggle={this.handleDrawerToggle}/>
              <main className={classes.mainContent}>
                <Switch>
                  {ComponentTree.map(({component, path, auth, options}) => {
                    const Main = component;
                    return (
                      <Route exact path={path}>
                        {WrapAuth((
                          <Main
                            style={{height: "100%", width: "100%"}}
                            {...options}
                          />
                        ), auth)}
                      </Route>
                    );
                  })}
                  <Route>
                    <Redirect to="/signin"/>
                  </Route>
                </Switch>
              </main>
            </div>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

Paperbase.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withApollo(Paperbase));

