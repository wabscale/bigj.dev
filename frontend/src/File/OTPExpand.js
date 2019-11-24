import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {Query, Mutation} from 'react-apollo';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {withStyles} from '@material-ui/core/styles';
import CircularProgress from "@material-ui/core/CircularProgress";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import {GET_OTP, UPDATE_OTP} from '../queries';
import {TextField} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  item: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    margin: theme.spacing(3),
  }
});

class OTPExpand extends React.Component {
  state = {
    expanded: false,
    timeout: '0',
  };

  componentDidMount(): void {
    this.setState({
      timeout: '0',
    })
  }

  render() {
    const {classes, fileID, heading, reshape} = this.props;
    const {expanded} = this.state;

    return (
      <ExpansionPanel onChange={() => this.setState({expanded: !expanded})}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography className={classes.heading}>{heading}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {
            expanded
              ? <Query query={GET_OTP} variables={{fileID}}>
                {({data, loading, error}) => {
                  if (loading)
                    return <CircularProgress className={classes.progress}/>;
                  if (error)
                    return <Fragment/>;
                  const {otp, rawOtp} = data.getOTP;
                  const {timeout = '0'} = this.state;
                  return (
                    <Grid
                      container
                      spacing={2}
                      direction="column"
                      justify="center"
                      alignItems="center"
                    >
                      <Grid item xs>
                        <Link href={otp}>
                          {otp}
                        </Link>
                        {/*<Tooltip title={otp}>*/}
                        {/*  <IconButton color={"secondary"}>*/}
                        {/*    <Link href={otp}>*/}
                        {/*      <VpnKeyIcon color={'primary'}/>*/}
                        {/*    </Link>*/}
                        {/*  </IconButton>*/}
                        {/*</Tooltip>*/}
                      </Grid>
                      <Grid item xs>
                        <Mutation mutation={UPDATE_OTP}>
                          {updateOtp => (
                            <Fragment>
                              <TextField
                                id="outlined-name"
                                label="Timeout"
                                className={classes.textField}
                                defaultValue={'0'}
                                value={timeout}
                                onChange={e => this.setState({timeout: e.target.value})}
                                margin="normal"
                                variant="outlined"
                              />
                              <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={() => {
                                  updateOtp({
                                    variables: {
                                      otp: rawOtp,
                                      timeout: parseInt(timeout)
                                    }
                                  });
                                }}
                              >
                                Save
                              </Button>
                            </Fragment>
                          )}
                        </Mutation>
                      </Grid>
                    </Grid>
                  );
                }}
              </Query>
              : <Fragment/>
          }
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

OTPExpand.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OTPExpand);