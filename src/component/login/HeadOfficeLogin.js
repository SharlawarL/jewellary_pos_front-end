import React, { Component } from 'react'

//css
import '../../assets/css/login.css';

import { Input, Button } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { Link } from "react-router-dom";

// import { GoogleLogin } from 'react-google-login';
import PasswordField from 'material-ui-password-field'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import Footer from '../common/footer';
//images
import Logo from '../../assets/img/companylogo.png';
import Vector from '../../assets/img/11.png';
 

//pages
import OfferPage from '../common/offerDialogBox';

//service 
import UserService from '../../service/user/userService'
import CompanyService from '../../service/company/companyService'

//object of services
const userService = new UserService();
const companyService = new CompanyService();


export default class Login extends Component {

    constructor(props) {
        super(props)
        let loggedIn = false
        this.state = {
            username: '',
            password: '',
            loggedIn: loggedIn,
        }
        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)
        this.responseGoogle = this.responseGoogle.bind(this)
    }

    componentDidMount() {
        this.getCompany();
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    getCompany() {
        let data = {
            compnay: 'name'
        }

        companyService.getCompany(data).then((response) => {
            if (response['data']['status'] === 1) {
                localStorage.setItem("shopName", response['data']['data'][0]['company'])
            }
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }

    submitForm(e) {
        e.preventDefault()
        const { username, password } = this.state

        let data = { username: username, password: password }

        userService.adminLogin(data).then((response) => {
            // this.props.handleLogin({ status: 'UserLogIn', data: response['data'] });
            console.log(response)
            if (response['data']['status'] === 1) {
                toast.success(response['data']['message']);
                NotificationManager.success('Success message', response['data']['message']);
                localStorage.setItem("token",response['data']['data']['token'])
                localStorage.setItem("username", username)
                localStorage.setItem("loginType", "HeadOffice")
                localStorage.setItem("user", JSON.stringify(response['data']['data'][0]))
                localStorage.setItem("userlevel", "Admin")
                localStorage.setItem("role", "Admin")
                localStorage.setItem("Branch", "Head Office")
                localStorage.setItem("Gold_rate", response['data']['data']['todays'][0]['price']?response['data']['data']['todays'][0]['price']:0)
                localStorage.setItem("purity", JSON.stringify(response['data']['data']['purity']))
                this.setState({
                    loggedIn: true,
                });
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


    responseGoogle(e) {
        console.log(e);
    }


    render() {

        if (this.state.loggedIn) {
            return <Redirect to='/home'></Redirect>
        }

        const container = { overflow: 'hidden', overflowX: 'hidden', backgroundColor: 'milk white' };
        // const googleButton = { backgroundColor:'rgb(230, 42, 42)',width:'100%',color:'white'};
        return (
            <div className="bodyLogin" style={container}>
                <ToastContainer />
                <NotificationContainer />
                <div className="circle1"></div>
                <div className="circle2"></div>
                <div className="circle3"></div>
                <div className="circle4"></div>
                <div className="circle5"></div>
                {/* <OfferPage /> */}

                <div className="Box">
                    <div className="Box-left">
                        <h6 className="promoTitle">No.1 User Friendly ERP Solution </h6>
                        <h5 className="promoText">Managing Your Bussiness is Simpler, Smarter & Faster with Wonder POS Prime</h5>
                        <img src={Vector} alt="logo" style={{ marginTop: '20px' }} height="350px"  />
                    </div>
                    <div className="Box-right">
                        <form className="FormBox" onSubmit={this.submitForm} autoComplete="off">
                            <div className="loginTitleBox">
                                <img alt="images" src={Logo} height="70px"></img>
                                {/* <h4 className="loginTitle"> <AccountCircleOutlinedIcon style={{ fontSize:'30px', marginBottom:'-5px'}} />  Login</h4> */}
                            </div>
                            <div className="logiInputBox">
                                <div className="formInput">
                                    <Input className="loginInputBox" style={{border:'none', padding:'5px 20px', borderRadius:'20px',backgroundColor:'rgba(245, 236, 235,0.5)'}}
                                     placeholder="Username" hintText='Type anything' id="standard-basic" label="Username" name="username" value={this.state.username} onChange={this.onChange} />
                                </div>
                                <div className="formInput">
                                    {/* <TextField type="password" secureTextEntry className="inputData" id="standard-basic" label="Password" name="password" value={this.state.password} onChange ={this.onChange} /> */}
                                    <PasswordField className="loginInputBox"
                                        style={{border:'none', padding:'5px 20px', borderRadius:'20px',backgroundColor:'rgba(245, 236, 235,0.5)'}}
                                        placeholder="Password"
                                        hintText="At least 8 characters"
                                        floatingLabelText="Enter your password"
                                        errorText="Your password is too short"
                                        id="standard-basic" label="Password" name="password" value={this.state.password} onChange={this.onChange}
                                    />
                                </div>
                                <div className="formInput" style={{ textAlign: 'left' }}>
                                    {/* <FormControlLabel
                                control={
                                    <Checkbox defaultChecked color="primary" inputProps={{ 'aria-label': 'secondary checkbox' }} />
                                }
                                label="Remember me"
                                >
                                </FormControlLabel> */}

                                </div>
                                {/* <div className="formInput">
                                    <Button type="submit" className="inputData" variant="contained" color="primary">
                                        <div className="buttonText"> <span className="buttonTextFirstLetter">L</span>ogin</div>
                                    </Button>
                                </div>
                                <div className="formInput hoLogin">
                                    <Button className="inputData" variant="contained" color="primary">
                                        <Link to="/headOfficeLogin" className="Link" >
                                            <div className="buttonText"><span className="buttonTextFirstLetter" style={{color: 'white'}}>Head Office Login </span></div>
                                        </Link>
                                    </Button>
                                </div> */}
                                <div className="formInput">
                                    <Button type="submit" className="inputData buttonPrimaryLogin" variant="contained" color="primary">
                                        <div className="buttonText" style={{ color: 'white', fontWeight:'300' }}>
                                            <span style={{textTransform:'uppercase'}}>H</span>ead <span style={{textTransform:'uppercase'}}>O</span>ffice <span style={{textTransform:'uppercase'}}>L</span>ogin 
                                        </div>
                                    </Button>
                                </div>
                                <div className="formInput hoLogin">
                                    <Button className="inputData buttonSecondaryLogin" variant="contained" color="primary">
                                        <Link to="/" className="Link" >
                                            <div className="buttonText"style={{ color: 'black', fontWeight:'300' }}><span style={{textTransform:'uppercase'}}>B</span>ack <span style={{textTransform:'uppercase'}}>T</span>o <span style={{textTransform:'uppercase'}}>L</span>ogin </div>
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