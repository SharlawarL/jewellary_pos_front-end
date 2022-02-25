import React,{ Component } from 'react'
import '../../assets/css/style.css';
//pages
import Menu from '../common/menu'
import Footer from '../common/footer'

export default class salesComponent extends Component {

    constructor(props){
        super(props)
        this.state ={
            loggedIn : props.loggedIn,
            userData : {}
        }
      }

    render(){
        return(
            <div className="body">
                <Menu loggedIn = { this.state.loggedIn} />
                <div className="continerBoxHeight">
                    <h3 className="pageTitle">Sales</h3>
                </div>
                <Footer />
            </div>
        )
    }
}