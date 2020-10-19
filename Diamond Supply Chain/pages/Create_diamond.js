import React, { Component } from 'react';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import { Segment,Header,Form,Button,Grid , Dimmer, Loader} from 'semantic-ui-react';
import Sidebar from '../components/Sidebar';
import cinstance from '../src/cinstance';
import Home from './home';
import { Router } from 'next/router';
var localStorage = require('localStorage')
class CreateDiamond extends Component {
            constructor(props){
        super(props);
        let name= localStorage.getItem('name');
        this.state = {
            diamondname:"",
            weight: "",
            clarity:"",
            producer:name,
            error:'',
            logistic:'',
            consumer: '',
            active:false,
            Logistic:[],
            Consumers:[]
         };
    }
    async componentDidMount(){
      let role= localStorage.getItem('role');
        let login= localStorage.getItem('Authorised');
     //   await this.setState({active:true})
        if(role==="supplier"&& login==="true"){
      let count = await cinstance.methods.userCount().call()
      for(let i=1;i<=count;i++){
          let result= await cinstance.methods.user(i).call()
          if(result.role==="logistic"){
           await this.setState({Logistic:[...this.state.Logistic,{value:result.name,text:result.name}]})
           }
          if(result.role==="retailer"){
            await this.setState({Consumers:[...this.state.Consumers,{value:result.name,text:result.name}]})
           }
      }await this.setState({active:false})
    }
      await this.setState({active:false})
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

   OnSubmit = async ()=>{
     const {diamondname,weight,clarity,logistic,consumer,producer} = this.state
     if(diamondname&&weight&&clarity&&logistic&&consumer&&producer){
    await this.setState({active:true})
  await  cinstance.methods.createDiamond(diamondname,weight,clarity,logistic,consumer,producer).send({from:process.env.account}) 
      Router.push('/home')

    }else{
      alert("Some fields can not be empty")
      await this.setState({active:false})
    }
   }

    render(){  
        const {diamondname,weight, clarity,producer ,Logistic,Consumers} = this.state;   
        let role= localStorage.getItem('role');
        let login= localStorage.getItem('Authorised');
        return( 
          role==="supplier"&& login==="true"? <>
       <Layout/>    
         <Header as='h3' textAlign='center' style={{ fontSize: '30px' }}>
         Create a Diamond
            </Header>
              <Grid textAlign='center' verticalAlign='middle' style={{ marginBottom:'20px'}}>
              <Grid.Column style={{ maxWidth: 450 }}>
            <Form >
            <Segment>
               <Form.Field>
               {/* <label>Full Name</label> */}
               <div className="field" style={{ textAlign:'left'}}>
               <label >Diamond Name  </label>
               <input placeholder='Diamond Name' 
                value={diamondname}
                onChange={this.handleChange}
                name="diamondname"
               required />
              
                </div>
                
                <div className="field"style={{ textAlign:'left'}}>
                <label >Weight </label>
               <input placeholder='weight' 
                value={weight}
                type="number"
                onChange={this.handleChange}
                name="weight"
               required />
              
                </div>
                
                <div className="field"style={{ textAlign:'left'}}>
                <label >Clarity</label>
               <input placeholder='Clarity' 
                value={clarity}
                type="number"
                onChange={this.handleChange}
                name="clarity"
               required />
              
                </div>
                
                <div className="field"style={{  textAlign:'left'}}>
                <label >Logistics</label>
                <Form.Select
                onChange={(e,{value})=>{this.setState({logistic:value})}}
                 placeholder='Logistics'
                 options={Logistic}
                />
                </div>

                <div className="field"style={{  textAlign:'left'}}>
                <label>Consumer</label>
                <Form.Select
                onChange={(e,{value})=>{this.setState({consumer:value})}}
                 placeholder='Consumer'
                 options={Consumers }
                />
                </div>
                <div className="field"style={{ textAlign:'left'}}>
                <label >Supplier</label> 
                <input placeholder='producer' 
               value={producer}
            onChange={this.handleChange}
               name="producer"
               readonly="" /> 
              
                </div>
               </Form.Field>
              <Button  color='teal'  type='submit' onClick={this.OnSubmit} >Create Diamond</Button>
              </Segment>
             
              </Form>
              <Dimmer active={this.state.active} >
        <Loader inverted content='Loading' />
      </Dimmer>
              </Grid.Column>
              </Grid>

      
        <Footer  s={{ width:'100%', height:'3.5rem',bottom: 0}}/>
          </>:<Home/>
 
             );
            }
     }

export default CreateDiamond
