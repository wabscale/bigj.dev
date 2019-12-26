import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';
import TextField from "@material-ui/core/es/TextField/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {LOGIN} from '../queries';
import {ApolloConsumer} from 'react-apollo';
import Chip from '@material-ui/core/Chip';
import Grow from '@material-ui/core/Grow';
import Cookies from 'universal-cookie';
import {Redirect} from "react-router-dom/";

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexGrow: 1,
  },
  paper: {
    maxWidth: 936 / 2,
    margin: 'auto',
    overflow: 'hidden',
    textAlign: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
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
    marginLeft: theme.spacing(2),
  },
  contentWrapper: {
    margin: '40px 16px',
  },
  textField: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  heading: {
    ...theme.mixins.gutters(),
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
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


/**
 * This function will return a rendered chip warning if
 * hasAttemptedLogin is true.
 *
 * @param hasAttemptedLogin
 * @returns {*}
 * @constructor
 */
const DisplayWarning = hasAttemptedLogin => (
  <Fragment>
    {hasAttemptedLogin ? (
      <Grow
        in={hasAttemptedLogin}
        timeout={250}
        unmountOnExit
      >
        <Grid item key="alert">
          <Chip
            label="Invalid Credentials"
            color="secondary"
            onDelete={() => this.setState({hasAttemptedLogin: false})}
          />
        </Grid>
      </Grow>
    ) : <Fragment/>}
  </Fragment>
);

class LoginContent extends React.PureComponent {
  constructor(props) {
    super(props);
    const cookies = new Cookies();
    this.state = {
      username: '',
      password: '',
      hasAttemptedLogin: false,
      loggedIn: cookies.get('token'),
    };
  }

  /**
   * This will send the entered creds to the api, and
   * request a token.
   *
   * Upon success, it will set the loggedIn state to true.
   * This will trigger a re-render which will return a
   * redirect to the main file view page.
   *
   * Upon an unsuccessful request, it will display a warning chip
   * to the user.
   *
   * @param client - graphql client
   */
  login = client => {
    const {username, password} = this.state;
    const cookies = new Cookies();
    client.query({
      query: LOGIN,
      variables: {username, password},
      fetchPolicy: 'no-cache',
    }).then(({data}) => {
      const {token} = data.login;
      if (cookies.get('token')) {
        // If cookie already exists, clear it.
        cookies.remove('token');
      }
      cookies.set('token', token);
      this.setState({loggedIn: true});
    }).catch(e => {
      console.log(e);
      this.setState({hasAttemptedLogin: true});
    });
  };

  render() {
    const {classes} = this.props;
    const {
      username,
      password,
      hasAttemptedLogin,
      loggedIn,
    } = this.state;

    if (loggedIn)
      return <Redirect to="/view"/>;

    return (
      <Grid container spacing={3} alignItems="center" justify="center" direction="column">
        {DisplayWarning(hasAttemptedLogin)}
        <Grid item key="form">
          <ApolloConsumer>
            {client => (
              <Grow
                in={true}
                timeout={500}
              >
                <Paper className={classes.paper}>
                  <Grid container spacing={2}>
                    <Grid item key="title" xs={12}>
                      <Typography
                        variant="h5"
                        component="h3"
                      >
                        Login Plz
                      </Typography>
                    </Grid>
                    <Grid item key="username" xs={12}>
                      <TextField
                        required
                        id="outlined-required"
                        name="username"
                        label="Username"
                        className={classes.textField}
                        margin="normal"
                        variant="outlined"
                        value={username}
                        onChange={e => this.setState({
                          username: e.target.value,
                        })}
                        onKeyPress={e => e.key === 'Enter' ? this.login(client) : null}
                      />
                    </Grid>
                    <Grid item key="password" xs={12}>
                      <TextField
                        required
                        id="outlined-password-input"
                        name="password"
                        label="Password"
                        className={classes.textField}
                        type="password"
                        margin="normal"
                        variant="outlined"
                        value={password}
                        onChange={e => this.setState({
                          password: e.target.value,
                        })}
                        onKeyPress={e => e.key === 'Enter' ? this.login(client) : null}
                      />
                    </Grid>
                    <Grid item key="submit" xs={12}>
                      <Button
                        variant="contained"
                        className={classes.button}
                        onClick={() => this.login(client)}
                        color="primary"
                        type="submit"
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Grow>
            )}
          </ApolloConsumer>
        </Grid>
      </Grid>
    );
  }
}

LoginContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginContent);
