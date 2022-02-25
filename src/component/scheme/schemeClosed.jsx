import React, { Component } from 'react'
import '../../assets/css/style.css';
import { TextField, Button } from '@material-ui/core';
import { Link } from "react-router-dom";
import Select from 'react-select'


//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import 'primeflex/primeflex.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Redirect } from 'react-router-dom';


//service 
import ItemService from '../../service/item/itemService'

//object of services
const itemService = new ItemService();

export default class stockComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: {},
            success: false,
            branchname: '',
            remark: '',
            scheme_status: '',
            amount_paid: '',
            scheme_number: '',
            entry_number: '',
        }

        this.getLastItem()
        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)

    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    getLastItem() {

        let data = { login_user: localStorage.getItem("username"), branch: localStorage.getItem("Branch") }

        itemService.getLastItem(data).then((response) => {
            if (response['data']['status'] === 1) {
                this.setState({
                    last_id: response['data']['data']['last_id'],
                    last_item: response['data']['data']['item_no']
                })
            }
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    }


    submitForm(e) {
        e.preventDefault()

        // if (this.validate()) {
        //     const {
        //         name,
        //         location,
        //         selectedCategory,
        //         selecteditemType,
        //         purity,
        //         makingCharges,
        //         wastage,
        //         hsnCode,
        //         selectedPriceType,
        //         price
        //     } = this.state

        //     let data = {
        //         login_user: localStorage.getItem("username"),
        //         branch: localStorage.getItem("Branch"),
        //         name: name,
        //         location: location,
        //         category: selectedCategory.value,
        //         itemType: selecteditemType.value,
        //         purity: purity,
        //         makingCharges: makingCharges,
        //         wastage: wastage,
        //         hsnCode: hsnCode,
        //         priceType: selectedPriceType.value,
        //         price: price
        //     }

        //     itemService.saveItem(data).then((response) => {
        //         if (response['data']['status'] === 1) {
        //             toast.success(response['data']['message']);
        //             NotificationManager.success('Success message', response['data']['message']);
        //             this.setState({
        //                 success: true,
        //             });
        //         } else {
        //             toast.error(response['data']['message']);
        //             this.setState({
        //                 loggedIn: false,
        //             });
        //         }
        //     }).catch((error) => {
        //         console.log(error)
        //     })
        // }
    }

    validate() {
        let name = this.state.name;
        let location = this.state.location;
        let selectedCategory = this.state.selectedCategory;
        let selecteditemType = this.state.selecteditemType;
        let purity = this.state.purity;
        let makingCharges = this.state.makingCharges;
        let wastage = this.state.wastage;
        let hsnCode = this.state.hsnCode;
        let selectedPriceType = this.state.selectedPriceType;
        let price = this.state.price;
        let errors = {};
        let isValid = true;

        if (!name) {
            isValid = false;
            errors["name"] = "Please enter name.";
        }

        if (!location) {
            isValid = false;
            errors["location"] = "Please  enter location.";
        }

        if (!selectedCategory) {
            isValid = false;
            errors["selectedCategory"] = "Please select category.";
        }

        if (!selecteditemType) {
            isValid = false;
            errors["selecteditemType"] = "Please select item type.";
        }

        if (!purity) {
            isValid = false;
            errors["purity"] = "Please enter purity.";
        }

        if (!makingCharges) {
            isValid = false;
            errors["makingCharges"] = "Please enter making charges.";
        }

        if (!wastage) {
            isValid = false;
            errors["wastage"] = "Please enter wastage.";
        }

        if (!hsnCode) {
            isValid = false;
            errors["hsnCode"] = "Please enter HSN code.";
        }

        if (!selectedPriceType) {
            isValid = false;
            errors["selectedPriceType"] = "Please select price type.";
        }

        if (!price) {
            isValid = false;
            errors["price"] = "Please enter price.";
        }

        this.setState({
            errors: errors
        });

        return isValid;
    }

    handleChangeCategory = (newValue) => {
        console.log(newValue)
        this.setState({
            selectedCategory: newValue
        })
    };

    handleChangeItemType = (newValue) => {
        console.log(newValue)
        this.setState({
            selecteditemType: newValue
        })
    };

    handleChangePriceType = (newValue) => {
        console.log(newValue)
        this.setState({
            selectedPriceType: newValue
        })
    };

    handleChangePurity = (newValue) => {
        console.log(newValue)
        this.setState({
            selectedPurity: newValue
        })
    };

    clearForm = () =>{
        this.setState({
            remark: '',
            scheme_status: '',
            amount_paid: '',
            scheme_number: '',
            entry_number: '',
        })
    }

    render() {

        const fontLebel ={padding:'10px 0px 10px', fontSize:'13px'}

        if (this.state.success) {
            return <Redirect to='/item-summary'></Redirect>
        }

        return (
            <div className="body">
                <ToastContainer />
                <NotificationContainer />
                <Menu loggedIn={this.state.loggedIn} />

                <form onSubmit={this.submitForm} autoComplete="off">
                <div className="button_box_small_title">
                    <h3 className="pageTitle">Scheme Close </h3>
                </div>

                <div className="continerSmallBox">

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Entry Number</div>
                            <InputText id="username1" placeholder="Enter Entry Number" aria-describedby="username1-help" style={{width:'100%'}} name="entry_number" value={this.state.entry_number} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Scheme Number</div>
                            <InputText id="username1" placeholder="Enter Scheme Number" aria-describedby="username1-help" style={{width:'100%'}} name="scheme_number" value={this.state.scheme_number} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Ammount Paid</div>
                            <InputText id="username1" placeholder="Enter Ammount Paid" aria-describedby="username1-help" style={{width:'100%'}} name="amount_paid" value={this.state.amount_paid} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Scheme Status</div>
                            <InputText id="username1" placeholder="Enter Scheme Status" aria-describedby="username1-help" style={{width:'100%'}} name="scheme_status" value={this.state.scheme_status} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Remarks</div>
                            <InputText id="username1" placeholder="Enter Remarks" aria-describedby="username1-help" style={{width:'100%'}} name="remark" value={this.state.remark} onChange={this.onChange}/>
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