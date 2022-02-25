import React, { Component } from 'react'
import '../../assets/css/style.css';
//pages
import Menu from '../common/menu'
import Footer from '../common/footer'

import Img from '../../assets/img/underdev2.gif'

export default class salesComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: {}
        }
    }

    render() {
        return (
            <div className="body">
                <Menu loggedIn={this.state.loggedIn} />
                <div className="continerBoxHeight" style={{ textAlign: 'center' }}>
                    <img alt="under development" src={Img} style={{ height: '100%' }} />
                </div>
                <Footer />
            </div>
        )
    }
}