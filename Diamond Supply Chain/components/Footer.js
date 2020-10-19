import Link from 'next/link' 
import {Image, Segment, Container ,Icon,Header,Menu} from 'semantic-ui-react'

export default class Footer extends React.Component {
  render() {
   
    return (
      <div>
           <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />
  <Segment inverted vertical style={this.props.s}>
            <Container>
            <Container textAlign='center'>
            Designed By Sparkplus Technology     
            {/* <Link  href="">
             <Icon name='facebook' size='large'></Icon>
             </Link> */}
             <Link href="https://twitter.com/sparkplustech">
               <a>
            <Icon name='twitter' size='large'></Icon>
            </a>
            </Link>
            <Link href="https://in.linkedin.com/company/sparkplustech">
              <a>
            <Icon name='linkedin' size='large'></Icon>
            </a>
            </Link>
            </Container>    
            </Container>
        </Segment>
           
       
      </div>
    );
  }
}