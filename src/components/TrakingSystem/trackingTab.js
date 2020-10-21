import React from 'react';
import { Form } from 'react-bootstrap';
import { Tabs,Tab } from 'react-bootstrap';
import { Button,Modal } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import $ from 'jquery';

const mapStyles = {
    // width: '100%',
    // height: '100%'
    // position: 'relative'
  };
  
export class trackingTab extends React.Component {
  
    state = {
        showingInfoWindow: false,  // Hides or shows the InfoWindow
        activeMarker: {},          // Shows the active marker upon click
        selectedPlace: {},
        latlangval :[{"latitude":"22.7447","longitude":"75.8782"},{"latitude":"22.719568","longitude":"75.857727"},
        {"latitude":"22.7081","longitude":"75.9230"},{"latitude":"22.7195867","longitude":"75.8577078"}
    ]          // Shows the InfoWindow to the selected place upon a marker
      };

       // ...

            onMarkerClick = (props, marker, e) =>
            this.setState({
                selectedPlace: props,
                activeMarker: marker,
                showingInfoWindow: true
            });

            onClose = props => {
            if (this.state.showingInfoWindow) {
                this.setState({
                showingInfoWindow: false,
                activeMarker: null
                });
            }
            };

        // ...
    // For open close right nav bar  
     openNav = () => {
         alert('open nav')
        document.getElementById("mySidenav").style.width = "250px";
      }
      
       closeNav = () => {
        alert('close nav')
        document.getElementById("mySidenav").style.width = "0";
      }


     
      render() {

        $(document).ready(function(){
            $(".slideBtn").click(function(){    
              if($("#sidenav").width() == 0){      
                  document.getElementById("sidenav").style.width = "250px";
                  document.getElementById("main").style.paddingRight = "250px";
                  document.getElementById("slidebtn").style.paddingRight = "0px";
              }else{
                  document.getElementById("sidenav").style.width = "0";
                  document.getElementById("main").style.paddingRight = "0";
                  document.getElementById("slidebtn").style.paddingRight = "0";
              }
            });
          });
       
     
        return (
            
      <div className="content-wrapper" > 
      {/* Top Section */}
      <div className="row p-2">
         <div className="col-lg-3 col-6">
            {/* <!-- small box --> */}
            <div className="small-box top_info_bg">
                <div className="inner text-right p-3">
                <p className="tracking_topnumber">Total de Clientes</p>
                <h3 className="pt-2 ">86</h3>
                </div>
            </div>
         </div>

        <div className="col-lg-3 col-6">
            <div className="small-box top_info_bg">
                <div className="inner text-right p-3">
                <p className="tracking_topnumber">Total de Ativos</p>
                <h3 className="pt-2 ">148</h3>
                </div>
            </div>
         </div>

         <div className="col-lg-3 col-6">
            <div className="small-box top_info_bg">
                <div className="inner text-right p-3">
                <p className="tracking_topnumber">Total de Equipmentos</p>
                <h3 className="pt-2 ">128</h3>
                </div>
            </div>
         </div>

         <div className="col-lg-3 col-6">
            <div className="small-box top_info_bg">
                <div className="inner text-right p-3">
                <p className="tracking_topnumber">Total de Acessos</p>
                <h3 className="pt-2 ">124/151</h3>
                </div>
            </div>
         </div>
    {/* <!-- ./col --> */}
         </div>
        
        {/* middle map section */}
        <div className="row p-2">
            <div className="col-9 map_body">
  <Map
        google={this.props.google}
        zoom={13}
        style={mapStyles}
        className={'map'}
        initialCenter={{
            lat: 22.7447,
            lng:  75.8782
        }}
     >
          
      <Marker onClick={this.onMarkerClick}
                    name={'Dolores park'}
                    position={{lat: 22.7447, lng: 75.8782}} />
                    <Marker onClick={this.onMarkerClick}
                    name={'SOMA'}
                    position={{lat: 22.719567, lng: 75.857727}} />
                        <Marker onClick={this.onMarkerClick}
                    name={'SOMA'}
                    position={{lat: 22.719569, lng: 75.857727}} />
                    <Marker onClick={this.onMarkerClick}
                    name={'SOMA 23'}
                    position={{lat: 22.7081, lng: 75.9230}} />

                    <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.onClose}
               >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </Map>

            </div>
            <div className="col-3">
            {/* <h1>hello 2</h1> */}
            </div>
        </div>
        {/* middle map closed */}

              </div>
          );
      }
}

export default GoogleApiWrapper({
    apiKey: ("AIzaSyB7FLymI9ydscODciTgMnPNh_7NxdD32UI")
  })(trackingTab);

// export default trackingTab ;
// apiKey: 'AIzaSyDutk57rQ_y3Vvmw-97p3BaohyIDNmV2rk'
