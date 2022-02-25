import React, { Component } from 'react'
import '../../../assets/css/print.css';
import { Button } from '@material-ui/core';
import { Link } from "react-router-dom";

import Logo from '../../../assets/img/skj_logo.png';

import ReactToPrint from 'react-to-print';

import PrintIcon from '@material-ui/icons/Print';

import NumberFormat from 'react-number-format';

//service 
import SalesService from '../../../service/sales/salesService'

//object of services
const salesService = new SalesService();
var converter = require('number-to-words');

export default class printComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: {},
            success: false,
            data: [],
            id: '',
            billno: props.billno,
            user: {},
            total: '',
            created_on: '',
            mobile: '',
            email: '',
            sales: {},
            ptotal: 0,
            printType: [
                { name: "A4 Half Model 1", code: "A4 Half Model 1" },
                { name: "A4 Half Model 2", code: "A4 Half Model 2" }
            ],
            printSelected: { name: "A4 Half Model 1", code: "A4 Half Model 1" }
        }
        this.getBillDeatils(props.billno)
        // this.handlePrintType = this.handlePrintType.bind(this)
    }

    async getBillDeatils(bill) {
        await this.state.billno

        let data = {
            login_user: localStorage.getItem("username"),
            billno: this.state.billno,
            branch: localStorage.getItem("Branch")
        }

        salesService.getBillDetails(data).then((response) => {
            console.log(response)
            if (response['data']['status'] === 1) {
                this.setState({
                    user: response['data']['data']['customer'],
                    data: response['data']['data']['list'],
                    sales: response['data']['data']['sales']
                });
            }
        }).catch((error) => {
            console.log(error)
            this.toast.show({ severity: 'error', summary: 'Message', detail: 'Check Connection', life: 3000 });
        })
    }

    render() {

        const shopName = localStorage.getItem("shopName");

        const branch = localStorage.getItem("Branch");

        var tweight = 0
        var va = 0

        this.state.data.map((data) => {
            tweight = tweight + parseFloat(data['net_weight']);
            va = va + parseFloat(data['weight'] /data['waste']);
        })

        return (
            <div>
                <div className="continerPrintInvoiceBox card-box">
                    <div style={{ padding: '30px 10px' }} ref={el => (this.componentRef = el)}>
                        <div className="content">
                            <div className="row">
                                <div style={{ width: '10%' }}>
                                    <img src={Logo} alt="Company logo" style={{ width: '95%' }} />
                                </div>
                                <div style={{ textAlign: 'center', width: '90%' }}>
                                    <span style={{ fontWeight: '700', fontSize: '25px', textAlign: 'center' }}>
                                        SRI DEVI JEWELLERS
                                    </span><br />
                                    <span style={{ fontSize: '16px', textAlign: 'center' }}>
                                        Kingstone Park<br />
                                        19/1,2nd Floor ,Puthur High Road<br />
                                        Woraiyur,Trichy-620017<br />
                                        GSTIN No: 33ABDCS8924N1ZU<br />
                                    </span>
                                </div>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '80%' }}>
                                    <div className="row">
                                        <div className="col-2">
                                            <b style={{ textDecoration: 'underline', fontWeight: '900' }}>TO:</b>
                                        </div>
                                        <div className="col-10" style={{ lineHeight: '20px' }}>
                                            {this.state.sales.cname}<br />
                                            {this.state.user.add1} <br />
                                            {this.state.user.city} <br />
                                            PH: {this.state.user.mobile}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ width: '20%' }}>
                                    <b style={{ textDecoration: 'underline', fontWeight: '900', marginBottom: '5px' }}>GST INVOICE</b>
                                    <div style={{ lineHeight: '20px' }}>
                                        Invoice No : {this.state.sales.billno}<br />
                                        Date : {this.state.sales.dat}  {this.state.sales.tim}<br />
                                        Pay Mode : {this.state.sales.pby}
                                    </div>
                                </div>
                            </div>
                            <table style={{ width: '100%', marginTop: '10px' }}>
                                <tr className="heading">
                                    <th style={{ borderTop: '2px solid black', borderBottom: '2px solid black' }}>SI.No</th>
                                    <th style={{ borderTop: '2px solid black', borderBottom: '2px solid black' }}>Particular</th>
                                    <th style={{ borderTop: '2px solid black', borderBottom: '2px solid black' }}>HSN</th>
                                    <th style={{ borderTop: '2px solid black', borderBottom: '2px solid black' }}>Qty</th>
                                    <th style={{ textAlign: 'center', borderTop: '2px solid black', borderBottom: '2px solid black' }}>Weight</th>
                                    <th style={{ textAlign: 'center', borderTop: '2px solid black', borderBottom: '2px solid black' }}>Wastage</th>
                                    <th style={{ borderTop: '2px solid black', borderBottom: '2px solid black' }}>Net Weight</th>
                                    <th style={{ borderTop: '2px solid black', borderBottom: '2px solid black' }}>Rate</th>
                                    <th style={{ borderTop: '2px solid black', borderBottom: '2px solid black' }}>Amount</th>
                                </tr>
                                {this.state.data.map((data) => (
                                    <tr>
                                        <td>1</td>
                                        <td>{data.iname} </td>
                                        <td style={{ textAlign: 'center' }}>{data.hsn}</td>
                                        <td style={{ textAlign: 'center' }}>{data.quan}</td>
                                        <td style={{ textAlign: 'right' }}>{data.weight}</td>
                                        <td style={{ textAlign: 'center' }}>{data.waste}% / {(parseFloat(data.weight / data.waste)).toFixed(3)}</td>
                                        <td style={{ textAlign: 'center' }}>{(parseFloat(data.net_weight)).toFixed(3)}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <NumberFormat value={(parseFloat(data.price)).toFixed(2)} displayType={'text'} thousandSeparator={true} />
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <NumberFormat value={(parseFloat(data.amount)).toFixed(2)} displayType={'text'} thousandSeparator={true} />
                                        </td>
                                    </tr>
                                ))}

                                {/* <tr>
                            <td>1</td>
                            <td>AARAM 916 BIS HM </td>
                            <td>7108</td>
                            <td style={{textAlign: 'center'}}>1</td>
                            <td>4.000</td>
                            <td>5.0%/0.200</td>
                            <td style={{textAlign: 'center'}}>4.200</td>
                            <td>3074.00</td>
                            <td style={{textAlign: 'right'}}>12910.80</td>
                        </tr>
                        <tr className="before-total">
                            <td>2</td>
                            <td>CHAIN 916 BIS HM</td>
                            <td>7108</td>
                            <td style={{textAlign: 'center'}}>1</td>
                            <td>55.000</td>
                            <td>10.0%/5.500</td>
                            <td style={{textAlign: 'center'}}>60.500</td>
                            <td>3074.00</td>
                            <td style={{textAlign: 'right'}}>185977.00</td>
                        </tr> */}
                                <tr className="total">
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th>{this.state.sales.tweight}</th>
                                    <th style={{ textAlign: 'right' }}>{va}</th>
                                    <th style={{ textAlign: 'center' }}></th>
                                    <th></th>
                                    <th style={{ textAlign: 'right' }}>
                                        <NumberFormat value={(parseFloat(this.state.sales.sub_total)).toFixed(2)} displayType={'text'} thousandSeparator={true} />
                                    </th>
                                </tr>
                                <tr>
                                    <td colspan="6" style={{ fontSize: '13px' }}>
                                        {converter.toWords(this.state.sales.net ? this.state.sales.net : 0)}
                                    </td>
                                    <td colspan="2"> {this.state.sales.dis_per}% Discount (-)</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <NumberFormat value={(parseFloat((this.state.sales.dis_per * this.state.sales.sub_total) / 100)).toFixed(2)} displayType={'text'} thousandSeparator={true} />
                                    </td>
                                </tr>

                                <tr>
                                    <td colspan="6">
                                        <table>
                                            <tr>
                                                <th className="innerTable">HSN</th>
                                                <th className="innerTable">Taxable Value</th>
                                                <th className="innerTable">GST %</th>
                                                <th className="innerTable">Tax Amount</th>
                                            </tr>
                                            <tr>
                                                <td className="innerTable-cell" style={{ textAlign: 'center' }}>7108</td>
                                                <td className="innerTable-cell" style={{ textAlign: 'center' }}>{this.state.sales.sub_total}</td>
                                                <td className="innerTable-cell" style={{ textAlign: 'center' }}>{this.state.sales.taxp}</td>
                                                <td className="innerTable-cell" style={{ textAlign: 'center' }}>{this.state.sales.tax_amt}</td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td colspan="2">Making Charge (+)</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <NumberFormat value={(parseFloat(this.state.sales.make)).toFixed(2)} displayType={'text'} thousandSeparator={true} />
                                    </td>

                                </tr>
                                <tr>
                                    <td colspan="6"></td>
                                    <td colspan="2">Old Wornout & Gold (-)</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <NumberFormat value={(parseFloat(this.state.sales.old_amt)).toFixed(2)} displayType={'text'} thousandSeparator={true} />
                                    </td>
                                </tr>
                                {this.state.sales.tax_type == 'Local' ?
                                <tr>
                                    <td colspan="6"></td>
                                    <td colspan="2">CGST {this.state.sales.taxp ? this.state.sales.taxp/2 : 0}% (+)</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <NumberFormat value={parseFloat((this.state.sales.taxp * this.state.sales.sub_total) / 100)/2} displayType={'text'} thousandSeparator={true} />
                                    </td>

                                </tr>:''}
                                {this.state.sales.tax_type == 'Local' ?
                                <tr>
                                    <td colspan="6"></td>
                                    <td colspan="2">SGST {this.state.sales.taxp ? this.state.sales.taxp/2 : 0}% (+)</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <NumberFormat value={parseFloat((this.state.sales.taxp * this.state.sales.sub_total) / 100)/2} displayType={'text'} thousandSeparator={true} />
                                    </td>
                                </tr>:
                                <tr>
                                <td colspan="6"></td>
                                <td colspan="2">IGST {this.state.sales.taxp ? this.state.sales.taxp : 0}% (+)</td>
                                <td style={{ textAlign: 'right' }}>
                                    <NumberFormat value={parseFloat((this.state.sales.taxp * this.state.sales.sub_total) / 100)} displayType={'text'} thousandSeparator={true} />
                                </td>
                            </tr>}
                                <tr>
                                    <td colspan="6"></td>
                                    <th colspan="2">TOTAL</th>
                                    <th style={{ borderTop: '2px solid black', borderBottom: '2px solid black', textAlign: 'right' }}>
                                        <NumberFormat value={(parseFloat(this.state.sales.net)).toFixed(2)} displayType={'text'} thousandSeparator={true} />
                                    </th>
                                </tr>
                                <tr className="for-label">
                                    <td colspan="6"></td>
                                    <th colspan="4" style={{ fontSize: '15px' }}>For SRI DEVI JEWELLERS</th>
                                </tr>
                                <tr>
                                    <td colspan="3">E& O.E</td>
                                    <th colspan="3">Thank You! Visit Again!</th>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="button_box_small_print">
                    <div className="row">
                        <div className="col-6">
                            <Link to="/sales-bill" className="Link">
                                <Button type="submit" className="inputData buttonSecondary" variant="contained">
                                    <div className="buttonText"> <span className="buttonTextFirstLetter"> <i className="pi pi-step-backward"></i> B</span>ack</div>
                                </Button>
                            </Link>
                        </div>
                        <div className="col-1"></div>
                        <div className="col-6">
                            <ReactToPrint
                                trigger={() => {
                                    return <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                        <div className="buttonText"> <PrintIcon className="materialIcon" /> <span className="buttonTextFirstLetter">P</span>rint</div>
                                    </Button>;
                                }}
                                content={() => this.componentRef}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}