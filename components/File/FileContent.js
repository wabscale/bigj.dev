import React, {Fragment, PureComponent} from 'react';
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
import {Query} from 'react-apollo';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {GET_FILE, GET_FILES} from '../queries';
import File from './File';

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
          onKeyDown={e => {
            this.setState({
              searchTerm: e.target.value,
            });
            if (e.key === 'Enter') this.runSearch(
              e.target.value,
            );
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

class FileContent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      files: [],
    };
    this.deleteFile = this.deleteFile.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.update = this.update.bind(this);
  }

  deleteFile = async ({fileId, filename}) => {
    const {api} = this.props;
    let files = this.state.files.slice();

    const idx = files.findIndex(file => file.fileId === fileId);

    if (idx !== -1) files.splice(idx, 1);
    this.state.files = files;

    api.post(`/api/files/${fileId}`, {
      action: 'delete',
      filename: filename,
    });
  };

  uploadFile = async (event) => {
    const {api} = this.props;
    const data = new FormData();
    data.append('file', event.target.files[0]);
    api.post('/api/files/new', data).then(this.update);
  };

  update = async () => {
    const {api} = this.props;
    api.get('/api/files').then(res => {
      if (res.data.success) {
        const {data} = res.data;
        this.setState({
          files: data.slice(),
        });
      }
    });
  };

  render() {
    const {classes, switchView} = this.props;
    const {searchTerm} = this.state;

    return (
      //<AutoSizer>
      //   {({height, width}) => (
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
                        this.setState({searchTerm: searchTerm});
                      }}/>
                    </Grid>
                  </Grid>
                  <Grid item key="uploadButton">
                    <Fragment>
                      <input
                        accept="*"
                        className={classes.input}
                        id="icon-button-file"
                        onChange={this.uploadFile}
                        type="file"
                        hidden
                      />
                      <label htmlFor="icon-button-file">
                        <IconButton variant="contained" className={classes.addUser} component="span">
                          <CloudUploadIcon/>
                        </IconButton>
                      </label>
                    </Fragment>
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
          <Query query={GET_FILES}>
            {({data, loading, error}) => {
              if (loading)
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

              const {files} = data;

              // const displayFiles = files.filter(file => (
              //   file.filename.toLowerCase().includes(searchTerm.toLowerCase())
              // ));

              // if (displayFiles.length === 0)
              //   return (
              //     <Paper className={classes.paper}>
              //       <Typography variant="h5" className={classes.typography}>
              //         No Files to Show <FontAwesomeIcon icon={faFrown}/>
              //       </Typography>
              //     </Paper>
              //   );
              // console.log(displayFiles);

              this.state.files = files.map((file, index) => (
                <Grid item key={`file_${file.fileID}`}>
                  <File
                    key={`file_${file.fileID}_file`}
                    file={file}
                    delete={() => this.deleteFile(file)}
                    index={index}
                  />
                </Grid>
              ));
              return this.state.files;
            }}
          </Query>
        </Grid>
      </Fragment>
    );
  }
}

FileContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FileContent);
