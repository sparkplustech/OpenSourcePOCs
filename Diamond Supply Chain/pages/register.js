import React, { Component } from 'react';
import Layout from '../components/Layout';
import Footer from '../components/Footer';
import { Segment,Header,Form,Button,Loader,Grid,Dimmer,Message} from 'semantic-ui-react';
import cinstance from '../src/cinstance';
import Router from 'next/router'

class Register extends Component {
 constructor(props){
        super(props);
        this.state = {
            fname:"",
            email: "",
            password:"",
            error:'',
            type: '',
            active:false
        }
    }
    
    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    
   OnSubmit =async()=>{
     const {fname,email,password,type} = this.state 
     if(fname&&email.length>4&&password&&type){
      await this.setState({active:true})
    let  count = await cinstance.methods.userCount().call()
    for(let i=1;i<=count;i++){
      let result= await cinstance.methods.user(i).call()
      if(result.name===fname){
        await this.setState({active:false})
        alert("user exists ")
      }
      else{
        cinstance.methods.createUser(fname,email,password,type).send({from:process.env.account})
        .then((res)=>{
          Router.push('/login')
        }).catch(err=>{
         this.setState({active:false})
          alert("failed")
        })
      }
    }
   
    }else{
      await this.setState({active:false})
      alert("field can not be empty")
    }
   }

    render(){
        const {fname,email, password,active} = this.state; 
         return(
   <div>
       <Layout/>    
   <div>
    
        
        <Header as='h3' textAlign='center' style={{ fontSize: '45px', paddingTop:'28px' }}>
           Register
            </Header>
              <Grid textAlign='center' verticalAlign='middle' style={{ paddingBottom:'80px'}}>
              <Grid.Column style={{ maxWidth: 450 }}>
            <Form >
            <Segment>
               <Form.Field>
               {/* <label>Full Name</label> */}
               <div className="field" style={{ paddingBottom:'15px'}}>
                <input placeholder='Company Name'
                value={fname}
                onChange={this.handleChange}
                
                name="fname"
                required />
                </div>

                
                <div className="field"style={{ paddingBottom:'15px'}}>
                <input placeholder='Email ID' 
                value={email}
                onChange={this.handleChange}
                type="email"
                name="email"
                />
                </div>
                
                <div className="field" style={{ paddingBottom:'15px'}}>
                <Form.Select
                onChange={(e,{value})=>{this.setState({type:value})}}
                 placeholder='Type'
                 options={ [{value:"logistic" ,text: 'Logistic' },{value:"supplier" ,text: 'Supplier' },{value:"retailer" ,text: 'Retailer'}]}
                />
                 </div>   

                 <div className="field"style={{ paddingBottom:'15px'}}>
                <input placeholder='Password' 
                value={password}
                onChange={this.handleChange}
                type="password"
                name="password"
                required />
                </div> 
               </Form.Field>           

              <Button  color='teal'  type='submit'onClick={this.OnSubmit}  >Register</Button>
              </Segment>     
            
              <Message> Already Register?  <a href='/login'>Click here to login</a></Message>
              </Form>
        <Dimmer active={this.state.active} >
        <Loader inverted content='Loading wait for 10-30sec' />
      </Dimmer>
              </Grid.Column>
              
              </Grid>

  
         </div>
 
       
 
        <Footer s={{position:'absolute', width:'100%', height:'3.5rem',bottom: 0}}/>
          </div>

             );
            }
     }

export default Register
