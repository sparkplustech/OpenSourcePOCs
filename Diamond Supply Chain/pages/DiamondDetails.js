
import React, { Component } from 'react';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import { Segment,Header,Form,Button,Container,Grid,Icon,Message, Table} from 'semantic-ui-react';
import Sidebar from '../components/Sidebar';
import Link from 'next/link'
import DiamondTable from '../components/DiamondTable';

class DiamondDetails extends Component {
  

    render(){  
     
        return( 
   <div>
       <Layout/>  
       <Grid textAlign='center' verticalAlign='middle' style={{ paddingBottom:'80px'}}>
              <Grid.Column style={{ maxWidth: 550 }}>
              
         <DiamondTable/>
      </Grid.Column>
      </Grid>
        <Footer s={{position:'absolute', width:'100%', height:'3.5rem',bottom: 0}}/>
          </div>
 
             );
            }
     }

export default DiamondDetails



