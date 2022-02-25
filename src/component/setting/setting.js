import React,{ Component } from 'react'
import '../../assets/css/style.css';
import { Button, TextField } from '@material-ui/core';
import {   Link   } from "react-router-dom";
// import Button from 'react-bootstrap-button-loader';

//pages
import Menu from '../common/menu'
import Footer from '../common/footer'

import axios from 'axios';

//notification
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class stockComponent extends Component {
    constructor(props){
        super(props)
        this.state ={
            loggedIn : props.loggedIn,
            userData : {},
            username: '',
            password: '',
            oldPassword: '',
            cpassword:''
        }

        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)
      }

    onChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    submitForm(e){
        e.preventDefault()
        const { newUsername, password, oldPassword } = this.state

        axios.post('http://demo.lalitsharlawar.com/api/', 
        {
            username: localStorage.getItem('username'), 
            newUsername: newUsername, 
            password : password, 
            oldPassword : oldPassword},
        {
            headers: { 
                Action : 'Profile', 
                Module: 'update-account' ,
                token : localStorage.getItem('token'),
                'Access-Control-Allow-Origin':'*'
            },
        }
        )
          .then((response) => {
              console.log(response);
              if(response['data']['status']===1)
              {
                toast.success(response['data']['message']);
                // localStorage.setItem("shop", JSON.stringify(response['data']['data']))
                localStorage.setItem("shopName", response['data']['data'][0]['shopname'])
                localStorage.setItem("shopCity", response['data']['data'][0]['city'])
                this.setState({
                    loggedIn: true,
                });
              } else {
                toast.error(response['data']['message']);
                this.setState({
                    loggedIn: false,
                });
              }
            
          }, (error) => {
            toast.warn(error);
            this.setState({
                loggedIn: false,
            });
          });
    }

    render(){
        return(
            <div className="body">
                <Menu loggedIn = { this.state.loggedIn} />
                <ToastContainer />
                <div className="continerSmallBox">
                    <h3 className="pageTitle">My Account Settings</h3>
                        <form onSubmit = {this.submitForm}> 
                            <div className="form-field">
                                <TextField className="inputDataBox" style={{color: 'black !important'}} id="standard-basic" label="Username" name="username" value={this.state.newUsername} onChange ={this.onChange} />
                            </div>
                            <div className="form-field">
                                <TextField className="inputDataBox" style={{color: 'black !important'}} id="standard-basic" label="Password" name="password" value={this.state.password} onChange ={this.onChange} />
                            </div>
                            <div className="form-field">
                                <TextField className="inputDataBox" style={{color: 'black !important'}} id="standard-basic" label="Confirm Password" name="cpassword" value={this.state.cpassword} onChange ={this.onChange} />
                            </div>
                            <div className="form-field">
                            <div className="row">
                                <div className="col-6">
                                    <Link to="/branchmaster" className="Link">
                                        <Button type="submit" className="inputData buttonSecondary" variant="contained">
                                            <div className="buttonText"> <span className="buttonTextFirstLetter">B</span>ack</div>
                                        </Button>
                                    </Link>
                                </div>
                                <div className="col-6">
                                    <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                        <div className="buttonText"> <span className="buttonTextFirstLetter">S</span>ave</div>
                                    </Button>
                                </div>
                            </div>
                        </div>
                        </form>
                    </div>
                <Footer />
            </div>
        )
    }
}