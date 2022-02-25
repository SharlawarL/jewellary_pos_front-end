import React, { Component } from 'react'

import '../../assets/css/style.css';
//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import StockData from './stockData.jsx'

//service 
import UserService from '../../service/user/userService'

//object of services
const userService = new UserService();

export default class stockComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: {},
            open: false
        }
    }


    render() {

        return (
            <div className="body">
                <Menu loggedIn={this.state.loggedIn} />
                <div className="continerBigMediumBox">

                    <StockData />

                </div>
                <Footer />
            </div>
        )
    }
}