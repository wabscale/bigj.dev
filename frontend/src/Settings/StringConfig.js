import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  textField: {
    margin: theme.spacing(3),
  },
});

function StringConfig(props) {
  const {
    label: key,
    value,
    onChange,
    classes
  } = props;

  return (
    <TextField
      id="outlined-name"
      label={key}
      className={classes.textField}
      value={value}
      onChange={onChange}
      margin="normal"
      variant="outlined"
    />
  );
}

StringConfig.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(StringConfig);