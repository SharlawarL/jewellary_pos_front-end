import React, { Component } from 'react'
import '../../assets/css/style.css';
import { TextField, Button } from '@material-ui/core';
import { Link } from "react-router-dom";
import Select from 'react-select'
import ReactHTMLDatalist from "react-html-datalist";

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
import ItemService from '../../service/item/itemService'
const itemService = new ItemService();

export default class stockComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: {},
            success: false,
            branchname: '',
            purity: ''
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

        // if (this.validate()) {
            const {
                purity
            } = this.state

            let data = {
                login_user: localStorage.getItem("username"),
                branch: localStorage.getItem("Branch"),
                purity: purity
            }


            itemService.saveItemPurity(data).then((response) => {
                if (response['data']['status'] === 1) {
                    // toast.success(response['data']['message']);
                    // NotificationManager.success('Success message', response['data']['message']);
                    this.toast.show({severity:'success', summary: 'Message', detail:response['data']['message'], life: 3000});
                    // this.setState({
                    //     success: true,
                    // });
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
        // }
    }


    clearForm = () =>{
        this.setState({
            purity:''
        })
    }

    items = () =>(
        () =>
        this.state.category.map((oneItem) => ({
            // required: what to show to the user
            label: oneItem.name,
            // required: key to identify the item within the array
            key: oneItem.code,
            // feel free to add your own app logic to access those properties in the onSelect function
            someAdditionalValue: oneItem.someAdditionalValue,
            // or just keep everything
            ...oneItem,
          })),
        [this.state.category]
      );


    render() {

        const fontLebel ={padding:'10px 0px 10px', fontSize:'13px'}


        return (
            <div className="body">
                {/* <ToastContainer />
                <NotificationContainer /> */}
                <Toast ref={(el) => this.toast = el} />
                <Menu loggedIn={this.state.loggedIn} />
                <form onSubmit={this.submitForm} autoComplete="off">
                <div className="button_box_small_title">
                    <h3 className="pageTitle">Item Purity Master </h3>
                </div>
                <div className="continerSmallBox">    
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Purity</div>
                                <InputText id="username1" aria-describedby="username1-help" style={{width:'70%'}} name="purity" value={this.state.purity} onChange={this.onChange} placeholder="Enter Purity"/>
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