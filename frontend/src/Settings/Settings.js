// React
import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';

// Graphql
import {ApolloConsumer, Query, withApollo} from "react-apollo";

// Graphql queries
import {GET_ALL_CONFIG, UPDATE_CONFIG} from '../queries';

// Material UI
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import Chip from '@material-ui/core/Chip';
import Grow from '@material-ui/core/Grow';

// Custom Components
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
  }

  save = () => {
    /**
     * This function will handle saving all the visible config after
     * a user clicks the save icon.
     */

    console.log('sanity')
    const {client} = this.props;
    const {settingState} = this.state;
    client.mutate({
      mutation: UPDATE_CONFIG,
      variables: {
        keys: Object.keys(settingState),
        values: Object.keys(settingState).map(key => (
          settingState[key].value
        )),
      },
      fetchPolicy: 'no-cache'
    }).then(({data}) => {
      this.setState({errors: data.updateConfig});
    });
  };

  initSettingState = allConfig => {
    /**
     * This will take the visible config response in the API, and saves
     * it in the component state. Really this is mostly reshaping the
     * response from the api.
     */
    const {settingState} = this.state;
    allConfig.forEach(({key, value, valueType}) => {
      settingState[key] = {
        value,
        valueType
      };
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
              // Yeet user to login screen
              setTimeout(() => (
                switchView('Sign In')
              ), 250);
              return null;
            }

            /**
             * On the first time the data is requested from the api we will set the
             * settingState here, through the initSettingState function. That function will
             * call the this.setState function, so it will schedule a re-render on completion.
             */
            if (Object.keys(settingState).length === 0) {
              const allConfig = data.getAllConfig;
              setTimeout(() => (
                this.initSettingState(allConfig)
              ), 100);
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
                                          // This will take the error message out of the errors state.
                                          const copy = errors.filter(item => (
                                            item.message !== err.message
                                          ));

                                          // If no errors left, then reset error state.
                                          if (copy.length === 0)
                                            return {errors: null};

                                          // schedule re-render without current error
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
                        {Object.keys(settingState).map(key => {
                          const {value, valueType} = settingState[key];
                          switch (valueType) {
                            case 'string': return (
                                <Grid item xs key={key}>
                                  <StringConfig
                                    label={key}
                                    value={value}
                                    onChange={({target}) => this.setState(({settingState}) => {
                                      settingState[key] = {
                                        value: target.value,
                                        valueType,
                                      };
                                      return {settingState};
                                    })}
                                  />
                                </Grid>
                              );
                            case 'boolean': return (
                                <Grid item xs key={key}>
                                  <BooleanConfig
                                    label={key}
                                    value={value}
                                    onChange={() => this.setState(({settingState}) => {
                                      settingState[key] = {
                                        value: settingState[key].value === '1' ? '0' : '1',
                                        valueType,
                                      };
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
