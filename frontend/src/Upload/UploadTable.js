import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import {DELETE_FILE} from '../queries';
import {Mutation} from "react-apollo";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CheckIcon from '@material-ui/icons/Check';
import Tooltip from "@material-ui/core/Tooltip";
import {humanSize} from "../utils";


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
    flexGrow: 1,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginLeft: theme.spacing(1),
  },
  contentWrapper: {
    margin: '40px 16px',
  },
  progress: {
    margin: theme.spacing(1),
    align: 'center',
  },
  typography: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    paddingLeft: 0,
    margin: 'auto',
  },
});


const UploadTable = withStyles(styles)(({classes, files, uploadState, deleteFile: removeFile}) => {
  /*
  * uploadState -> { name : uploaded }
  * */

  return (
    <List>
      {files.map(({name, size}) => (
        <ListItem>
          <ListItemIcon>
            {uploadState[name] ? <CheckIcon color={'primary'}/> : <CircularProgress/>}
          </ListItemIcon>
          <ListItemText
            primary={name}
            secondary={humanSize(size)}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end" aria-label="delete">
              <Mutation mutation={DELETE_FILE}>
                {deleteFile => (
                  <Tooltip title="Delete">
                    <IconButton onClick={async e => {
                      e.preventDefault();
                      const fileID = uploadState[name];
                      if (!fileID) return;
                      deleteFile({
                        variables: {fileID}
                      }).then(({data}) => (
                        removeFile(data.deleteFile.filename)
                      ));
                    }}>
                      <DeleteIcon classes={{root: classes.block}} color="secondary"/>
                    </IconButton>
                  </Tooltip>
                )}
              </Mutation>
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
});

export default UploadTable;
