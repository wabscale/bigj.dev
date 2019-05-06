import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';
import TextField from "@material-ui/core/es/TextField/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  paper: {
    maxWidth: 936/2,
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
});

class Content extends React.PureComponent {
  state = {
    username: '',
    password: '',
  };

  render() {
    const {classes} = this.props;

    return (
      <Grid container spacing={24}>
        <Grid item xs={12} key="form">
          <form className={classes.container} noValidate autoComplete="off" method="POST">
            <Paper className={classes.paper}>
              <input
                hidden
                name="_csrf"
                defaultValue={csrf_token}
              />
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
                    onChange={e => this.setState({
                      password: e.target.value,
                    })}
                  />
                </Grid>
                <Grid item key="submit" xs={12}>
                  <Button
                    variant="contained"
                    className={classes.button}
                    onClick={this.submit}
                    color="primary"
                    type="submit"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </form>
        </Grid>
      </Grid>
    );
  }
}

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Content);
