import React, { Component } from 'react'
import '../../assets/css/style.css';
import { Button } from '@material-ui/core';
import { Link } from "react-router-dom";
//pages
import Menu from '../common/menu'
import Footer from '../common/footer'

import 'primeflex/primeflex.css';
import ReactToPrint from 'react-to-print';

import { Dropdown } from 'primereact/dropdown';
//json
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';
import NumberFormat from 'react-number-format';

import PrintIcon from '@material-ui/icons/Print';
import Logo from '../../assets/img/skj_logo.png';

import { PrimeIcons } from 'primereact/api';
import 'primeflex/primeflex.css';

// print templates
import A4HalfModel from './print_templates/a4HalfModel1'
import A4HalfModel2 from './print_templates/a4HalfModel2'
import A4HalfModel3 from './print_templates/a4HalfModel3'
import A4HalfModel4 from './print_templates/a4HalfModel4'
import ThermalBill3Model from './print_templates/thermal3'

//service 
import SalesService from '../../service/sales/salesService'

//object of services
const salesService = new SalesService();
var converter = require('number-to-words');

// const pageStyle="@page { size: 3in 10in}"

export default class stockComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: {},
            success: false,
            data: [],
            id: '',
            billno: props.location.state['billno'],
            user: {},
            total: '',
            created_on: props.location.state['created_on'],
            mobile: '',
            email: '',
            sales: {},
            ptotal: 0,
            printType : [
                { name:"A4 Half Model 1", code:"A4 Half Model 1"},
                { name:"A4 Half Model 2", code:"A4 Half Model 2"}
            ],
            printSelected:{ name:"A4 Half Model 1", code:"A4 Half Model 1"},
            billFormat :''
        }
        this.getBillFormat()
        this.onChange = this.onChange.bind(this)
        this.handlePrintType = this.handlePrintType.bind(this)

    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handlePrintType(e){
        this.setState({
            printSelected : e.target.value
        })
    }

    getBillFormat() {
        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch")
        }

        salesService.getBillFormat(data).then((response) => {
            console.log(response)
            if (response['data']['status'] === 1) {
                this.setState({
                    billFormat: response['data']['data']['bill_format'],
                });
            }
      }).catch((error) => {
            console.log(error)
        })
    }

    render() {

        if (this.state.success) {
            return <Redirect to='/sales-bill'></Redirect>
        }

        const shopName = localStorage.getItem("shopName");

        const branch = localStorage.getItem("Branch");

        var tweight = 0
        var va = 0

        this.state.data.map((data) => {
            tweight = tweight + parseFloat(data['net_weight']);
            va = va + parseFloat(data['weight'] /data['waste']);
        })

        return (
            <div className="body">
                <Menu loggedIn={this.state.loggedIn} />
                {/* <div style={{width:'55%',margin:'5px auto'}}>
                    <Dropdown style={{width:'100%'}} value={this.state.printSelected} options={this.state.printType} onChange={this.handlePrintType} optionLabel="name" placeholder="Select Print" />
                </div> */}
                {this.state.billFormat == 'A4 Half Model 1'?
                <A4HalfModel billno={this.state.billno} />
                :''}
                {this.state.billFormat == 'A4 Half Model 2'?
                <A4HalfModel2 billno={this.state.billno} />
                :''}
                {this.state.billFormat == 'A4 Half Model 3'?
                <A4HalfModel3 billno={this.state.billno} />
                :''}
                {this.state.billFormat == 'A4 Half Model 4'?
                <A4HalfModel4 billno={this.state.billno} />
                :''}
                {this.state.billFormat == 'Thermal Bill 3 inch'?
                <ThermalBill3Model billno={this.state.billno} />
                :''}
                
                <Footer />
            </div>
        )
    }
}