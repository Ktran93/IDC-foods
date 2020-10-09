import React, { Component } from "react";
import ReactDOM from 'react-dom';
import YelpService from '../Services/yelp';
import YelpReviews from '../Services/yelpReviews';
import {geolocated} from 'react-geolocated';
import { withAlert } from "react-alert";
import Select from 'react-select';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

import green from '@material-ui/core/colors/green';
import { GoogleMapLoader, withGoogleMap, GoogleMap, DirectionsRenderer } from "react-google-maps";
import MapWithADirectionsRenderer from '../MapWithADirectionsRenderer';
import Geocode from "react-geocode";
import './home.css';

Geocode.setApiKey("AIzaSyA_WObUiYD7YpoYufR84re1LZHAJeAGXkY");
Geocode.enableDebug();

const foodOptions = [
  {value:'mexican', label:'Mexican'},
  {value:'newamerican, tradamerican', label:'American'},
  {value:'chinese', label:'Chinese'},
  {value:'japanese', label:'Japanese'},
  {value:'italian', label:'Italian'}
]
const distanceOptions = [
  {value: 8046, label:'5 miles'},
  {value: 16093, label:'10 miles'},
  {value: 24140, label:'15 miles'},
  {value: 32187, label:'20 miles'}
]
const priceOptions = [
  {value: 1, label:'$'},
  {value: 2, label:'$$'},
  {value: 3, label:'$$$'},
  {value: 4, label:'$$$$'}
]

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});

class Home extends Component {

  state = {
    region: null,
    restaurants: [],
    categories: null,
    distance: null,
    price: null,
    restaurantChosen: undefined
  }

  componentDidMount(){
    //this.getLocationAsync();
  }

  getRestaurants = async() => {
    const { latitude, longitude } = this.state.region;
    console.log(this.state.region);
    const category = this.state.categories;
    const distance = this.state.distance;
    const price = this.state.price;
    const userLocation = { latitude, longitude };
    const restaurants = await YelpService.getRestaurants(userLocation, category, distance, price);
    await this.setState({ restaurants });
  };

  getLocationAsync = async() => {
    console.log(document.getElementById("locationField").value);
    if (document.getElementById("locationField").value != "") {
      await Geocode.fromAddress(document.getElementById("locationField").value).then(
        async (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          const region = {
            latitude: lat,
            longitude: lng
          };
          await this.setState({ region });
          await this.getRestaurants();
        },
        error => {
          console.error(error);
        }
      );
    }
    else{
      if (this.props.isGeolocationEnabled) {
        console.log(this.props.coords);
        const region = {
          latitude: this.props.coords.latitude,
          longitude: this.props.coords.longitude
        };
        await this.setState({ region });
        await this.getRestaurants();
      }
      else {
        console.log("Geofence not activated");
      }
    }
  };

  handleClick = async() => {
    ReactDOM.render(<div>
                      <MuiThemeProvider theme={theme}>
                        <LinearProgress color="primary" />
                      </MuiThemeProvider>
                    </div>,document.getElementById('mapplace'));
    await this.getLocationAsync();
    console.log(this.state);
    const {region, restaurants} = this.state;
    console.log(restaurants);
    this.state.restaurantChosen = undefined;

    // Try up to 10 times to get a restaurant that is not undefined
    for (var i = 0; this.state.restaurantChosen === undefined && i < 10; i++) {
      var restaurantIndex = Math.floor(Math.random() * restaurants.length);
      this.state.restaurantChosen = restaurants[restaurantIndex]
    }
    console.log(this.state.restaurantChosen);
    const reviews = await YelpReviews.getReviews(this.state.restaurantChosen.id);
    var originString = "" + this.props.coords.latitude + "," + this.props.coords.longitude;
    var destString = "" + this.state.restaurantChosen.coords.latitude + "," + this.state.restaurantChosen.coords.longitude;

    ReactDOM.render(
    <div>
    <h2>User Reviews</h2>
    <div className="card-List">
      <Card className="card">
        <CardMedia
          className="cardMedia"
          image={reviews[0].user.image_url}
        />
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            {reviews[0].user.name}
          </Typography>
          <Typography component="p">
           {reviews[0].review}
          </Typography>
        </CardContent>
      </Card>
      <Card className="card">
        <CardMedia
            className="cardMedia"
            image={reviews[1].user.image_url}
          />
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            {reviews[1].user.name}
          </Typography>
          <Typography component="p">
           {reviews[1].review}
          </Typography>
        </CardContent>
      </Card>
      <Card className="card">
        <CardMedia
            className="cardMedia"
            image={reviews[2].user.image_url}
          />
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            {reviews[2].user.name}
          </Typography>
          <Typography component="p">
           {reviews[2].review}
          </Typography>
        </CardContent>
      </Card>
    </div>
    </div>
    , document.getElementById('reviews'));
    //ReactDOM.render(this.state.restaurantChosen.name, document.getElementById('rest'));
    ReactDOM.render(<MapWithADirectionsRenderer origin={originString} destination={destString} />, document.getElementById('mapplace'));
  }

  handleSaveClick = async() => {

    var username = sessionStorage.getItem('USER_USERNAME');

    var placeName = this.state.restaurantChosen.name;
    var placeDate = "today";
    var placeLat = this.state.restaurantChosen.coords.latitude;
    var placeLong = this.state.restaurantChosen.coords.longitude;

    console.log("USERNAME" + username);
    fetch('/users/?username='+ username, {
           method: 'GET',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
           }
         }).then(function(user){
           console.log(user);
           user.json().then(function(data) {
             console.log(data);
             var userId = data[0].id;






             var place = {placeName, placeDate, placeLong, placeLat};
             console.log(place);

             fetch('/users/' + userId, {
                    method: 'PUT',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      restaurant: {$push: place},

                    })
                  }).then(function(result){

                   console.log("anyting")
               }.bind(this));
           });
      });

  }

  _onFoodSelect = (option) => {
    const categories = option.value;
    this.setState({ categories });
  }

  _onDistanceSelect = (option) => {
    const distance = option.value;
    this.setState({ distance });
  }

  _onPriceSelect = (option) => {
    const price = option.value;
    this.setState({ price });
  }

  render() {
    return(
      !this.props.isGeolocationAvailable
      ? <div>Your browser does not support Geolocation</div>
      : !this.props.isGeolocationEnabled
        ? <div>Geolocation is not enabled</div>
        : this.props.coords
          ? <div id="root">
              <div id="rest">
              </div>
              <FormGroup className="location-FormGroup">
                <FormControl autoFocus>
                  <InputLabel>Location</InputLabel>
                  <Input
                    id="locationField"
                    type="text"
                    name="location"
                  />
                </FormControl>
              </FormGroup>
              <div className="row">
                <Select autosize={false} className="selector" options={foodOptions} onChange={this._onFoodSelect} placeholder="Select a Type of Food"/>
                <Select autosize={false} className="selector" options={distanceOptions} onChange={this._onDistanceSelect} placeholder="Select a Distance"/>
                <Select autosize={false} className="selector" options={priceOptions} onChange={this._onPriceSelect} placeholder="Select a Price"/>
              </div>
              <div className="resturantButton">
                <Button color="primary" variant="contained" onClick={this.handleClick}>
                  Search for Resturant
                </Button>
              </div>
              <Button variant="contained" color="secondary" onClick={this.handleSaveClick} >
                Save Place
              </Button>
              <div id="mapplace"></div>
              <div id="reviews"></div>
            </div>
          : <div>Getting the location data&hellip; <CircularProgress /></div>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(Home);

{/* <div>
  <input id="locationField" type="text" name="location"/>
</div> */}

 {/* <ul className="commentList">
        <li className="comment">
          <img className="reviewImage" src={reviews[0].user.image_url} alt="Avatar"/>
          <div className="userInfo">
            <h2><span>{reviews[0].user.name}</span></h2>
            <p>{reviews[0].review}</p>
          </div>
        </li>
        <li className="comment">
          <img className="reviewImage" src={reviews[1].user.image_url} alt="Avatar"/>
          <div className="userInfo">
            <h2><span>{reviews[1].user.name}</span></h2>
            <p>{reviews[1].review}</p>
          </div>
        </li>
        <li className="comment">
          <img className="reviewImage" src={reviews[2].user.image_url} alt="Avatar"/>
          <div className="userInfo">
            <h2><span>{reviews[2].user.name}</span></h2>
            <p>{reviews[2].review}</p>
          </div>
        </li>
      </ul> */}
