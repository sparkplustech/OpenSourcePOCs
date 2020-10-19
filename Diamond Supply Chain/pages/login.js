import React, { Component } from 'react';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import cinstance from '../src/cinstance';
import Router from 'next/router'
import { Segment,Header,Form,Button,Dimmer,Grid,Loader,Message} from 'semantic-ui-react';

class Login extends Component {
   
    constructor(props){
        super(props);
        this.state = {
            email: "",
            password:"",
            error:'',
            active:false
        };
    }
    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
   OnSubmit =async()=>{
   let {email,password} =this.state
   localStorage.setItem('email',email)
  await this.setState({active:true})
  if(email.length>0 && password.length>0){
     const result = await cinstance.methods.users(email).call() 
     if(result.email===email && result.password===password){
      localStorage.setItem('role',result.role)
      localStorage.setItem('Authorised',true)
      localStorage.setItem('name',result.name)
       Router.push('/home')
    } else{
      await this.setState({active:false})
      alert("failed")
    }}
    else{
      await this.setState({active:false})
      alert("failed")
    }
   }

    render(){  
           const {email, password} = this.state; 
        return( 
   <div style={{flex:1}}>
       <Layout/>
        
        <Header as='h3' textAlign='center' style={{ fontSize: '45px' ,paddingTop:'28px'}}>
          Login
            </Header>
              <Grid textAlign='center' verticalAlign='middle' style={{ paddingBottom:'100px'}}>
              <Grid.Column style={{ maxWidth: 450 }}>
            <Form >
            <Segment>
               <Form.Field>
              
                
                <div className="field"style={{ paddingBottom:'15px'}}>
                <input placeholder='Email ID' value={email}
                onChange={this.handleChange}
                type="email"
                name="email"
                />
                </div>
                
                <div className="field"style={{ paddingBottom:'15px'}}>
                <input placeholder='Password' type="password" name="password"
                value={password}
                onChange={this.handleChange}
                required />
                </div> 
               </Form.Field>
               <Button  color='teal'  type='submit' onClick={this.OnSubmit} > Login</Button>

              </Segment>
              <Message> Not Register?  <a href='/register'>Click here to Register</a></Message>
              </Form>
       
              </Grid.Column>
              </Grid>

              <Dimmer active={this.state.active} >
        <Loader inverted content='Loading' />
      </Dimmer>
        <Footer s={{position:'absolute', width:'100%', height:'3.5rem',bottom: 0}}/>
          </div>
 
             );
            }
     }

export default Login
