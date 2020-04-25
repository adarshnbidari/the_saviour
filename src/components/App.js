import React, { Component, Suspense } from 'react';

//dependency

import io from 'socket.io-client';


//


const MapView = React.lazy(() => import('./MapView'));

const AskGpsPermission = React.lazy(() => import('./AskGpsPermission'));


export default class App extends Component {


  constructor() {


    super();

    this.socket = io('http://localhost');

    this.state = {

      map: {

        needToDisplay: false

      },


      permissionDialog: {

        needToDisplay: true

      },

      receivedHelpLocations: []


    };


  }


  componentDidMount() {

    this.socket.on("help_locations", data => {

      console.log('received data for helping');

      console.log(data);

      this.setState({

        receivedHelpLocations: [...this.state.receivedHelpLocations, data]

      });

    });

  }



  userChoice = (choice) => {


    this.setState({

      map: {

        needToDisplay: true

      },

      permissionDialog: {


        needToDisplay: false

      }

    });

    if (choice) {


      if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(position => {


          this.socket.emit("geolocation_details", {

            time: new Date().toString(),
            location_coordinates: [position.coords.latitude, position.coords.longitude]

          });



        });

      }


    } else {

      this.socket.emit("help_locations", true);

    }




  }





  render() {

    return (

      <div>

        <Suspense fallback={<div>Loading...</div>}>

          <AskGpsPermission needToDisplay={this.state.permissionDialog.needToDisplay} askingHelp={this.userChoice} />

          <MapView needToDisplay={this.state.map.needToDisplay} otherUserLocations={this.state.receivedHelpLocations} />

        </Suspense>


      </div>




    );


  }



}