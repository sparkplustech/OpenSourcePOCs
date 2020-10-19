import React, { Component } from 'react';
import Layout from '../components/Layout';
import Login from './login';
import Link from 'next/link';
import { Header,Form,Button,Grid,Table, Container,Loader,Dimmer} from 'semantic-ui-react';
import Sidebar from '../components/Sidebar';
var localStorage = require('localStorage')
import cinstance from '../src/cinstance';
import Footer from '../components/Footer';

class Home extends Component {
  state={
    diamonds:[],
    active:false
  }
 async componentDidMount(){
  await this.setState({active:true})
    const count = await cinstance.methods.diamondCount().call()
    let role = localStorage.getItem('role');
    let name= localStorage.getItem('name');
    role = role==="retailer"?"consumer":role==="supplier"?"producer":"logistic"
    console.log(role)
    if(role==="producer"){
    for(let i=1;i<=count;i++){
     const result = await cinstance.methods.diamonds(i).call()  
     if(result.producer===name){
     await this.setState({diamonds:[...this.state.diamonds,result]})
     }}
    }
    if(role==="logistic"){
      for(let i=1;i<=count;i++){
       const result = await cinstance.methods.diamonds(i).call() 
       console.log(result.logistic) 
       if(result.logistic===name){
       await this.setState({diamonds:[...this.state.diamonds,result]})
       }}
      }
      if(role==="consumer"){
        for(let i=1;i<=count;i++){
         const result = await cinstance.methods.diamonds(i).call()  
         if(result.consumer===name){
         await this.setState({diamonds:[...this.state.diamonds,result]})
         }}
        }
        await this.setState({active:false})
  }
    render(){  
      let  auth = localStorage.getItem('Authorised');
      let role = localStorage.getItem('role');
         return(
          auth==='true'?<>
       <Layout/>    
       <Container style={{marginTop:'30px',maxWidth:500}}>
         <Header as='h3' textAlign='left' style={{ fontSize: '30px'}}>
         Home 
     {role==="supplier" && <Link href="/Create_diamond"><Button
            floated='right'    
           secondary style={{marginRight:'20px'}}><a  style={{ color:'#fff'}}>Create Diamond</a>
          </Button></Link>}
            </Header>
              <Grid textAlign='center' verticalAlign='middle'   style={{ paddingBottom:'180px'}}>
              <Grid.Column >
             <Table celled  >
    <Table.Header>
      <Table.Row>
       
        <Table.HeaderCell   style={{textAlign: 'center'}}>Diamond Name          
        </Table.HeaderCell>
        {this.state.diamonds.length!=0&&
     <Table.HeaderCell   style={{textAlign: 'center'}}>Status         
        </Table.HeaderCell>
        }
          {this.state.diamonds.length!=0&& role!=="supplier"&&
     <Table.HeaderCell   style={{textAlign: 'center'}}>Action        
        </Table.HeaderCell>
        }
      </Table.Row>
    </Table.Header>
    {this.state.diamonds.length===0&&
    <Table.Body>
      <Table.Row>
     
      <Table.Cell style={{textAlign: 'center', color:'red'}}>No Diamond</Table.Cell>
      </Table.Row>
    </Table.Body>
}
{this.state.diamonds.map((item)=>
    <Table.Body>
      <Table.Row>
      <Table.Cell  style={{textAlign: 'center'}}>
        <Link  href={{ pathname:"/DiamondDetails",query:item.id}}>
          <a  style={{marginLeft: '40px'}}> {item.name}</a>
        </Link>
      </Table.Cell>
      <Table.Cell width={3} style={{textAlign: 'center'}}>
        
          {item.delivered?"Delivered":item.shipped?"Shipped to consumer":item.accepted?"Accepted By logistic":"Supplier"}
        
      </Table.Cell>
      {role!=="supplier"&& <Table.Cell width={4} style={{textAlign: 'center'}}>
        <Link  href={{ pathname:"/DiamondDetails",query:item.id}}>
          <a> 
          {item.delivered?" ":role==="logistic"&&item.accepted&&!item.shipped?"Ship to Consumer":role==="logistic"&&!item.accepted?"Accept Shipment":role==="retailer"&&item.shipped?"Accept Delivery":" "}
          </a>
        </Link>
</Table.Cell>}
      </Table.Row>
</Table.Body>)
}
 
  </Table>
</Grid.Column>
              </Grid>
              <Dimmer active={this.state.active} >
        <Loader inverted content='Loading from blockchain wait for 10-30Sec' />
      </Dimmer>
              </Container> 
              {this.state.diamonds.length<=0|| this.state.diamonds.length<6&&
              <Footer  s={{position:'absolute'  ,width:'100%', height:'3.5rem',bottom: 0}}/>}
              {this.state.diamonds.length>=6&& <Footer  s={{  width:'100%', height:'3.5rem',bottom: 0}}/>}
      </>
         :<Login/>
 
             );
            }
     }

export default Home
