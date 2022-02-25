import React,{ Component } from 'react'
import '../../../assets/css/style.css';
import {  Input, Button   } from '@material-ui/core';
import {   Link   } from "react-router-dom";
//pages
import Menu from '../../common/menu'
import Footer from '../../common/footer'


//json
import Init from '../../../config/Inint.json'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { Redirect } from 'react-router-dom';

export default class stockComponent extends Component {

    constructor(props){
        super(props)
        this.state ={
            loggedIn : props.loggedIn,
            userData : {},
            success : false,
            branchname: props.location.state['branch'],
            branch: props.branch,
            id: props.location.state['id']
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
        const { branchname } = this.state


        axios.post(apiUrl, 
        {username : localStorage.getItem("username"), branchname : branchname , id :this.state.id},
        {
            headers: { Action : 'Company', Module: 'update-branch' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        )
          .then((response) => {
              if(response['data']['status'] ==1)
              {
                toast.success(response['data']['message']);
                NotificationManager.success('Success message', response['data']['message']);
                this.setState({
                    success: true,
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

        if(this.state.success)
        {
            return <Redirect to='/branchmaster'></Redirect>
        }

        return(
            <div className="body">
                <Menu loggedIn = { this.state.loggedIn} />
                <div className="continerSmallBox">
                    <h3 className="pageTitle">Update Branch</h3>
                    <form onSubmit = {this.submitForm}> 
                        <Input className="InputBox" placeholder="Enter Branch Name" name="branchname" id="branchname" value={this.state.branchname} onChange ={this.onChange}  />
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
                                    <div className="buttonText"> <span className="buttonTextFirstLetter">U</span>pdate</div>
                                </Button>
                            </div>
                        </div>
                        
                        
                    </form>
                </div>
                <Footer />
            </div>
        )
    }
}