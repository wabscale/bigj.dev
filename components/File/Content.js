import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import File from './File';
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import RefreshIcon from '@material-ui/icons/Refresh';
import FormControl from "@material-ui/core/FormControl";
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = theme => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
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

class Content extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      files: files,
      searchTerm: "",
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
    const {classes, api} = this.props;
    const {files = [], searchTerm} = this.state;

    const displayFiles = files.filter(file => (
      file.filename.toLowerCase().includes(searchTerm.toLowerCase())
    ));

    return (
      <Grid container spacing={24}>
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
        {displayFiles.map((file) => (
          <File
            api={api}
            file={file}
            delete={() => this.deleteFile(file)}
            key={`file_${file.fileId}_file`}
          />
        ))}
      </Grid>
    );
  }
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
