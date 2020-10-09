import React, { Component } from "react";
import ReactDOM from "react-dom";

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import './stuff.css';

class Stuff extends Component {

  componentDidMount(){

    var test = this.loadPlaceList(); //TODO uncommnet this after we can access the database
  }

  loadPlaceList = async() => {

    var username = sessionStorage.getItem('USER_USERNAME');


    fetch('/users/?username='+ username, {
           method: 'GET',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'application/json'
           }
         }).then(function(user){

           user.json().then(function(data) {
             var restaurantList = data[0].restaurant;
             var mapWidth = 350;
             var mapHeight = 500;

             const placeItemList = restaurantList.map((place) =>
             <Card className="map">
              <CardMedia
                className="mapMedia"
                image={"https://maps.googleapis.com/maps/api/staticmap?center="
                + place.placeLat + "," + place.placeLong + "&zoom=13&size=" + mapWidth + "x" + mapHeight +
                "&maptype=roadmap&markers=color:red%7Clabel:A%7C" + place.placeLat + "," + place.placeLong +
                "&key=AIzaSyA_WObUiYD7YpoYufR84re1LZHAJeAGXkY"}
              />
              <CardContent>
                <Typography gutterBottom variant="headline" component="h2">
                  {place.placeName}
                </Typography>
                <Typography component="p">
                  {place.placeDate}
                </Typography>
              </CardContent>
            </Card>
             );

             ReactDOM.render(
              <div className="map-List">{placeItemList}</div>,
               document.getElementById('place-list')
             );
           });
      });
  }

  render() {
    return (
      <div id="place-list"></div>
    );
  }
}

export default Stuff;

{/* <li>
               <img id="test-image" src={"https://maps.googleapis.com/maps/api/staticmap?center="
               + place.placeLat + "," + place.placeLong + "&zoom=13&size=" + mapWidth + "x" + mapHeight +
               "&maptype=roadmap&markers=color:red%7Clabel:A%7C" + place.placeLat + "," + place.placeLong +
               "&key=AIzaSyA_WObUiYD7YpoYufR84re1LZHAJeAGXkY"} height={mapHeight} width={mapWidth}/>
              <h3>{place.placeName}</h3>
              <p>{place.placeDate}</p>
            </li> */}