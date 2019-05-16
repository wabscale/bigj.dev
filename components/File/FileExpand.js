import React, {Fragment} from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import {Query} from 'react-apollo';
import CircularProgress from "@material-ui/core/CircularProgress";
import Grow from '@material-ui/core/Grow';

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
  state = {
    expanded: false
  };

  render() {
    const {classes, query, args, heading, reshape} = this.props;
    const {expanded} = this.state;

    return (
      <ExpansionPanel onChange={() => this.setState({expanded: !expanded})}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography className={classes.heading}>{heading}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {
            expanded
              ? <Query query={query} variables={args}>
                {({data, loading, error}) => {
                  if (loading)
                    return <CircularProgress className={classes.progress}/>;
                  if (error)
                    return <Fragment/>;
                  return (
                    <Grow
                      in={expanded}
                      timeout={250}
                      mountOnEnter
                      unmountOnExit
                    >
                      <Grid container spacing={0}>
                        {reshape(data).map((element, index) => (
                          <Grid item xs={12} key={index}>
                            {element}
                          </Grid>
                        ))}
                      </Grid>
                    </Grow>
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

FileExpand.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FileExpand);

