import React, { Component } from 'react';
import Login from './login';
import Home from './home';
var localStorage = require('localStorage')

class Diamond extends Component {
 
    render(){
      let  auth = localStorage.getItem('Authorised');
         return(
   <div>{auth ==="true"?<Home/>:<Login/> }
     
          </div>

             );
            }
     }

export default Diamond
