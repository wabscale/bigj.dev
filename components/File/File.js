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
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import Switch from '@material-ui/core/Switch';
import Link from '@material-ui/core/Link';
import PropTypes from "prop-types";
import Grow from '@material-ui/core/Grow';
import Typography from '@material-ui/core/Typography';
import {withApollo, Mutation} from 'react-apollo';
import {
  GET_DOWNLOAD_HISTORY,
  GET_OTP,
  GET_FILE_SIZE,
  UPDATE_FILE,
  DELETE_FILE
} from "../queries";

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
  align: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  }
});

class File extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...props.file,
      display: true,
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

  truncateDecimals = (number, digits) => {
    let multiplier = Math.pow(10, digits),
      adjustedNum = number * multiplier,
      truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
  };

  humanSize = (nbytes) => {
    let suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let i = 0;
    let f = `${nbytes}`;
    while (nbytes >= 1024 && i < suffixes.length - 1) {
      nbytes /= 1024;
      ++i;
      f = this.truncateDecimals(nbytes, 2);
    }
    return `${nbytes} ${suffixes[i]}`;
  };

  render() {
    const {classes, index} = this.props;
    const {fileID, filename, isPublic, display} = this.state;

    return (
      <Grow
        in={display}
        style={{transformOrigin: '0 0 0'}}
        timeout={(index + 1) * 150}
        key={`file_${fileID}_grow`}
        // mountOnEnter
        unmountOnExit
      >
        <Grid item key={`file_${fileID}`} lg={4} md={4} sm={12}>
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
                        onKeyPress={event => event.key === "Enter" ? this.update() : {}}
                      />
                    </Grid>
                    <Grid item key={`file_${fileID}_save`}>
                      <Tooltip title="Save">
                        <IconButton color="default" onClick={() => this.update()}>
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
                      <Mutation mutation={DELETE_FILE}>
                        {deleteFile => (
                          <Tooltip title="Delete">
                            <IconButton onClick={async e => {
                              e.preventDefault();
                              deleteFile({
                                variables: {fileID}
                              });
                              this.props.delete();
                              this.setState({display: false});
                            }}>
                              <DeleteIcon classes={{root: classes.block}} color="secondary"/>
                            </IconButton>
                          </Tooltip>
                        )}
                      </Mutation>
                    </Grid>
                  </Grid>
                </Toolbar>
              </AppBar>
              <div className={classes.root}>
                <FileExpand
                  heading="History"
                  query={GET_DOWNLOAD_HISTORY}
                  args={{fileID}}
                  reshape={data => data.fileHistory.slice(0, 10).map(({ipAddress, time, allowed}) => {
                    const datetime = new Date(0);
                    datetime.setUTCMilliseconds(time);
                    const trimmedIPAddress = ipAddress.substr(ipAddress.lastIndexOf(':') + 1);
                    return (
                      <Grid container spacing={8} key={`historyItem-${time}`}>
                        <Grid item xs={3} key={"ip"}>
                          <Typography>
                            {trimmedIPAddress}
                          </Typography>
                        </Grid>
                        <Grid item xs={7} key={"date"}>
                          <Typography>
                            {datetime.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={2} key={"icon"}>
                          <Tooltip title={`Download was ${allowed ? "" : "not"} allowed`}>
                            <IconButton color={"secondary"}>
                            {allowed
                              ? <DoneIcon color="primary" className={classes.icon}/>
                              : <ErrorIcon color="error" className={classes.icon}/>}
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    );
                  })}
                />
                <FileExpand
                  heading="One Time Password"
                  query={GET_OTP}
                  args={{fileID}}
                  reshape={data => [
                    <Link href={data.getOTP.otp}>
                      {data.getOTP.otp}
                    </Link>
                  ]}
                />
                <FileExpand
                  heading="Details"
                  query={GET_FILE_SIZE}
                  args={{fileID}}
                  reshape={data => [
                    <Typography>
                      {this.humanSize(data.file.size)}
                    </Typography>
                  ]}
                />
              </div>
            </Fragment>
          </Paper>
        </Grid>
      </Grow>
    );
  }
}

File.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withApollo(File));
