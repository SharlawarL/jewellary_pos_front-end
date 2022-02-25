import React,{ Component } from 'react'
import {  Button,TextField } from '@material-ui/core';
import {   Link   } from "react-router-dom";


import Select from 'react-select'
//css
import '../../../assets/css/style.css';

//pages
import Menu from '../../common/menu'
import Footer from '../../common/footer'


import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import 'primeflex/primeflex.css';

//json
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { Redirect } from 'react-router-dom';


//service 
import UserService from '../../../service/user/userService'

//object of services
const userService = new UserService();

export default class stockComponent extends Component {

    constructor(props){
        super(props)
        this.state ={
            loggedIn : props.loggedIn,
            userData : {},
            success : false,
            branchname: {},
            selectedBranch: {},
            role:'',
            username : '',
            password:'',
            cpassword:'',
            errors: {},
            branch : [],
            userlevel :[
                { name: 'Administrator', code: 'Administrator' },
                { name: 'User', code: 'User' }
            ],
        }

        this.getTotalBranch();

        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)

      }

      onChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    getTotalBranch()
    {
        let data = {username : localStorage.getItem("username")}

        userService.getTotalBranch(data).then((response) =>{
            if(response['data']['status'] ===1)
            {
                this.setState({
                    branch : response['data']['data']
                })
            } 
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    }


      submitForm(e){
        e.preventDefault()

        if(this.validate()){
        const { branchname , role, username, password } = this.state

        let data = {login_user : localStorage.getItem("username"), branchname : branchname.code , role:role.code, username: username, password: password}

        userService.saveUser(data).then((response) =>{
            if(response['data']['status'] ===1)
            {
                toast.success(response['data']['message']);
                NotificationManager.success('Success message', response['data']['message']);
                this.setState({
                    success: true,
                });
            } else {
                toast.error(response['data']['message']);
                let errors = {};
                errors["username"] = response['data']['message']
                this.setState({
                    loggedIn: false,
                    errors: errors
                });
            }
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
        }
    }


    validate(){
        let branchname = this.state.branchname;
        let role = this.state.role;
        let username = this.state.username;
        let password = this.state.password;
        let cpassword = this.state.cpassword;
        let errors = {};
        let isValid = true;
    
        if (!branchname) {
            isValid = false;
            errors["branchname"] = "Please select branch.";
        }
        
        if (!role) {
            isValid = false;
            errors["role"] = "Please select role.";
        }
          
        if (!username) {
          isValid = false;
          errors["username"] = "Please  enter your username.";
        }
    
        if (!password) {
          isValid = false;
          errors["password"] = "Please enter your password.";
        }
    
        if (!cpassword) {
          isValid = false;
          errors["cpassword"] = "Please enter your confirm password.";
        }
    
        if (typeof password !== "undefined" && typeof cpassword !== "undefined") {
            
          if (password !== cpassword) {
            isValid = false;
            errors["password"] = "Passwords don't match.";
          }
        } 
    
        this.setState({
          errors: errors
        });
    
        return isValid;
    }

    handleChangeBranchname = (newValue) => {
        this.setState({
            branchname : newValue.value
        })
    };

    handleChangeRole = (newValue) => {
        console.log(newValue)
        this.setState({
            role : newValue.value
        })
    };

    clearForm = () => {
        this.setState({
            branchname:'',
            selectedBranch:'',
            role:'',
            username : '',
            password:'',
            cpassword:'',
        })
    }

    render(){

        const fontLebel ={padding:'10px 0px 10px', fontSize:'13px'}

        if(this.state.success)
        {
            return <Redirect to='/user-list'></Redirect>
        }

        this.state.branch.map((data) =>{
            return( data['name'] = data['branch'], data['code'] = data['branch'])
        })

        console.log(this.state.branch)
        return(
            <div className="body">
                <ToastContainer />
                <NotificationContainer/>
                <Menu loggedIn = { this.state.loggedIn} />
                <form onSubmit={this.submitForm} autoComplete="off">
                <div className="button_box_small_title">
                    <h3 className="pageTitle">User Master </h3>
                </div>

                <div className="continerSmallBox">
                    
                                <div className="p-grid">
                                    <div className="p-col-12">
                                        <div style={fontLebel}>Branch Name</div>
                                        <Dropdown style={{width:'100%'}} value={this.state.branchname} options={this.state.branch} onChange={this.handleChangeBranchname} optionLabel="name" placeholder="Select Branch" />
                                        <div className="textDanger">{this.state.errors.branchname}</div>
                                    </div>
                                </div>
                                {/* <div className="reactSelect">
                                {this.state.branchname?'Select Branch':''}
                                    <Select className="selectClass" placeholder={<div>Select Branch Name</div>}  onChange={this.handleChangeBranchname} options={this.state.branch} />
                                    <div className="textDanger">{this.state.errors.branchname}</div>
                                </div> */}

                                <div className="p-grid">
                                    <div className="p-col-12">
                                        <div style={fontLebel}>User Level</div>
                                        <Dropdown style={{width:'100%'}} value={this.state.role} options={this.state.userlevel} onChange={this.handleChangeRole} optionLabel="name" placeholder="Select User Level" />
                                        <div className="textDanger">{this.state.errors.role}</div>
                                    </div>
                                </div>

                                {/* <div className="reactSelect">
                                {this.state.role?'Select User Level':''}
                                    <Select className="selectClass" placeholder={<div>Select User Level</div>}  onChange={this.handleChangeRole} options={this.state.userLevel} />
                                    <div className="textDanger">{this.state.errors.role}</div>
                                </div>  */}

                                <div className="p-grid">
                                    <div className="p-col-12">
                                        <div style={fontLebel}>User Name</div>
                                        <InputText id="username1" placeholder="Enter User Name" aria-describedby="username1-help" style={{width:'100%'}} name="username" value={this.state.username} onChange={this.onChange}/>
                                        <div className="textDanger">{this.state.errors.username}</div>
                                    </div>
                                </div>

                                <div className="p-grid">
                                    <div className="p-col-12">
                                        <div style={fontLebel}>Password</div>
                                        <InputText id="username1" placeholder="Enter Password" aria-describedby="username1-help" style={{width:'100%'}} name="password" value={this.state.password} onChange={this.onChange}/>
                                        <div className="textDanger">{this.state.errors.password}</div>
                                    </div>
                                </div>

                                <div className="p-grid">
                                    <div className="p-col-12">
                                        <div style={fontLebel}>Confirm Password</div>
                                        <InputText id="username1" placeholder="Enter Confirm Password" aria-describedby="username1-help" style={{width:'100%'}} name="cpassword" value={this.state.cpassword} onChange={this.onChange}/>
                                        <div className="textDanger">{this.state.errors.cpassword}</div>
                                    </div>
                                </div>
                        
 
                    
                </div>
                <div className="button_box_small">
                            <div className="row">
                                    <div className="col-6">
                                        <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                            <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">S</span>ave</div>
                                        </Button>
                                        
                                    </div>
                                    <div className="col-1"></div>
                                    <div className="col-6">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.clearForm}>
                                            <div className="buttonText"> <i className="pi pi-trash"></i> <span className="buttonTextFirstLetter">C</span>lear</div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            </form>
                <Footer />
            </div>
        )
    }
}