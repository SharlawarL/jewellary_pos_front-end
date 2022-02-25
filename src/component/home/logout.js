import React,{ Component } from 'react'
//pages
import { Redirect } from 'react-router-dom';

export default class salesComponent extends Component {

    constructor(props){
        super(props)
        this.state ={
            loggedIn : true,
            userData : {}
        }
        props.handleLogin({status:'LogOut',data: {}});
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        localStorage.removeItem("Branch")
      }

    render(){
        // alert(this.state.token)
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        localStorage.removeItem("Branch")

        // window.location.reload();

        if(!localStorage.getItem("token"))
        {
            return <Redirect to='/'></Redirect>
        }

        return(
            <div>
                <h3 className="pageTitle">Logout</h3>
            </div>
        )
    }
}