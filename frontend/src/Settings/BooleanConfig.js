import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Switch from "@material-ui/core/Switch";
import {Typography} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";

const styles = theme => ({
  switch: {
    margin: theme.spacing(3),
  },
});

/**
 * This object should be used to determine the title of the tooltip. The key should be
 * the same as the config key. The value should be a lambda or function that takes the
 * current value of the config and returns a string for the title of the tooltip.
 *
 * @type {{key: (function(value): string)}}
 */
const tooltipTitle = {
  'defaultPermission': value => value === '1' ? 'Public' : 'Private',
};

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
      <Tooltip
        title={tooltipTitle[key](value)}
      >
        <Switch
          checked={value === '1'}
          className={classes.switch}
          value={value}
          color="primary"
          onChange={onChange}
        />
      </Tooltip>
    </Typography>
  );
}

BooleanConfig.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BooleanConfig);