import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {withStyles} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import FolderIcon from '@material-ui/icons/Folder';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons/faSignOutAlt";
import {faSignInAlt} from "@fortawesome/free-solid-svg-icons/faSignInAlt";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SettingsIcon from '@material-ui/icons/Settings';
import {Link} from "react-router-dom";


const categories = [
  {
    id: 'Files',
    children: [
      {
        id: 'View',
        icon: <FolderIcon/>,
        path: '/view'
      },
      {
        id: 'Upload',
        icon: <CloudUploadIcon/>,
        path: '/upload'
      },
      {
        id: 'Settings',
        icon: <SettingsIcon/>,
        path: '/settings'
      }
    ],
  },
  {
    id: "Auth",
    children: [
      {
        id: "Sign In",
        icon: <FontAwesomeIcon icon={faSignInAlt} />,
        path: '/signin'
      },
      {
        id: 'Sign Out',
        icon: <FontAwesomeIcon icon={faSignOutAlt}/>,
        path: '/signout'
      }
    ],
  }
];

const styles = theme => ({
  root: {
    margin: theme.spacing(1),
  },
  categoryHeader: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  categoryHeaderPrimary: {
    color: theme.palette.common.white,
  },
  menuButton: {
    marginLeft: theme.spacing(-1),
  },
  item: {
    paddingTop: 4,
    paddingBottom: 4,
    // color: 'rgba(255, 255, 255, 0.7)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    color: '#4fc3f7',
  },
  itemCategory: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #404854 inset',
    paddingTop: 16,
    paddingBottom: 16,
  },
  firebase: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.common.white,
  },
  itemActionable: {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
  itemActiveItem: {
    color: '#4fc3f7',
  },
  itemPrimary: {
    color: 'inherit',
    fontSize: theme.typography.fontSize,
  },
  divider: {
    marginTop: theme.spacing(2),
  },
});

const Navigator = props => {
  const {classes, onDrawerToggle, api, ...other} = props;

  return (
    <Drawer variant="permanent" {...other} onClose={onDrawerToggle} className={classes.root}>
      <List disablePadding>
        <ListItem className={classNames(classes.firebase, classes.item, classes.itemCategory)}>
          <IconButton
            color="primary"
            aria-label="Open drawer"
            onClick={onDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon/>
          </IconButton>
          {document.title}
        </ListItem>
        <ListItem className={classNames(classes.item, classes.itemCategory)}>
          <ListItemIcon>
            <HomeIcon/>
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            Overview
          </ListItemText>
        </ListItem>
        {categories.map(({id, children}) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({id: childId, icon, path}) => (
              <ListItem
                button
                dense
                key={childId}
                selected={path === window.location.pathname}
                className={classes.item}
                onClick={() => {
                  onDrawerToggle();
                }}
                component={Link}
                to={path}
              >
                <ListItemIcon
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary,
                  }}
                >
                  {childId}
                </ListItemText>
              </ListItem>
            ))}
            <Divider className={classes.divider}/>
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}

Navigator.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigator);
