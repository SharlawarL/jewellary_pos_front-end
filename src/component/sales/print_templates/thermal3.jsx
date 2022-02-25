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
            va = va + parseFloat(data['weight'] / data['waste']);
        })

        return (
            <div>
                <div className="continerPrintInvoiceBox card-box">
                    <div style={{ padding: '10px 10px' }} ref={el => (this.componentRef = el)}>
                        <div style={{ width: '50%' }}>
                            <div style={{ padding: '5px', border: '2px solid black' }}>
                                <div style={{ display: 'flex' }}>
                                    <div className="col" style={{ textAlign: 'center' }}>
                                        <span style={{ fontWeight: '700', fontSize: '25px' }}>SRI DEVI JEWELLERS Palace Pvt
                                            Ltd</span><br />
                                        Kingstone Park 19/1,2nd Floor,<br />
                                        Puthur High Road,<br />
                                        Woraiyur,Trichy-620017<br />
                                        GSTIN No: 33ABDCS8924N1ZU<br />
                                    </div>
                                </div>
                                <div style={{ display: 'flex' }}>

                                    <div className="col" style={{ textAlign: 'center' }}>
                                        <h3 style={{ textDecoration: 'underline', fontWeight: '700' }}>CASH /CARD BILL</h3>
                                    </div>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <div style={{ width: '60%' }}>
                                        Bill No : {this.state.sales.billno}
                                    </div>
                                    <div style={{ width: '40%'}}>
                                        Date : {this.state.sales.dat} <br></br>
                                        Time : {this.state.sales.tim}
                                    </div>
                                </div>
                                <br></br>
                                <div style={{ width: '100%'}}>
                                    <div style={{ width: '100%'}}>
                                        Bill To:<br />
                                        {this.state.sales.cname}<br />
                                        {this.state.user.add1}<br />
                                        {this.state.user.city}<br />
                                        PH: {this.state.user.mobile} <br />
                                        <hr style={{borderTop: '2px solid black'}} />
                                        PARTICULARS
                                        <hr style={{borderTop: '2px solid black'}} />
                                        CHAIN BIS HM
                                        <table style={{ width: '100%'}}>
                                            <tr>
                                                <td style={{ width: '70%' }}>Qty</td>
                                                <td style={{ width: '30%',textAlign: 'right' }}>1</td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: '70%' }}>Weight</td>
                                                <td style={{ width: '30%',textAlign: 'right' }}>12.145</td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: '70%' }}>Wastage</td>
                                                <td style={{ width: '30%',textAlign: 'right' }} >12% /1.145</td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: '70%' }}>Rate</td>
                                                <td style={{ width: '30%',textAlign: 'right' }} style={{ textAlign: 'right' }}>4500.00</td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: '70%' }}>Amount</td>
                                                <td style={{ width: '30%',textAlign: 'right' }} style={{ textAlign: 'right' }}>59805.00</td>
                                            </tr>
                                        </table>

                                        STUD 22CT-RING MODEL

                                        <table style={{ width: '100%'}}>
                                            <tr>
                                                <td style={{ width: '70%' }}>Qty</td>
                                                <td style={{ width: '30%',textAlign: 'right' }} style={{ textAlign: 'right' }}>2</td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: '70%' }}>Weight</td>
                                                <td style={{ width: '30%',textAlign: 'right' }} style={{ textAlign: 'right' }}>12.145</td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: '70%' }}>Wastage</td>
                                                <td style={{ width: '30%',textAlign: 'right' }} style={{ textAlign: 'right' }}>12% /1.145</td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: '70%' }}>Rate</td>
                                                <td style={{ width: '30%',textAlign: 'right' }} style={{ textAlign: 'right' }}>4000.00</td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: '70%' }}>Amount</td>
                                                <td style={{ width: '30%',textAlign: 'right' }} style={{ textAlign: 'right' }}>53160.00</td>
                                            </tr>
                                        </table>
                                        <hr style={{borderTop: '2px solid black'}}/>
                                        <table style={{ width: '100%'}}>
                                            <tr>
                                                <td style={{ width: '70%' }}>Total Amount </td>
                                                <td style={{ width: '30%',textAlign: 'right' }} style={{ textAlign: 'right', paddingLeft: '8px' }}>112965.00</td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: '70%' }}>5% Discount(-) </td>
                                                <td style={{ width: '30%',textAlign: 'right' }} style={{ textAlign: 'right', paddingLeft: '8px' }}>5648.25</td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: '70%' }}>MC (+)</td>
                                                <td style={{ width: '30%',textAlign: 'right' }} style={{ textAlign: 'right', paddingLeft: '8px' }}>50.00</td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: '70%' }}>Old Gold (-)</td>
                                                <td style={{ width: '30%',textAlign: 'right' }} style={{ textAlign: 'right', paddingLeft: '8px' }}>00.00</td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: '70%' }}>1.5% CGST (+)</td>
                                                <td style={{ width: '30%',textAlign: 'right' }} style={{ textAlign: 'right', paddingLeft: '8px' }}>1610.00</td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: '50%' }}>1.5% SGST (+) </td>
                                                <td style={{ width: '50%' }} style={{ textAlign: 'right', paddingLeft: '8px' }}>1610.00</td>
                                            </tr>
                                        </table>
                                        <hr style={{borderTop: '2px solid black'}} />
                                        <table style={{ width: '100%'}}>
                                            <tr>
                                                <td style={{ width: '70%' }}>TOTAL</td>
                                                <td style={{ width: '30%',textAlign: 'right' }} style={{ textAlign: 'right', paddingLeft: '8px' }}>110588.00</td>
                                            </tr>
                                        </table>
                                        <hr style={{borderTop: '2px solid black'}} />
                                        <div style={{ textAlign: 'center', lineHeight: '10px' }}>
                                            <p>BILL MESSAGE 1</p>
                                            <p>BILL MESSAGE 2</p>
                                            <p>BILL MESSAGE 3</p>
                                            <p>BILL MESSAGE 4</p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="button_box_small_print">
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '50%' }}>
                            <Link to="/sales-bill" className="Link">
                                <Button type="submit" className="inputData buttonSecondary" variant="contained">
                                    <div className="buttonText"> <span className="buttonTextFirstLetter"> <i className="pi pi-step-backward"></i> B</span>ack</div>
                                </Button>
                            </Link>
                        </div>
                        <div className="col-1"></div>
                        <div style={{ width: '50%' }}>
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