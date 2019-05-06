import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class FileExpand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: props.content,
      expanded: false
    };
  }

  render() {
    const {classes} = this.props;

    return (
      <ExpansionPanel onChange={() => this.setState({
        expanded: !this.state.expanded,
      })}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} onClick={this.props.onExpand.bind(this)}>
          <Typography className={classes.heading}>{this.props.heading}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            {this.state.content}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

FileExpand.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FileExpand);

