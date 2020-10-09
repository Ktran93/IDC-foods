import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter,
  Link
} from "react-router-dom";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';


import Home from "./Screens/Home";
import Stuff from "./Screens/Stuff";
import Contact from "./Screens/Contact";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

class HomePage extends Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    console.log(value);
    this.setState({ value });
  };
  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
      <HashRouter>
        <div>
          <div className={classes.root}>
            <AppBar position="static">
              <Tabs value={value} onChange={this.handleChange} centered>
                <Tab label="Find Food" component={Link} to={'/'}/>
                <Tab label="Where you've been" component={Link} to={'/stuff'}/>
                <Tab label="About Us"  component={Link} to={'/contact'} />
              </Tabs>
            </AppBar>
        {value === 0 && <TabContainer><Route exact path="/" component={Home}/></TabContainer>}
        {value === 1 && <TabContainer><Route path="/stuff" component={Stuff}/></TabContainer>}
        {value === 2 && <TabContainer><Route path="/contact" component={Contact}/></TabContainer>}
          </div>
        </div>
      </HashRouter>
    );
  }
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);
