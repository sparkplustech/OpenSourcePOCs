import Router from 'next/router'
import {Image, Container ,Button,Header,Menu,Label,Icon} from 'semantic-ui-react'
var localStorage = require('localStorage')

export default class Layout extends React.Component {
  logout=()=>{
    Router.push('/login')
    localStorage.clear();
  
     
   
  }
  render() {
    let  auth = localStorage.getItem('Authorised');
    let  name = localStorage.getItem('name');
    let  role = localStorage.getItem('role');
    return (<>
  
           <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
        <Menu inverted style={{margin:'0px'}} >
        <Container>
        <Menu.Item as='a' href='/' header>
        <Header inverted > <Image src='/static/img/1.png' size='mini'/> 
                Diamond Supply Chain</Header> 
            </Menu.Item>
            <Menu.Menu position='right'>
            
       { auth==='true' && <Menu.Item>
       <Label as='a' color='black'  style={{marginTop:'5px',fontSize:'14px'}}>
            <Icon name='user outline' size='large'/>{name}  ({role})
    </Label>
            <Button onClick={this.logout} secondary>Log out</Button>
          </Menu.Item>}
        </Menu.Menu>
        </Container>
        </Menu>
 


           
       
     </>
    );
  }
}