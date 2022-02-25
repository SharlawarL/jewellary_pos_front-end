import React,{ Component } from 'react'
import '../../../assets/css/style.css';
import {  Input, Button   } from '@material-ui/core';
import {   Link   } from "react-router-dom";
//pages
import Menu from '../../common/menu'
import Footer from '../../common/footer'

import { InputText } from 'primereact/inputtext';
import 'primeflex/primeflex.css';
import { Loading  } from "react-loading-ui";
//json
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';
import { Toast } from 'primereact/toast';

//service 
import UserService from '../../../service/user/userService'
const userService = new UserService();

export default class stockComponent extends Component {

    constructor(props){
        super(props)
        this.state ={
            loggedIn : props.loggedIn,
            userData : {},
            success : false,
            username: props.location.state['username'],
            branch: props.location.state['branch'],
            password: props.location.state['password'],
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

          Loading();
        e.preventDefault()
        const { username, branch, password } = this.state

        let data = {
            login_user : localStorage.getItem("username"), 
            username    : username ,
            branch      : branch, 
            password    : password
        }

        userService.updateUser(data).then((response) =>{
            Loading();
            if(response['data']['status'] === 1)
            {
                this.toast.show({severity:'success', summary: 'Updated', detail: response['data']['message'], life: 3000});
                // toast.success(response['data']['message']);
                setTimeout(
                    this.setState({
                        success: true,
                    })
                , 5000);
            } else {
                // toast.error(response['data']['message']);
                this.toast.show({severity:'error', summary: 'Updated', detail: response['data']['message'], life: 3000});
                this.setState({
                    loggedIn: false,
                });
            }
      }).catch((error) => {
            console.log(error);
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    }

    clearForm = () =>{
        this.setState({
            branchname:'',
        })
    }

    render(){

        const fontLebel ={padding:'10px 0px 10px', fontSize:'13px'}

        if(this.state.success)
        {
            return <Redirect to='/user-list'></Redirect>
        }

        return(
            <div className="body">
                <Toast ref={(el) => this.toast = el} />
                <Menu loggedIn = { this.state.loggedIn} />

                <form onSubmit = {this.submitForm} autoComplete="off"> 
                
                <div className="button_box_small_title">
                    <h3 className="pageTitle">Update User</h3>
                </div>

                <div className="continerSmallBox">
                        
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Branch Name</div>
                                <InputText id="username1" placeholder="Enter Branch Name" aria-describedby="username1-help" style={{width:'100%'}} name="branch" value={this.state.branch} onChange={this.onChange} disabled/>
                                <div className="textDanger">{this.state.error}</div>
                            </div>
                        </div>
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>User Name</div>
                                <InputText id="username1" placeholder="Enter User Name" aria-describedby="username1-help" style={{width:'100%'}} name="username" value={this.state.username} onChange={this.onChange} disabled/>
                                <div className="textDanger">{this.state.error}</div>
                            </div>
                        </div>
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Password</div>
                                <InputText id="username1" placeholder="Enter Password" aria-describedby="username1-help" style={{width:'100%'}} name="password" value={this.state.password} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.error}</div>
                            </div>
                        </div>
                    
                </div>
                <div className="button_box_small">
                            <div className="row">
                                    <div className="col-6">
                                        <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                            <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">U</span>pdate</div>
                                        </Button>
                                        
                                    </div>
                                    <div className="col-1"></div>
                                    <div className="col-6">
                                        <Link to="/user-list" className="Link">
                                            <Button className="inputData buttonSecondary" variant="contained" onClick={this.clearForm}>
                                                <div className="buttonText"> <i className="pi pi-angle-double-left"></i> <span className="buttonTextFirstLetter">B</span>ack</div>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                </form>
                <Footer />
            </div>
        )
    }
}