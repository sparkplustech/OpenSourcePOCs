import React, { Component } from 'react';
var localStorage = require('localStorage')
import { Dimmer,Header,Loader,Button,Container,Table, Segment} from 'semantic-ui-react';
import cinstance from '../src/cinstance';
import Router from 'next/router'
 import emailjs from 'emailjs-com';

class DiamondTable extends Component {
  state={
    active:false,
    visible : false,
    supplier:'',
    diamond:{}
  }

 async  componentDidMount(){
    await this.setState({active:true,visible:true})
    let value =window.location.search.split('?')[1]
    let result = await cinstance.methods.diamonds(value).call()
    await this.setState({active:false,visible:false,diamond:result,supplier:result.producer})
  }
 
onAccept = async() =>{
  let value =window.location.search.split('?')[1]
  await this.setState({active:true})
    cinstance.methods.acceptDiamond(value,this.state.diamond.logistic).send({from: process.env.account})
  .then((res)=>{
    Router.push('/home')
  }).catch(err=>{
   this.setState({active:false})
    alert("failed")
  })
}

onShipped = async() => {
  let value =window.location.search.split('?')[1]
  await this.setState({active:true})
    cinstance.methods.shippedDiamond(value,this.state.diamond.logistic).send({from: process.env.account})
  .then((res)=>{
    Router.push('/home')
  }).catch(err=>{
   this.setState({active:false})
    alert("failed")
  })
}
    
onDelivery = async() =>{
  let count = await cinstance.methods.userCount().call()
  let to;
  await this.setState({active:true})
  let email= localStorage.getItem('email');
  for(let i=1;i<=count;i++){
      let result= await cinstance.methods.user(i).call()
      if(result.name===this.state.supplier)
      {
       to=result.email
      }
  }
  let val={to,"from":email}
  let value =window.location.search.split('?')[1]
    cinstance.methods.deliveredDiamond(value,this.state.diamond.consumer).send({from: process.env.account})
  .then((res)=>{
    emailjs.send('sendinblue', 'template_fxzCh6kJ', val, 'user_unrv8F0p0XFdSIvWfq6GF')
    .then((result) => {
      Router.push('/home')
    }, (error) => {   
      console.log(error)
    });
   
  }).catch(err=>{
   this.setState({active:false})
    alert("failed")
  })
}
render(){  
      let role= localStorage.getItem('role');
     let {visible,active,diamond}= this.state
     let {name,weight,clarity,logistic,consumer,producer,accepted,shipped,delivered} =diamond
     let value = delivered?"Delivered":shipped?"Shipped to consumer":accepted?"Accepted By logistic":"Supplier"
     return(  <>
    {!visible&& <>  
        <Header as='h3' textAlign='center' style={{ fontSize: '30px', paddingTop:'30px'}}>
         Diamond Details
        </Header> 
      <Table celled striped>
    <Table.Body >
      <Table.Row>
        <Table.Cell width={5}>
          Diamond Name
        </Table.Cell>
        <Table.Cell   width={10} textAlign='center' >{name}</Table.Cell>
        
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          Weight
        </Table.Cell>
        <Table.Cell textAlign='center'>{weight}</Table.Cell>
        
      </Table.Row>
      <Table.Row>
        <Table.Cell>
        Clarity
        </Table.Cell>
        <Table.Cell textAlign='center'>{clarity}</Table.Cell>
      
      </Table.Row>
      <Table.Row>
        <Table.Cell>
        Logistics
        </Table.Cell>
        <Table.Cell textAlign='center'>{logistic}</Table.Cell>
        
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          Consumer
        </Table.Cell>
        <Table.Cell textAlign='center'>{consumer}</Table.Cell>
    
      </Table.Row>
      <Table.Row>
        <Table.Cell>
          Producer
        </Table.Cell>
        <Table.Cell textAlign='center'>{producer}</Table.Cell>
    
      </Table.Row>

       {!delivered&&<Table.Row  negative>
        <Table.Cell>
        Status
        </Table.Cell>
        <Table.Cell textAlign='center'>{value}</Table.Cell>
      </Table.Row>}
      {delivered&&<Table.Row  positive>
        <Table.Cell>
        Status
        </Table.Cell>
        <Table.Cell textAlign='center'>{value}</Table.Cell>
      </Table.Row>}
      
    </Table.Body>
  </Table>
  <Container textAlign='center'>
    {!accepted && role==="logistic"&&
    <Button onClick={this.onAccept} secondary style={{marginRight:'20px', marginTop:'20px'}}>
       Accept Shipment
    </Button>}
    {accepted && !shipped&& role==="logistic"&&
    <Button  onClick={this.onShipped} secondary style={{marginRight:'20px', marginTop:'20px'}}>
       Ship to Consumer
    </Button>}
    {!delivered && role==="retailer"&&shipped &&
    <Button  onClick={this.onDelivery} secondary style={{marginRight:'20px', marginTop:'20px'}}>
      Accept Delivery
    </Button>}<a href="/home" style={{ color:'#fff'}}>
     <Button
      secondary
      style={{marginRight:'20px'}}>Back
    </Button></a></Container>
 </>}
              
<Dimmer  active={active} >
        <Loader inverted content='Loading wait for 10-30sec' />
      </Dimmer>
</>
    );
   }
}

     
export default DiamondTable