import React, {PureComponent} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import {withStyles} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import FileExpand from './FileExpand';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Switch from '@material-ui/core/Switch';
import Link from '@material-ui/core/Link';
import PropTypes from "prop-types";

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
    marginRight: theme.spacing.unit,
  },
  contentWrapper: {
    margin: '40px 16px',
  },
});

class File extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...props.file,
      display: 'inherit',
    };

    this.togglePublic = this.togglePublic.bind(this);
    this.update = this.update.bind(this);
  }

  togglePublic() {
    this.setState({
      isPublic: !this.state.isPublic,
    }, this.update);
  }

  update() {
    const {api} = this.props;
    api.post(`/api/files/${this.state.fileId}`, {
      action: "update",
      ...this.state,
    }).then(res => {
      this.setState({
        ...res.data.data,
      });
    });
  }

  getOtp() {
    const {fileId, api} = this.props;
    api.post(`/api/files/${fileId}`, {
      action: 'getOtp',
    }).then(res => this.setState({
      content: (
        <Link
          href={res.data.data}
          color="primary"
        >
          {res.data.data}
        </Link>
      ),
    }));
  }

  getHistory() {
    const {fileId, api} = this.props;
    api.post(`/api/files/${fileId}`, {
      action: 'getDownloads',
    }).then(res => this.setState({
      content: res.data.data.map(i => (
        <>
          {i}
          <br/>
        </>
      )),
      expanded: !this.state.expanded,
    }));
  }

  render() {
    // if (this.props.file.fileId !== this.state.fileId) this.state = {...this.props.file};
    const {classes, api} = this.props;
    const {fileId, filename, isPublic, size, display} = this.state;

    console.log("file rerender");

    return (
      <Grid item key={`file_${fileId}`} style={{display: display}}>
        <Paper className={classes.paper}>
          <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
            <Toolbar>
              <Grid
                container
                spacing={16}
                alignItems="center"
                key={`file_${fileId}_toolbar`}
              >
                <Grid item xs key={`file_${fileId}_filename`}>
                  <TextField
                    fullWidth
                    value={filename}
                    InputProps={{
                      disableUnderline: true,
                      className: classes.searchInput,
                    }}
                    onChange={event => this.setState({
                      filename: event.target.value,
                    })}
                    onKeyPress={event => event.key === "Enter" ? this.update() : {}}
                  />
                </Grid>
                <Grid item key={`file_${fileId}_save`}>
                  <Tooltip title="Save">
                    <IconButton color="default" onClick={this.update}>
                      <SaveIcon
                        classes={{root: classes.block}}
                        color="inherit"
                      />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item key={`file_${fileId}_download`}>
                  <Tooltip title="Download">
                    <IconButton href={`/f/${filename}`}>
                      <CloudDownloadIcon
                        classes={{root: classes.block}}
                        color="inherit"
                      />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item key={`file_${fileId}_public`}>
                  <Tooltip title={isPublic ? "Public" : "Private"}>
                    <Switch
                      checked={isPublic}
                      onChange={this.togglePublic}
                      color="primary"
                    />
                  </Tooltip>
                </Grid>
                <Grid item key={`file_${fileId}_delete`}>
                  <Tooltip title="Delete">
                    <IconButton onClick={async () => {
                      this.setState({
                        display: 'none',
                      });
                      this.props.delete();
                    }}>
                      <DeleteIcon classes={{root: classes.block}} color="secondary"/>
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>
          <div className={classes.root}>
            <FileExpand heading="History" api={api} fileId={fileId} onExpand={this.getHistory}/>
            <FileExpand heading="One Time Password" api={api} fileId={fileId} onExpand={this.getOtp}/>
            <FileExpand heading="Details" fileId={fileId} onExpand={() => {}} content={`Size: ${size}`}/>
          </div>
        </Paper>
      </Grid>
    );
  }
}

File.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(File);