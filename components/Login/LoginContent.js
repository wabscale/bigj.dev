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
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
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
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
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
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  }
});

class LoginContent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      unauth: false,
    };
    this.login = this.login.bind(this);


  }

  login(client) {
    const {username, password} = this.state;
    const {switchView} = this.props;
    client.query({
      query: LOGIN,
      variables: {username, password}
    }).then(({data}) => {
      localStorage.setItem('token', data['login']['token']);
      // switchView("view");
    }).catch(e => {
      console.log(e);
      this.setState({unauth: true})
    });
  }

  render() {
    const {classes, switchView} = this.props;
    const {username, password, unauth} = this.state;

    return (
      <Grid container spacing={24} alignItems="center" justify="center" direction="column">
        {
          unauth ? (
        <Grid item key="alert">
          <Chip
            label="Invalid Credentials"
            className={classes.paper}
            color="secondary"
            onDelete={() => this.setState({unauth: false})}
          />
        </Grid>
          ) : <Fragment />
        }
        <Grid item key="form">
          <ApolloConsumer>
            {client => (
              <Paper className={classes.paper}>
                <Grid container spacing={16}>
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
