import React from 'react';
import { Route, Link, BrowserRouter, Switch ,withRouter} from 'react-router-dom';
import Register from './register';
import {Header} from './header';
import Footer from './footer';
import trackingTab from './TrakingSystem/trackingTab'
// import $ from 'jquery';
import './globle.css';

class Navigation extends React.Component {

   render() {
      return (
     < BrowserRouter >
      <Header />
        <Switch>
         <Route exact path="/" component={trackingTab} />
         <Route path="/vehicledetail" component={Register} />
         <Route path="/tracking" component={trackingTab} />
       </Switch>
      <Footer /> 
      </ BrowserRouter >
      );
   }
}


export default Navigation;
