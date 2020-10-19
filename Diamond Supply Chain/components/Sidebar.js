
import React, { Component } from 'react'
import { Menu, Container } from 'semantic-ui-react'

export default class MenuExampleInvertedVertical extends Component {
  state = { activeItem: 'dashboard' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <div>
      <Menu inverted vertical style={{width:250,height:700, float:'left',margin:'0px'}}>
      <Container>
        <Menu.Item
          name='dashboard'
          active={activeItem === 'dashboard'}
          onClick={this.handleItemClick}
          href="/home"
        />
        </Container>
      </Menu>
      </div>
    )
  }
}
