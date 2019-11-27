import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Switch from "@material-ui/core/Switch";
import {Typography} from "@material-ui/core";

const styles = theme => ({
  switch: {
    margin: theme.spacing(3),
  },
});

function BooleanConfig(props) {
  const {
    label: key,
    value,
    onChange,
    classes
  } = props;

  return (
    <Typography
      className={classes.typography}
      component="h3"
    >
      {key}
      <Switch
        label={key}
        checked={value === '1'}
        className={classes.switch}
        value={value}
        color="primary"
        onChange={onChange}
      />
    </Typography>
  );
}

BooleanConfig.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BooleanConfig);