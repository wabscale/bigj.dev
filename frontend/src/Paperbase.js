import React from 'react';
import PropTypes from 'prop-types';
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import {withApollo} from "react-apollo";
import Cookies from 'universal-cookie';
import Navigator from './Navigator';
import FileContent from './File/FileGrid';
import LoginContent from './Login/LoginContent';
import Header from './Header';
import Upload from "./Upload/Upload";
import Settings from "./Settings/Settings";
import Auth from './Auth';
import {GET_CONFIG} from './queries';
import theme from './theme';

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
 * This component is a sort of jank react router. Instead of being defined by
 * the url path, there is a `active` variable held in the Paperbase state.
 * Using that state, we decide which main view to render. The switchView
 * function will change the active view.
 *
 * @param props
 * @returns {*}
 * @constructor
 */

const Main = props => {
  const {
    active,
    switchView,
    clearAuth,
  } = props;

  /**
   * We need to decide which component view to load. Deciding which
   * component to load through a mapping of a string to a component
   * class seems to be the simplest way to do this.
   *
   * If we have been switched to an invalid view, this is where an
   * error will occur.
   *
   * To add new views to the app, all you will need to do is add
   * their name to class mapping here.
   */
  const MainComponent = {
    'View': FileContent,
    'Sign In': LoginContent,
    'Upload': Upload,
    'Settings': Settings
  }[active];

  return (
    <Auth
      clearAuth={clearAuth}
      switchView={switchView}
    >
      <MainComponent
        switchView={switchView}
        style={{height: "100%", width: "100%"}}
        displayCount={9}
      />
    </Auth>
  );
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
   * Should yeet the current user. This should only be called
   * if there was some kind of an authentication error with
   * the api. After this function is called, we will pretty
   * much always need to switch to the SignIn view.
   */
  clearAuth = () => {
    const cookies = new Cookies();
    cookies.remove('token');
    localStorage.clear();
  };

  /**
   * This will handle switching the active state to `id`.
   * Since there is no Sign Out view, if id is Sign Out,
   * then we will clear the auth (yeet current user) then
   * switch to the Sign In view.
   *
   * @param id
   */
  switchView = id => {
    if (id === "Sign Out") {
      this.clearAuth();

      id = 'Sign In';
    }
    this.setState({
      active: id,
    });
  };

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
    let {active, siteTitle} = this.state;

    document.title = siteTitle;

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline/>
          <nav className={classes.drawer}>
            <Hidden smUp implementation="js">
              <Navigator
                PaperProps={{style: {width: drawerWidth}}}
                variant="temporary"
                open={this.state.mobileOpen}
                onDrawerToggle={this.handleDrawerToggle}
                switchView={this.switchView}
                active={this.state.active}
              />
            </Hidden>
            <Hidden xsDown implementation="css">
              <Navigator
                PaperProps={{style: {width: drawerWidth}}}
                switchView={this.switchView}
                active={this.state.active}
                onDrawerToggle={this.handleDrawerToggle}
              />
            </Hidden>
          </nav>
          <div className={classes.appContent}>
            <Header onDrawerToggle={this.handleDrawerToggle}/>
            <main className={classes.mainContent}>
              <Main
                switchView={this.switchView}
                clearAuth={this.clearAuth}
                active={active}
              />
            </main>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

Paperbase.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withApollo(Paperbase));

