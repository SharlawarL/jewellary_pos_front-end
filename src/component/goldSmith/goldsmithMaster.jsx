import React, { Component } from 'react'
import '../../assets/css/style.css';
import { TextField, Button } from '@material-ui/core';
import { Link } from "react-router-dom";
import Select from 'react-select'
import { Dialog } from 'primereact/dialog';
import PrintIcon from '@material-ui/icons/Print';
//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import 'primeflex/primeflex.css';
import { Toast } from 'primereact/toast';

import { Calendar } from 'primereact/calendar';

// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Redirect } from 'react-router-dom';

import { apiUrl } from '../../config/inint';
//service 
import GoldsmithService from '../../service/goldsmith/goldsmithService'

//object of services
const goldsmithService     = new GoldsmithService();

export default class orderEntryComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            success: false,
            
            name : '',
            errors : {}
        }
        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }



   

    submitForm(e) {
        e.preventDefault()

        if (this.validate()) {

        const {
            name,
        } = this.state

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            name : name,
        }


        goldsmithService.saveMaster(data).then((response) => {
            if (response['data']['status'] === 1) {
                
                this.toast.show({ severity: 'success', summary: 'Message', detail: response['data']['message'], life: 3000 });
                

                this.clearForm();
            } else {
                this.toast.show({ severity: 'error', summary: 'Oops', detail: response['data']['message'], life: 3000 });
               
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }
    }


    validate() {
        let name = this.state.name;

        let errors = {};
        let isValid = true;

        if (!name) {
            isValid = false;
            errors["name"] = "Gold smith name required.";
        }

        this.setState({
            errors: errors
        });

        return isValid;
    }

    

    clearForm = () => {
        this.setState({
            name: '',
        })
    }


    render() {
        const fontLebel = { padding: '10px 0px 10px', fontSize: '13px' }

        return (
            <div className="body">
                <Toast ref={(el) => this.toast = el} />
                {/* <ToastContainer />
                <NotificationContainer /> */}
                <Menu loggedIn={this.state.loggedIn} />

                <form onSubmit={this.submitForm} autoComplete="off">
                    <div className="button_box_small_title">
                        <h3 className="pageTitle">GOLD Smith Master</h3>
                    </div>

                    <div className="continerSmallBox">

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Name</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Name" aria-describedby="username1-help" style={{ width: '100%' }} name="name" value={this.state.name} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.name}</div>
                                </div>
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