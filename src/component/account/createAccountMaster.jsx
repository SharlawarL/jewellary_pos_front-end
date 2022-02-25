import React, { Component } from 'react'
import '../../assets/css/style.css';
import { TextField, Button } from '@material-ui/core';
import { Link } from "react-router-dom";
import Select from 'react-select'
import ReactHTMLDatalist from "react-html-datalist";
import DataListInput from "react-datalist-input";

//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import 'primeflex/primeflex.css';

// import { ToastContainer, toast } from 'react-toastify';
import { Toast } from 'primereact/toast';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Redirect } from 'react-router-dom';


//service 
import AccountService from '../../service/account/accountService'

//object of services
const accountService = new AccountService();

export default class stockComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: {},
            success: false,
            branchname: '',
            itemType: [
                { name: 'Primary Account', code: 'Primary Account' },
                { name: 'Current Assets', code: 'Current Assets' },
                { name: 'Fexed Assets', code: 'Fexed Assets' },
                { name: 'Liabilites', code: 'Liabilites' },
                { name: 'Current Liabilites', code: 'Current Liabilites' },
                { name: 'Capital Account', code: 'Capital Account' },
            ],
            errors: {},
            selecteditemType: '',
            account:''
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

            const {
                account,
                selecteditemType
            } = this.state

            let data = {
                login_user: localStorage.getItem("username"),
                branch: localStorage.getItem("Branch"),
                company: localStorage.getItem("shopName"),
                account: account?account:'',
                itemType: selecteditemType?selecteditemType.code:''
            }


            accountService.saveAccountMaster(data).then((response) => {
                if (response['data']['status'] === 1) {

                    this.toast.show({severity:'success', summary: 'Message', detail:response['data']['message'], life: 3000});
                    this.setState({
                        success: true,
                    });
                    this.clearForm();
                } else {
                    // toast.error(response['data']['message']);
                    this.toast.show({severity:'error', summary: 'Message', detail:response['data']['message'], life: 3000});
                    this.setState({
                        loggedIn: false,
                    });
                }
            }).catch((error) => {
                console.log(error)
            })
    }

    


    handleChangeItemType = (newValue) => {
        
        this.setState({
            selecteditemType: newValue.value
        })
    };

    

    clearForm = () =>{
        this.setState({
            account: '',
            selecteditemType: '',
        })
    }

    render() {

        const fontLebel ={padding:'10px 0px 10px', fontSize:'13px'}        

        return (
            <div className="body">
                <Toast ref={(el) => this.toast = el} />
                <Menu loggedIn={this.state.loggedIn} />
                <form onSubmit={this.submitForm} autoComplete="off">
                <div className="button_box_small_title">
                    <h3 className="pageTitle">Account Master (Group Creation) </h3>
                </div>
                <div className="continerSmallBox">    
                    
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Account Group</div>
                                <div style={{width: '100%'}}>
                                    <InputText id="username1" aria-describedby="username1-help" style={{width:'70%'}} name="account" value={this.state.account}  onChange={this.onChange}/>
                                    
                                    <div className="textDanger">{this.state.errors.account}</div>
                                        
                                </div>
                            </div>
                        </div>
                         
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Under</div>
                                <Dropdown style={{width:'70%'}} value={this.state.selecteditemType} options={this.state.itemType} onChange={this.handleChangeItemType} optionLabel="name" placeholder="Select" />
                                <div className="textDanger">{this.state.errors.selecteditemType}</div>
                            </div>
                        </div>
                </div>
                <div className="button_box_small">
                    <div className="row">
                        <div className="col-6">
                            <Button type="submit" className="inputData buttonPrimary" variant="contained" onClick={this.submitForm}>
                                <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">S</span>ave</div>
                            </Button>
                        </div>
                        <div className="col-1"></div>
                        <div className="col-6">
                                <Button type="submit" className="inputData buttonSecondary" variant="contained" onClick={this.clearForm}>
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