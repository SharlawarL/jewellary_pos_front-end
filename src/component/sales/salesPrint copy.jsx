import React, { Component } from 'react'
import '../../assets/css/style.css';
import { Button } from '@material-ui/core';
import { Link } from "react-router-dom";
//pages
import Menu from '../common/menu'
import Footer from '../common/footer'

import 'primeflex/primeflex.css';
import ReactToPrint from 'react-to-print';

//json
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';
import NumberFormat from 'react-number-format';

import PrintIcon from '@material-ui/icons/Print';
import Logo from '../../assets/img/skj_logo.png';

import { PrimeIcons } from 'primereact/api';
import 'primeflex/primeflex.css';

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
            ptotal: 0
        }
        this.getBillDeatils(props.location.state['billno'])
        this.onChange = this.onChange.bind(this)

    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    async getBillDeatils(bill) {
        await this.state.billno

        let data = {
            login_user: localStorage.getItem("username"),
            billno: this.state.billno
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
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
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

                <div className="continerPrintInvoiceBox card-box">
                    <div style={{ padding: '30px 10px' }} ref={el => (this.componentRef = el)}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ color: 'black', textShadow: 'none', height: '100px' }}>
                                &nbsp;&nbsp;
                            </div>
                            <div style={{ color: 'black', textShadow: 'none', margin: '10px 0px', textDecoration: 'underline', fontWeight: 'bold' }}> GST INVOICE </div>
                        </div>
                        <div className="p-grid" style={{ fontWeight: '500' }}>
                            <div className="p-col-8">
                                <div className="p-grid">
                                    <div className="p-col-12">
                                        {this.state.sales.cname} <br></br>
                                        {this.state.user.add1} ,<br></br>
                                        {this.state.user.city} <br></br>
                                        {this.state.user.mobile}
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-4">
                                <div className="p-grid">
                                    <div className="p-col-4" style={{ padding: '1px 0px', fontSize: '0.9rem' }}>
                                        Invoice No
                                    </div>
                                    <div className="p-col-8" style={{ padding: '1px 0px', fontSize: '0.9rem' }}>
                                        : {this.state.sales.billno}
                                    </div>
                                    <div className="p-col-4" style={{ padding: '1px 0px', fontSize: '0.9rem' }}>
                                        Date
                                    </div>
                                    <div className="p-col-8" style={{ padding: '1px 0px', fontSize: '0.9rem' }}>
                                        : {this.state.sales.dat}  {this.state.sales.tim}
                                    </div>
                                    <div className="p-col-4" style={{ padding: '1px 0px', fontSize: '0.9rem' }}>
                                        Pay Mode
                                    </div>
                                    <div className="p-col-8" style={{ padding: '1px 0px', fontSize: '0.9rem' }}>
                                        : {this.state.sales.pby}
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div style={{ minHeight: '300px' }}>
                            <table style={{ width: '100%', borderTop: '1px solid silver', marginTop: '20px' }}>
                                <tr>
                                    <th style={{ borderBottom: '1px solid silver', textAlign: 'left', padding: '5px', fontSize: '0.8rem' }}>Description</th>
                                    <th style={{ borderBottom: '1px solid silver', textAlign: 'right', padding: '5px', fontSize: '0.8rem' }}>HSN</th>
                                    <th style={{ borderBottom: '1px solid silver', textAlign: 'right', padding: '5px', fontSize: '0.8rem' }}>Pcs</th>
                                    <th style={{ borderBottom: '1px solid silver', textAlign: 'right', padding: '5px', fontSize: '0.8rem' }}>Weight</th>
                                    <th style={{ borderBottom: '1px solid silver', textAlign: 'right', padding: '5px', fontSize: '0.8rem' }}>V.A.</th>
                                    <th style={{ borderBottom: '1px solid silver', textAlign: 'right', padding: '5px', fontSize: '0.8rem' }}>T.Wt</th>
                                    <th style={{ borderBottom: '1px solid silver', textAlign: 'right', padding: '5px', fontSize: '0.8rem' }}>Rate</th>
                                    <th style={{ borderBottom: '1px solid silver', textAlign: 'right', padding: '5px', fontSize: '0.8rem' }}>Amount</th>
                                </tr>
                                {this.state.data.map((data) => (
                                    <tr>
                                        <td style={{ padding: '5px 10px' }}> {data.iname} </td>
                                        <td style={{ padding: '5px 10px', textAlign: 'right', fontSize: '0.8rem' }}> {data.hsn} </td>
                                        <td style={{ padding: '5px 10px', textAlign: 'right', fontSize: '0.8rem' }}> {data.quan} </td>
                                        <td style={{ padding: '5px 10px', textAlign: 'right', fontSize: '0.8rem' }}> {data.weight} </td>
                                        <td style={{ padding: '5px 10px', textAlign: 'right', fontSize: '0.8rem' }}> {data.waste}% / {(parseFloat(data.weight / data.waste)).toFixed(3)} </td>
                                        <td style={{ padding: '5px 10px', textAlign: 'right', fontSize: '0.8rem' }}> {(parseFloat(data.net_weight)).toFixed(3)} </td>
                                        <td style={{ padding: '5px 10px', textAlign: 'right', fontSize: '0.8rem' }}>
                                            <NumberFormat value={(parseFloat(data.price)).toFixed(2)} displayType={'text'} thousandSeparator={true} />
                                        </td>
                                        <td style={{ padding: '5px 10px', textAlign: 'right', fontSize: '0.8rem' }}>
                                            <NumberFormat value={(parseFloat(data.amount)).toFixed(2)} displayType={'text'} thousandSeparator={true} />
                                        </td>
                                    </tr>
                                ))}

                            </table>
                        </div>
                        <table style={{ width: '100%', borderTop: '1px solid silver', }}>
                            <tr>
                                <td style={{ width: '100px', padding: '5px 10px' }}></td>
                                <td style={{ width: '10px', padding: '5px 10px', textAlign: 'right', fontSize: '0.8rem' }}></td>
                                <td style={{ width: '10px', padding: '5px 10px', textAlign: 'right', fontSize: '0.8rem' }}></td>
                                <td style={{ width: '70px', padding: '5px 10px', textAlign: 'right', fontSize: '0.8rem' }}></td>
                                <td style={{ width: '100px', padding: '5px 10px', textAlign: 'right', fontSize: '0.8rem' }}>{this.state.sales.tweight}</td>
                                <td style={{ width: '20px', padding: '5px 10px', textAlign: 'right', fontSize: '0.8rem' }}> {va}</td>
                                <td style={{ width: '100px', padding: '5px 10px', textAlign: 'right', fontSize: '0.8rem' }}>
                                    {tweight}
                                </td>
                                <td style={{ padding: '5px 10px', textAlign: 'right', fontSize: '0.8rem' }}>
                                    <NumberFormat value={(parseFloat(this.state.sales.sub_total)).toFixed(2)} displayType={'text'} thousandSeparator={true} />
                                </td>
                            </tr>
                        </table>
                        <br></br>
                        <div className="p-grid" style={{ fontWeight: '500', borderTop: '1px solid silver', }}>
                            <div className="p-col-7">
                                <span style={{ textAlign: 'left', padding: '10px 0px', fontSize: '0.8rem' }}>
                                    {converter.toWords(this.state.sales.net ? this.state.sales.net : 0)}


                                    <br></br>
                                    <br></br>
                                    <br></br>
                                    <br></br>
                                    <br></br>
                                    <b style={{ textDecoration: 'underline' }}>Bank Details:</b> <br></br>
                                    A/c No:<br></br>
                                    Name:<br></br>
                                    Bank: <br></br>
                                    Branch <br></br>
                                    IFSC:
                                </span>
                            </div>
                            <div className="p-col-5">
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ textAlign: 'right', padding: '5px', fontSize: '0.8rem' }}>{this.state.sales.dis_per}% Discount (-)</td>
                                        <td style={{ textAlign: 'right', padding: '5px', fontSize: '0.8rem', fontWeight: '700' }}>
                                            <NumberFormat value={(parseFloat((this.state.sales.dis_per * this.state.sales.sub_total) / 100)).toFixed(2)} displayType={'text'} thousandSeparator={true} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: 'right', padding: '5px', fontSize: '0.8rem' }}>Making Charge (+)</td>
                                        <td style={{ textAlign: 'right', padding: '5px', fontSize: '0.8rem', fontWeight: '700' }}>
                                            <NumberFormat value={(parseFloat(this.state.sales.make)).toFixed(2)} displayType={'text'} thousandSeparator={true} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: 'right', padding: '5px', fontSize: '0.8rem' }}>Old Wornout & Gold (-)</td>
                                        <td style={{ textAlign: 'right', padding: '5px', fontSize: '0.8rem', fontWeight: '700' }}>
                                            <NumberFormat value={(parseFloat(this.state.sales.old_amt)).toFixed(2)} displayType={'text'} thousandSeparator={true} />
                                        </td>
                                    </tr>
                                    {this.state.sales.tax_type == 'Local' ?
                                        <tr>
                                            <td style={{ textAlign: 'right', padding: '5px', fontSize: '0.8rem' }}>CGST {this.state.sales.dis_per ? this.state.sales.dis_per/2 : 0}% (+)</td>
                                            <td style={{ textAlign: 'right', padding: '5px', fontSize: '0.8rem', fontWeight: '700' }}>
                                                <NumberFormat value={parseFloat((this.state.sales.dis_per * this.state.sales.sub_total) / 100)/2} displayType={'text'} thousandSeparator={true} />
                                            </td>
                                        </tr> : ''
                                    }
                                    {this.state.sales.tax_type == 'Local' ?
                                        <tr>
                                            <td style={{ textAlign: 'right', padding: '5px', fontSize: '0.8rem' }}>SGST {this.state.sales.dis_per ? this.state.sales.dis_per/2 : 0}% (+) </td>
                                            <td style={{ textAlign: 'right', padding: '5px', fontSize: '0.8rem', fontWeight: '700' }}>
                                                <NumberFormat value={parseFloat((this.state.sales.dis_per * this.state.sales.sub_total) / 100)/2} displayType={'text'} thousandSeparator={true} />
                                            </td>
                                        </tr> :
                                        <tr>
                                            <td style={{ textAlign: 'right', padding: '5px', fontSize: '0.8rem' }}>IGST {this.state.sales.dis_per ? this.state.sales.dis_per : 0}% (+) </td>
                                            <td style={{ textAlign: 'right', padding: '5px', fontSize: '0.8rem', fontWeight: '700' }}>
                                                <NumberFormat value={parseFloat((this.state.sales.dis_per * this.state.sales.sub_total) / 100)} displayType={'text'} thousandSeparator={true} />
                                            </td>
                                        </tr>
                                    }


                                    <tr>
                                        <td style={{ textAlign: 'right', padding: '5px', fontSize: '0.8rem', fontWeight: '700' }}>Total</td>
                                        <td style={{ borderBottom: '2px solid silver', borderTop: '2px solid silver', textAlign: 'right', padding: '5px', fontSize: '0.8rem', fontWeight: '700' }}>
                                            <NumberFormat value={(parseFloat(this.state.sales.net)).toFixed(2)} displayType={'text'} thousandSeparator={true} />
                                        </td>
                                    </tr>
                                </table>
                                <b >

                                </b>
                            </div>
                        </div>
                        {/* <table>
                            <tr>
                                <td style={{ borderTop: '1px solid silver', textAlign: 'left', padding: '10px', fontSize:'0.8rem' }}>{converter.toWords(this.state.sales.net?this.state.sales.net:0)}</td>
                                <th style={{ borderTop: '1px solid silver', textAlign: 'left', padding: '10px', fontSize:'0.8rem' }}> Cash</th>
                                <th style={{ borderTop: '1px solid silver', textAlign: 'right', padding: '10px', fontSize:'0.8rem' }}>
                                    <NumberFormat value={(parseFloat(this.state.sales.cash)).toFixed(2)} displayType={'text'} thousandSeparator={true} />
                                </th>
                                <th style={{ borderTop: '1px solid silver', textAlign: 'right', padding: '10px', fontSize:'0.8rem' }}> Subtotal</th>
                                <th style={{ borderTop: '1px solid silver', textAlign: 'right', padding: '10px', fontSize:'0.8rem' }}>
                                    <NumberFormat value={(parseFloat(this.state.sales.paid)).toFixed(2)} displayType={'text'} thousandSeparator={true} />
                                </th>
                            </tr>
                            <tr>
                                <th style={{ borderTop: '1px solid silver', textAlign: 'left', padding: '10px', fontSize:'0.8rem' }}> TotalPaid</th>
                                <th style={{ borderTop: '1px solid silver', textAlign: 'right', padding: '10px', fontSize:'0.8rem' }}>
                                    <NumberFormat value={(parseFloat(this.state.sales.paid)).toFixed(2)} displayType={'text'} thousandSeparator={true} />
                                </th>
                                <th style={{ borderTop: '1px solid silver', textAlign: 'right', padding: '10px', fontSize:'0.8rem' }}> Total</th>
                                <th style={{ borderTop: '1px solid silver', textAlign: 'right', padding: '10px', fontSize:'0.8rem' }}>
                                    <NumberFormat value={(parseFloat(this.state.sales.net)).toFixed(2)} displayType={'text'} thousandSeparator={true} />
                                </th>
                            </tr>
                        </table> */}
                        <div style={{ fontSize: '10px', textAlign: 'center', padding: '20px' }}>
                            <h3>JOIN OUR JEWELLERY SAVINGS SCHEMES</h3>
                            <h3>Shop online@ www.kuberalaxmijewellery.com</h3>
                        </div>

                    </div>
                </div>
                <div className="button_box_small">
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
                <Footer />
            </div>
        )
    }
}