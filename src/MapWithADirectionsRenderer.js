/*global google*/
import React, { Component } from 'react';
import { compose, withProps, lifecycle } from "recompose";
import { withScriptjs,
    withGoogleMap,
    GoogleMap,
    DirectionsRenderer } from 'react-google-maps';

const MapWithADirectionsRenderer = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyA_WObUiYD7YpoYufR84re1LZHAJeAGXkY",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `300px` }} />,
        mapElement: <div style={{ height: `100%`, 'min-width': '200px' }} />,
    }),
    withScriptjs,
    withGoogleMap,
    lifecycle({
        componentWillMount() {
            this.setState({
                directions: null
            });
        },
        componentDidUpdate(prevProps, prevState) {
            if (prevProps.destination !== this.props.destination) {
                this.setState({
                    directions: null
                });
                this.drawRoutes();
            }
        },
        componentDidMount() {
            this.drawRoutes();
        },

        drawRoutes() {
            const DirectionsService = new google.maps.DirectionsService();

            DirectionsService.route({
                origin: this.props.origin,
                destination: this.props.destination,
                travelMode: google.maps.TravelMode.DRIVING,
            }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    this.setState({
                        directions: result
                    });
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            });
        }
    })
)(props =>
    <GoogleMap
        defaultZoom={7}
        defaultCenter={new google.maps.LatLng(
          props.origin.substr(0, props.origin.indexOf(',')),
          props.origin.substr(props.origin.indexOf(',') + 1))}>
    {props.directions && <DirectionsRenderer directions={props.directions} />}
    </GoogleMap>
);

export default MapWithADirectionsRenderer;
