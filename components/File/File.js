import React, {PureComponent, Fragment} from 'react';
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
import Grow from '@material-ui/core/Grow';
import {withApollo} from 'react-apollo';
import {GET_DOWNLOAD_HISTORY, GET_OTP, GET_FILE_SIZE, UPDATE_FILE} from "../queries";

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
    // console.log(props.client);
  }

  async update() {
    const {fileID, filename, isPublic} = this.state;
    const {client} = this.props;
    await client.mutate({
      mutation: UPDATE_FILE,
      variables: {fileID, filename, isPublic},
    });
  }

  togglePublic() {
    this.setState({
      isPublic: !this.state.isPublic,
    }, this.update);
  }

  render() {
    const {classes, index} = this.props;
    const {fileID, filename, isPublic} = this.state;
    console.log("render file");

    return (
      <Grow
        in={true}
        style={{transformOrigin: '0 0 0'}}
        timeout={250 + (index * 250)}
        key={`file_${fileID}_grow`}
      >
        <Paper className={classes.paper}>
          <Fragment>
            <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
              <Toolbar>
                <Grid
                  container
                  spacing={16}
                  alignItems="center"
                  key={`file_${fileID}_toolbar`}
                >
                  <Grid item xs key={`file_${fileID}_filename`}>
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
                      onKeyPress={event => event.key === "Enter" ? this.update(client) : {}}
                    />
                  </Grid>
                  <Grid item key={`file_${fileID}_save`}>
                    <Tooltip title="Save">
                      <IconButton color="default" onClick={() => this.update(client)}>
                        <SaveIcon
                          classes={{root: classes.block}}
                          color="inherit"
                        />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item key={`file_${fileID}_download`}>
                    <Tooltip title="Download">
                      <IconButton href={`/f/${filename}`}>
                        <CloudDownloadIcon
                          classes={{root: classes.block}}
                          color="inherit"
                        />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item key={`file_${fileID}_public`}>
                    <Tooltip title={isPublic ? "Public" : "Private"}>
                      <Switch
                        checked={isPublic}
                        onChange={this.togglePublic}
                        color="primary"
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item key={`file_${fileID}_delete`}>
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
              <FileExpand
                heading="History"
                query={GET_DOWNLOAD_HISTORY}
                args={{fileID}}
                reshape={data => (
                  data.fileHistory.map(({ipAddress, time}) => (
                    ipAddress + time
                  )).join('\n')
                )}
              />
              <FileExpand
                heading="One Time Password"
                query={GET_OTP}
                args={{fileID}}
                reshape={data => (
                  <Link href={data.getOTP.otp}>
                    {data.getOTP.otp}
                  </Link>
                )}
              />
              <FileExpand
                heading="Details"
                query={GET_FILE_SIZE}
                args={{fileID}}
                reshape={() => null}
              />
            </div>
          </Fragment>
        </Paper>
      </Grow>
    );
  }
}

File.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withApollo(File));
