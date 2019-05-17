import React, {Fragment, PureComponent, Component} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import RefreshIcon from '@material-ui/icons/Refresh';
import FormControl from "@material-ui/core/FormControl";
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import {Query, Mutation} from 'react-apollo';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFrown} from '@fortawesome/free-solid-svg-icons/faFrown';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import {animateScroll} from "react-scroll";

import {GET_FILE, GET_FILES, UPLOAD_FILE} from '../queries';
import File from './File';
import {withApollo} from "react-apollo";

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
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginLeft: theme.spacing.unit,
  },
  contentWrapper: {
    margin: '40px 16px',
  },
  progress: {
    margin: theme.spacing.unit * 2,
    align: 'center',
  },
  typography: {
    margin: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
  stepper: {
    maxWidth: "100%",
    flexGrow: 1,
    position: "relative"
  },
});

class SearchBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
    };
    this.runSearch = this.runSearch.bind(this);
  }

  runSearch() {
    const {onChange} = this.props;
    const {searchTerm} = this.state;
    onChange(searchTerm);
  }

  render() {
    const {classes} = this.props;
    const {searchTerm} = this.state;

    return (
      <FormControl fullWidth>
        <Input
          fullWidth
          placeholder="Search files"
          style={{margin: 8}}
          variant="filled"
          inputProps={{
            className: classes.searchInput,
          }}
          onChange={async e => {
            e.preventDefault();
            this.runSearch(e.target.value);
            this.setState({searchTerm: e.target.value});
          }}
          startAdornment={
            <InputAdornment position="start">
              <IconButton onClick={() => this.runSearch(searchTerm)}>
                <SearchIcon/>
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    );
  }
}

class FileContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      files: [],
      activeStep: 0,
      fileCount: 0,
      moving: false
    };
    this.deleteFile = this.deleteFile.bind(this);
    this.update = this.update.bind(this);
  }

  deleteFile = async ({fileID}) => {
    const {files} = this.state;
    this.setState({
      files: files.filter(file => file.fileID !== fileID),
    });
  };

  update = async () => {
    const {client} = this.props;
    client.query({
      query: GET_FILES,
      fetchPolicy: 'no-cache'
    }).then(({data}) => {
      if (data.files)
        this.setState({files: data.files,});
    });
  };

  moveToTop() {
    return new Promise((resolve) => {
      animateScroll.scrollToTop();
      return resolve();
    });
  }

  handleNext = async () => {
    await this.moveToTop();
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = async () => {
    await this.moveToTop();
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  render() {
    const {classes, switchView, displayCount} = this.props;
    const {searchTerm, activeStep, moving} = this.state;
    const {fileCount} = this.state;
    const steps = Math.ceil(fileCount / displayCount);

    return (
      <Fragment>
        <Grid
          container
          spacing={24}
          direction="row"
          justify="center"
          alignItems="center"
          className={classes.root}
        >
          <Grid item xs={12} key="tool-bar">
            <Paper className={classes.paper}>
              <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
                <Toolbar>
                  <Grid container spacing={16} alignItems="center">
                    <Grid item xs={12} key="searchBar">
                      <SearchBar classes={classes} onChange={searchTerm => {
                        this.setState({searchTerm: searchTerm, activeStep: 0});
                      }}/>
                    </Grid>
                  </Grid>
                  <Grid item key="uploadButton">
                    <Mutation mutation={UPLOAD_FILE}>
                      {uploadFile => (
                        <Fragment>
                          <input
                            accept="*"
                            className={classes.input}
                            id="icon-button-file"
                            onChange={({target: {validity, files}}) =>
                              validity.valid && uploadFile({variables: {file: files[0]}})
                            }
                            type="file"
                            hidden
                          />
                          <label htmlFor="icon-button-file">
                            <IconButton variant="contained" className={classes.addUser} component="span">
                              <CloudUploadIcon/>
                            </IconButton>
                          </label>
                        </Fragment>
                      )}
                    </Mutation>
                  </Grid>
                  <Grid item key="refreshButton">
                    <IconButton onClick={this.update}>
                      <RefreshIcon/>
                    </IconButton>
                  </Grid>
                </Toolbar>
              </AppBar>
            </Paper>
          </Grid>
          <Query query={GET_FILES} fetchPolicy='network-only'>
            {({data, loading, error}) => {
              if (loading || moving)
                return (
                  <Grid item xs={12}>
                    <CircularProgress className={classes.progress}/>
                  </Grid>
                );
              if (error) {
                setTimeout(() => switchView('Sign In'), 250);
                return (
                  <Fragment/>
                );
              }

              if (data.files === undefined) {
                return <div/>;
              }

              const newFiles = data.files.map(
                ({fileID, filename, isPublic}) => ({fileID: parseInt(fileID), filename, isPublic})
              );

              if (this.state.files.length === 0)
                this.state.files = newFiles;
              const {files} = this.state;

              files.sort(
                (a, b) => (a.fileID < b.fileID ? 1 : a.fileID > b.fileID ? -1 : 0)
              );

              const displayFiles = files.filter(file => (
                searchTerm.length === 0 || file.filename.toLowerCase().includes(searchTerm.toLowerCase())
              ));

              if (displayFiles.length === 0)
                return (
                  <Paper className={classes.paper}>
                    <Typography variant="h5" className={classes.typography}>
                      No Files to Show <FontAwesomeIcon icon={faFrown}/>
                    </Typography>
                  </Paper>
                );

              setTimeout(() => this.setState({
                fileCount: displayFiles.length,
              }), 1000);

              return (
                <Fragment>
                  {displayFiles.slice(
                    activeStep * displayCount,
                    ((activeStep + 1) * displayCount)
                  ).map((file, index) => (
                    <File
                      key={`file_${file.fileID}_file`}
                      file={file}
                      delete={() => this.deleteFile(file)}
                      index={index}
                    />
                  ))}
                </Fragment>
              );
            }}
          </Query>
          <Grid item xs={12}>
            <MobileStepper
              variant="dots"
              steps={steps}
              position="bottom"
              activeStep={this.state.activeStep}
              className={classes.stepper}
              nextButton={
                <Button
                  size="small"
                  onClick={this.handleNext}
                  disabled={this.state.activeStep === steps}
                  color={"primary"}
                  variant="contained"
                >
                  Next
                  <KeyboardArrowRight/>
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={this.handleBack}
                  disabled={this.state.activeStep === 0}
                  color={"primary"}
                  variant="contained"
                >
                  <KeyboardArrowLeft/>
                  Back
                </Button>
              }
            />
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

FileContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withApollo(FileContent));
