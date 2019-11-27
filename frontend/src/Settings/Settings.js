import React, {Component, Fragment} from 'react';
import {ApolloConsumer, Query, withApollo} from "react-apollo";
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import Chip from '@material-ui/core/Chip';
import Grow from '@material-ui/core/Grow';

import {GET_ALL_CONFIG, UPDATE_CONFIG} from '../queries';
import StringConfig from "./StringConfig";
import BooleanConfig from "./BooleanConfig";


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    maxWidth: 500,
    margin: 'auto',
    padding: theme.spacing(3, 2),
    overflow: 'hidden',
    flexGrow: 1,
  },
  block: {
    display: 'block',
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
  textField: {
    margin: theme.spacing(3),
  },
  chip: {
    maxWidth: 936 / 2,
    margin: 'auto',
    overflow: 'hidden',
    textAlign: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  }
});


class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settingState: {},
      errors: null,
    };
    this.allConfig = null;
  }

  save = client => {
    const {settingState} = this.state;
    client.mutate({
      mutation: UPDATE_CONFIG,
      variables: {
        keys: Object.keys(settingState),
        values: Object.values(settingState)
      },
      fetchPolicy: 'no-cache'
    }).then(({data}) => {
      this.setState({errors: data.updateConfig});
    });
  };

  initSettingState = () => {
    const {allConfig} = this;
    const {settingState} = this.state;
    allConfig.forEach(({key, value}) => {
      settingState[key] = value;
    });
    this.setState({settingState});
  };

  render() {
    const {classes, switchView} = this.props;
    const {settingState, errors} = this.state;

    return (
      <Grid
        container
        spacing={2}
        className={classes.root}
      >
        <Query
          query={GET_ALL_CONFIG}
          fetchPolicy={'no-cache'}
          // pollInterval={3000}
        >
          {({data, error, loading}) => {
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

            const allConfig = data.getAllConfig;
            if (this.allConfig === null) {
              this.allConfig = allConfig;
              setTimeout(this.initSettingState, 100);
              return null;
            }

            return (
              <ApolloConsumer>
                {client => (
                  <Fragment>
                    <Paper className={classes.paper}>
                      <Grid
                        container
                        spacing={3}
                        justify="center"
                        direction="column"
                        alignItems="center"
                      >
                        {
                          errors !== null ? (
                            <Grow
                              in={!!errors}
                              timeout={250}
                              unmountOnExit
                            >
                              <Grid item xs={12} key="alert">
                                {errors.length > 0 ?
                                  <Fragment>
                                    {errors.map(err => (
                                      <Chip
                                        label={err.message}
                                        className={classes.paper}
                                        color="secondary"
                                        onDelete={() => this.setState(({errors}) => {
                                          const copy = errors.filter(item => (
                                            item.message !== err.message
                                          ));
                                          if (copy.length === 0) {
                                            return {errors: null};
                                          }
                                          return {errors: copy};
                                        })}
                                      />
                                    ))}
                                  </Fragment>
                                  : <Chip
                                    label="Successfully saved settings"
                                    className={classes.paper}
                                    color="primary"
                                    onDelete={() => this.setState({errors: null})}
                                  />}
                              </Grid>
                            </Grow>
                          ) : <Fragment/>
                        }
                        <Grid item key={"title"}>
                          <Typography variant="h5" component="h3">
                            Settings
                          </Typography>
                        </Grid>
                        {allConfig.map(({key, value, valueType}) => {

                          switch (valueType) {
                            case 'string': return (
                                <Grid item xs key={key}>
                                  <StringConfig
                                    label={key}
                                    value={settingState[key]}
                                    onChange={({target}) => this.setState(({settingState}) => {
                                      settingState[key] = target.value;
                                      return {settingState};
                                    })}
                                  />
                                </Grid>
                              );
                            case 'boolean': return (
                                <Grid item xs key={key}>
                                  <BooleanConfig
                                    label={key}
                                    value={settingState[key]}
                                    onChange={() => this.setState(({settingState}) => {
                                      settingState[key] = settingState[key] === '1' ? '0' : '1';
                                      return {settingState};
                                    })}
                                  />
                                </Grid>
                              );
                            default: return null;
                          }
                        })}
                        <Grid item xs key={'save-button'}>
                          <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={() => this.save(client)}
                            to={''}
                          >
                            Save
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Fragment>
                )}
              </ApolloConsumer>
            );
          }}
        </Query>
      </Grid>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withApollo(Settings));
