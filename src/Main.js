import React from 'react'
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
  Switch
} from 'react-router-dom';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import deepOrange from '@material-ui/core/colors/deepOrange';
import grey from '@material-ui/core/colors/grey';
import "./Login.css";
import HomePage from "./HomePage.js";
import mainLogo from'./pics/forkAndKnife.png';
import foodpic1 from './pics/restaurant-breakfast_4460x4460.jpg';
import Carousel from 'nuka-carousel';
import { black } from 'material-ui/styles/colors';
import $ from 'jquery'

/**
 * Object (I think it's an object..) used to mantain the current
 * authentication status of the user. It's used in the Login class before.
 */


const user = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100)
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100)
  }
}

const theme = createMuiTheme({
  palette: {
    primary: red,
  },
});


// Class that handles routing between login page and the home page.
class Login extends React.Component {

  state = {
    redirectToHome: false,
    username: "",
    password: "",
  }

  // The next two functions both deal with validation for the login form.
  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }
  // handleChange = event => {
  //   this.setState({[event.target.id]: event.target.value});
  // }

  componentDidMount() {
     this.setState({inputValue: this.props.inputValue});
  }

  changeUsername = (e) => {
    this.setState({username: e.target.value});
  }

  changePassword = (e) => {
    this.setState({password: e.target.value});
  }

  // Check with deployd if the username and password is correct
  handleSubmit = event => {
    event.preventDefault();

    sessionStorage.setItem('USER_USERNAME', this.state.username);

    fetch('/users/login', {
           method: 'POST',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
           },
           body: JSON.stringify({
             username: this.state.username,
             password: this.state.password
           })
         }).then(function(result){
           // If successful, authenticate the user and login.

           if (result.status !== 401){
              console.log("success");
              user.authenticate(() => {
                this.setState(() => ({
                  redirectToHome: true
                }))
              })
           } else {
             // TODO: handle error. Maybe somehow make a popup window
             // appear alerting the user that they entered invalid credentials?
           }
      }.bind(this));
  }

  // Renders the login form.
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    const { redirectToHome } = this.state

    if (redirectToHome === true) {
      return <Redirect to={from} />
    }



    return (
      <div className="Content">
        <div className="header">
          <div className="title">
            <h1>Me Hungry</h1>
            <img src={mainLogo} />
          </div>
        </div>
        <div className="main">
          <div className="slider-outer">
            <div className="slider">
              <div id="foodpic1" className="slide-item"><span className="slide-image" ></span></div>
              <div id="foodpic2" className="slide-item"><span className="slide-image" ></span></div>
              <div id="foodpic3" className="slide-item"><span className="slide-image" ></span></div>
            </div>
          </div>
        </div>
        <div className="Login-Container">
          <form onSubmit={this.handleSubmit}>
            <FormGroup className="LogIn-FormGroup">
              <FormControl autoFocus>
                <InputLabel>Username</InputLabel>
                <Input
                  label="Username"
                  className="LogIn-Form"
                  type="username"
                  onChange={this.changeUsername}
                />
              </FormControl>
              <FormControl>
                <InputLabel>Password</InputLabel>
                <Input
                  label="Username"
                  className="LogIn-Form"
                  type="password"
                  onChange={this.changePassword}
                  inputProps={{
                  'aria-label': 'Description',
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={this.handleClickShowPassword}
                      onMouseDown={this.handleMouseDownPassword}
                    >
                      {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                />
              </FormControl>
              <MuiThemeProvider theme={theme}>
                <Button
                  color="primary"
                  className="LogIn-Button"
                  variant="contained"
                  disabled={!this.validateForm()}
                  type="submit"
                >
                  Log In
                </Button>
              </MuiThemeProvider>
            </FormGroup>
          </form>
        </div>
      </div>
    )
  }
}
// might use this later using carousel for login page

// <div className="Content">
// <div className="carousel-Container">
//   <Carousel
//     className="carousel"
//     autoplay={false}
//     heightMode={"first"}
//     //framePadding={"20px"}
//     initialSlideHeight={200}
//     initialSlideWidth={500}
//     slideIndex={0}
//   >
//     <img src={foodpic1} />
//     <img src="http://placehold.it/1000x400/ffffff/c0392b/&text=slide2" />
//     <img src="http://placehold.it/1000x400/ffffff/c0392b/&text=slide3" />
//     <img src="http://placehold.it/1000x400/ffffff/c0392b/&text=slide4" />
//     <img src="http://placehold.it/1000x400/ffffff/c0392b/&text=slide5" />
//     <img src="http://placehold.it/1000x400/ffffff/c0392b/&text=slide6" />
//   </Carousel>
// </div>


/**
 * This is a custom JSX tag (I think). This is needed so that a user
 * cannot travel to a page (in this case, the home page) without being
 * authenticated. If a user is not authenticated, they are redirected to
 * the login page.
 */
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    user.isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }} />
  )} />
)

const theme2 = createMuiTheme({
  palette: {
    primary: deepOrange,
    secondary: grey,
  },
});

// TODO: Need to figure out what the hell 'withRouter' does.
const AuthButton = withRouter(({ history }) => (
  user.isAuthenticated ? (
    <p>
      <MuiThemeProvider theme={theme2}>
      <Button color="secondary" variant="raised"  onClick={() => {
        user.signout(() => history.push('/protected'))
      }}>Sign out</Button>
    </MuiThemeProvider>
    </p>
  ) : (
      <p hidden>ghdsafsdfa</p>
  )
))

/**
 * This function handles routing between pages on the main page (i.e. routing
 * between the login and home page). I have no idea when or how this function
 * gets called, but it does when the react app starts.
 */
export default function PageRouter () {
  return (
    <Router>
      <div>
        <AuthButton/>
        <Switch>
          <Route path="/login" component={Login}/>
          <PrivateRoute path='/protected' component={HomePage} />
          <Redirect to='/login' />
        </Switch>
      </div>
    </Router>
  )
}
