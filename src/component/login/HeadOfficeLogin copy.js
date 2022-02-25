import React,{ Component } from 'react'

//css
import '../../assets/css/login.css';

import {  Input, Button  } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import {   Link   } from "react-router-dom";

// import { GoogleLogin } from 'react-google-login';
import PasswordField from 'material-ui-password-field'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';


import Footer from '../common/footer'
//images
import Logo from '../../assets/img/companylogo.png'
import Vector from '../../assets/img/vector4.jpg'

//pages
import OfferPage from '../common/offerDialogBox';

//service 
import UserService from '../../service/user/userService'

//object of services
const userService = new UserService();

export default class Login extends Component {

    constructor(props){
        super(props)
        let loggedIn = false
        this.state ={
            Head_office_user : '',
            Head_office_user_password : '',
            loggedIn : loggedIn
        }

        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)
        this.responseGoogle = this.responseGoogle.bind(this)
    }

    onChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    submitForm(e){
        e.preventDefault()
        const { Head_office_user, Head_office_user_password } = this.state

        let data = {username : Head_office_user, password : Head_office_user_password}

        userService.adminLogin(data).then((response) =>{
            this.props.handleLogin({status:'UserLogIn',data:response['data']});
            if(response['data']['status'] == 1)
            {
                // alert("Hello")
                this.setState({
                    loggedIn: true,
                });
                toast.success(response['data']['message']);
                NotificationManager.success('Success message', response['data']['message']);
                localStorage.setItem("token",response['data']['data']['token'])
                localStorage.setItem("username", Head_office_user)
                localStorage.setItem("user", JSON.stringify(response['data']['data'][0]))
                localStorage.setItem("userlevel", JSON.stringify(response['data']['data'][0]['user_level']))
                localStorage.setItem("role", "Admin")
                localStorage.setItem("Branch", "Head Office")
                localStorage.setItem("Gold_rate",response['data']['data']['todays'][0]['price'])
                localStorage.setItem("purity",JSON.stringify(response['data']['data']['purity']))
                // return <Redirect to='/home'  />
            } else {
                toast.error(response['data']['message']);
                this.setState({
                    loggedIn: false,
                });
            }
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }


    responseGoogle(e){
        console.log(e);
    }

    
    render(){

        if(this.state.loggedIn)
        {
            return <Redirect to='/head-office-home'></Redirect>
        }

        const container = { overflow:'hidden' , overflowX: 'hidden', backgroundColor:'milk white'};
        // const googleButton = { backgroundColor:'rgb(230, 42, 42)',width:'100%',color:'white'};
        return (
        <div className="bodyLogin" style={container}>
            <ToastContainer />
            {/* <NotificationContainer/> */}
            <div className="circle1"></div>
            <div className="circle2"></div>
            <div className="circle3"></div>
            <div className="circle4"></div>
            <div className="circle5"></div>
            <OfferPage />
            
            <div className="Box">
                <div className="Box-left">
                    <h6 className="promoTitle">No.1 User Friendly ERP Solution </h6>
                    <h5 className="promoText">
                        Managing Your Business is Simpler, Smarter & Faster with Wonder
                        </h5>
                    <img src={Vector} alt="logo"  style={{marginTop:'20px'}} height="300px"/>
                </div>
                <div className="Box-right">
                    <form className="FormBox" onSubmit = {this.submitForm} autoComplete="off">
                        <div className="loginTitleBox">
                            <img alt="logo" src={Logo} height="70px"></img>
                            {/* <h4 className="loginTitle"> <AccountCircleOutlinedIcon style={{ fontSize:'30px', marginBottom:'-5px'}} />  Login</h4> */}
                        </div>
                        <div className="logiInputBox">
                            <div className="formInput">
                                <Input className="loginInputBox" placeholder="Username" hintText='Type anything' id="standard-basic" label="Head_office_user" name="Head_office_user" value={this.state.Head_office_user} onChange ={this.onChange} />
                            </div>
                            <div className="formInput">
                                {/* <TextField type="Head_office_user_password" secureTextEntry className="inputData" id="standard-basic" label="Head_office_user_password" name="Head_office_user_password" value={this.state.Head_office_user_password} onChange ={this.onChange} /> */}
                                <PasswordField className="loginInputBox"
                                    placeholder="Password"
                                    hintText="At least 8 characters"
                                    floatingLabelText="Enter your password"
                                    errorText="Your password is too short"
                                    id="standard-basic" label="Password" name="Head_office_user_password" value={this.state.Head_office_user_password} onChange ={this.onChange}
                                    />
                            </div>
                            <div className="formInput" style={{textAlign:'left'}}>
                                {/* <FormControlLabel
                                control={
                                    <Checkbox defaultChecked color="primary" inputProps={{ 'aria-label': 'secondary checkbox' }} />
                                }
                                label="Remember me"
                                >
                                </FormControlLabel> */}
                                
                            </div>
                            <div className="formInput">
                                <Button type="submit" className="inputData" variant="contained" color="primary">
                                <div className="buttonText"><span className="buttonTextFirstLetter">Head Office Login </span></div>
                                </Button>
                            </div>
                            <div className="formInput hoLogin">
                                <Button type="submit" className="inputData" variant="contained" color="primary">
                                    <Link to="/" className="Link" >
                                    <div className="buttonText"><span className="buttonTextFirstLetter" style={{color: 'white'}}>Back to Login </span></div>
                                    </Link>
                                </Button>
                            </div>
                            <div className="formInput">
                                {/* <Button className="login-provider-button" style={googleButton}>
                                    <span className="google">G</span>
                                    <span> &nbsp; Continue with Google</span>
                                </Button> */}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
  );
}
}