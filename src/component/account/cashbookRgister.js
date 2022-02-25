import React, { Component } from 'react'
import '../../assets/css/style.css';
import { Button } from '@material-ui/core';


//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import { InputText } from 'primereact/inputtext';
import 'primeflex/primeflex.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationContainer } from 'react-notifications';
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
            reference_number : '',
            re_date: '',
            account: '',
            account_group: '',
            amount: '',
            narration: '',
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

    clearForm = () => {
        this.setState({
            reference_number : '',
            re_date: '',
            account: '',
            account_group: '',
            amount: '',
            narration: '',
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
                    <h3 className="pageTitle">Cash Book Register </h3>
                </div>

                <div className="continerSmallBox">

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Reference Number</div>
                            <InputText id="username1" placeholder="Enter Reference Number" aria-describedby="username1-help" style={{width:'100%'}} name="reference_number" value={this.state.reference_number} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Date</div>
                            <InputText id="username1" type="date"  aria-describedby="username1-help" style={{width:'100%'}} name="re_date" value={this.state.re_date} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Account</div>
                            <InputText id="username1" placeholder="Enter Account" aria-describedby="username1-help" style={{width:'100%'}} name="account" value={this.state.account} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Account Group</div>
                            <InputText id="username1"  placeholder="Enter Account Group" aria-describedby="username1-help" style={{width:'100%'}} name="account_group" value={this.state.account_group} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Amount</div>
                            <InputText id="username1" placeholder="Enter Amount" aria-describedby="username1-help" style={{width:'100%'}} name="amount" value={this.state.amount} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Entry</div>
                            <InputText id="username1" placeholder="Enter Entry" aria-describedby="username1-help" style={{width:'100%'}} name="entry" value={this.state.entry} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Narration</div>
                            <InputText id="username1" placeholder="Enter Narration" aria-describedby="username1-help" style={{width:'100%'}} name="narration" value={this.state.narration} onChange={this.onChange}/>
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