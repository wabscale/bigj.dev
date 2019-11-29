import React, {Fragment} from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {Query} from 'react-apollo';
import CircularProgress from "@material-ui/core/CircularProgress";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  item: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  }
});

class HistoryExpand extends React.Component {
  state = {
    expanded: false
  };

  render() {
    const {
      classes,
      query,
      args,
      heading,
      reshape
    } = this.props;
    const {
      expanded
    } = this.state;

    return (
      <ExpansionPanel onChange={() => this.setState({expanded: !expanded})}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
          <Typography className={classes.heading}>
            {heading}
          </Typography>
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
                    <List className={classes.item}>
                      {reshape(data).map(({ip, time, allowed}) => (
                        <ListItem>
                          <Tooltip title={`Download was${allowed ? " " : " not "}allowed`}>
                            <IconButton color={"secondary"}>
                              {allowed
                                ? <DoneIcon color="primary"/>
                                : <ErrorIcon color="error"/>}
                            </IconButton>
                          </Tooltip>
                          <ListItemText primary={ip} secondary={time}/>
                        </ListItem>
                      ))}
                    </List>
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

HistoryExpand.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HistoryExpand);

