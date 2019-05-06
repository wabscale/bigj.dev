import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons/faSignOutAlt";
import Button from '@material-ui/core/Button'
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton'
import PropTypes from 'prop-types';
import Hidden from '@material-ui/core/Hidden';
import {withStyles} from '@material-ui/core/styles';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit,
  },
  secondaryBar: {
    zIndex: 0,
  },
  menuButton: {
    marginLeft: -theme.spacing.unit,
  },
  iconButtonAvatar: {
    padding: 4,
  },
  link: {
    textDecoration: 'none',
    color: lightColor,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  button: {
    margin: theme.spacing.unit,
    borderColor: lightColor,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
});

function Header(props) {
  const {classes, onDrawerToggle} = props;

  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={8} alignItems="center">
            <Hidden smUp>
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={onDrawerToggle}
                  className={classes.menuButton}
                >
                  <MenuIcon/>
                </IconButton>
              </Grid>
            </Hidden>
            <Grid item xs/>
            {/*<Grid item>*/}
            {/*  <Button href="/auth/logout" variant="contained" color="default" className={classes.button}>*/}
            {/*    <Typography color="inherit" variant="p" className={classes.leftIcon}>*/}
            {/*      Sign Out*/}
            {/*    </Typography>*/}
            {/*    <FontAwesomeIcon icon={faSignOutAlt}/>*/}
            {/*  </Button>*/}
            {/*</Grid>*/}
          </Grid>
        </Toolbar>
      </AppBar>
      {/*<AppBar*/}
      {/*  component="div"*/}
      {/*  className={classes.secondaryBar}*/}
      {/*  color="primary"*/}
      {/*  position="static"*/}
      {/*  elevation={0}*/}
      {/*>*/}
      {/*  <Toolbar>*/}
      {/*    <Grid container alignItems="center" spacing={8}>*/}
      {/*      <Grid item xs>*/}
      {/*        <Typography color="inherit" variant="h5">*/}
      {/*          Files*/}
      {/*        </Typography>*/}
      {/*      </Grid>*/}
      {/*    </Grid>*/}
      {/*  </Toolbar>*/}
      {/*</AppBar>*/}
      {/*<AppBar*/}
      {/*  component="div"*/}
      {/*  className={classes.secondaryBar}*/}
      {/*  color="primary"*/}
      {/*  position="static"*/}
      {/*  elevation={0}*/}
      {/*>*/}
      {/*  <Tabs value={0} textColor="inherit">*/}
      {/*    <Tab textColor="inherit" label="View"/>*/}
      {/*  </Tabs>*/}
      {/*</AppBar>*/}
    </React.Fragment>
  );
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(Header);
