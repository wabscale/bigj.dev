import React from 'react';
import PropTypes from 'prop-types';
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles';
import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import {Query, withApollo} from "react-apollo";
import Cookies from 'universal-cookie';
import Navigator from './Navigator';
import FileContent from './File/FileContent';
import LoginContent from './Login/LoginContent';
import Header from './Header';
import Upload from "./Upload/Upload";
import Settings from "./Settings/Settings";
import {GET_CONFIG, WHOAMI} from './queries';
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

const Main = withStyles(styles)(function(props) {
  const {
    classes,
    active,
    switchView,
    clearAuth,
  } = props;

  return (
    <Query
      query={WHOAMI}
      fetchPolicy={'network-only'}
    >
      {({data, error, loading}) => {
        if (loading)
          return (
            <CircularProgress className={classes.progress}/>
          );
        if (error) {
          clearAuth();
          setTimeout(() => switchView('Sign In'), 250);
          return <div/>;
        }

        const MainComponent = {
          'View': FileContent,
          'Sign In': LoginContent,
          'Upload': Upload,
          'Settings': Settings
        }[active];

        return (
          <MainComponent
            switchView={switchView}
            style={{height: "100%", width: "100%"}}
            displayCount={9}
          />
        );
      }}
    </Query>
  );
});

class Paperbase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      siteTitle: '',
      active: 'View',
    };
  }

  handleDrawerToggle = () => {
    this.setState(state => ({mobileOpen: !state.mobileOpen}));
  };

  clearAuth = () => {
    const cookies = new Cookies();

    cookies.remove('token');
    localStorage.clear();
  };

  switchView = id => {
    if (id === "Sign Out") {
      // const {client} = this.props;
      this.clearAuth();
      // client.resetStore(); // yeet cache

      id = 'Sign In';
    }
    this.setState({
      active: id,
    });
  }

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
    })
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

