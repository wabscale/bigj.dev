import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Fab from '@material-ui/core/Fab';

import {UPLOAD_FILE} from '../queries';
import {Mutation, withApollo} from "react-apollo";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import UploadTable from './UploadTable';


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


class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      uploadState: {},
    };
  }

  initUploadState = files => {
    const uploadState = {};
    files.map(({name}) => uploadState[name] = false);
    this.setState({uploadState});
  };

  updateUploadState = ({data}) => {
    const {uploadState} = this.state;
    const {filename, fileID} = data.singleUpload;
    uploadState[filename] = fileID;
    this.setState({uploadState});
  };

  handleUnauth = () => {
    const {switchView} = this.props;
    // switchView('Sign In');
  };

  deleteFile = nameToDel => {
    const files = this.state.files.filter(({name}) => (
      name !== nameToDel
    ));
    this.setState({files});
  };

  render() {
    const {classes} = this.props;
    const {files, uploadState} = this.state;

    return (
      <Fragment>
        <Grid
          container
          spacing={3}
          direction="row"
          justify="center"
          alignItems="center"
          className={classes.root}
        >
          <Grid item xs={12}>
            <Paper
              className={classes.paper}
              hidden={files.length === 0}
            >
              <UploadTable
                files={files}
                uploadState={uploadState}
                deleteFile={this.deleteFile}
              />
            </Paper>
          </Grid>
        </Grid>
        <Mutation mutation={UPLOAD_FILE}>
          {uploadFile => (
            <Fragment>
              <AppBar position="absolute" color="primary" className={classes.appBar}>
                <Toolbar>
                  <input
                    accept="*"
                    className={classes.input}
                    id="icon-button-file"
                    onChange={({target: {validity, files}}) => {
                      files = [...files];
                      this.initUploadState(files);
                      this.setState({files});
                      if (validity.valid) {
                        files.map(file => (
                          uploadFile({
                            variables: {file},
                          }).then(
                            this.updateUploadState
                          ).catch(
                            this.handleUnauth
                          )
                        ));
                      } else {
                        console.log();
                      }
                    }}
                    type="file"
                    multiple
                    hidden
                  />
                  <label htmlFor={"icon-button-file"}>
                    <Fab
                      color="secondary"
                      component="span"
                      className={classes.fabButton}
                    >
                      <CloudUploadIcon/>
                    </Fab>
                  </label>
                </Toolbar>
              </AppBar>
            </Fragment>
          )}
        </Mutation>
      </Fragment>
    );
  }
}

Upload.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withApollo(Upload));
