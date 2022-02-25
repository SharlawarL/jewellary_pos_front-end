import React, { Component } from 'react'
import '../../assets/css/print.css';
import '../../assets/css/style.css';
import { Button } from '@material-ui/core';
import { Link } from "react-router-dom";

import Logo from '../../assets/img/skj_logo.png';

import Menu from '../common/menu'
import Footer from '../common/footer'

import ReactToPrint from 'react-to-print';

import PrintIcon from '@material-ui/icons/Print';

import Moment from 'react-moment';

import NumberFormat from 'react-number-format';

//service 
import SchemaService from '../../service/schema/schemaService'

//object of services
const salesService = new SchemaService();
var converter = require('number-to-words');

export default class printComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: {},
            success: false,
            data: [],

            billno: props.location.state.billno,
            back : props.location.state.back,
            
        }
        console.log(props)
        this.getOrderDeatils()
        // this.handlePrintType = this.handlePrintType.bind(this)
    }

    async getOrderDeatils() {

        let data = {
            login_user: localStorage.getItem("username"),
            billno: this.state.billno,
            branch: localStorage.getItem("Branch"),
            type: this.state.back
        }

        salesService.getOrderDetails(data).then((response) => {
            console.log(response)
            if (response['data']['status'] === 1) {
                this.setState({
                    data: response['data']['data'][0],
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


        return (
            <div className="body">
                <Menu loggedIn={this.state.loggedIn} />
                    <div className="continerPrintInvoiceBox card-box">
                        <div style={{ padding: '30px 10px' }} ref={el => (this.componentRef = el)}>
                            <div className="content">
                                <div className="row">
                                    <div style={{ width: '15%' }}>
                                        <img src={Logo} alt="Company logo" style={{ width: '95%' }} />
                                    </div>
                                    <div style={{ textAlign: 'center', width: '70%' }}>
                                        <span style={{ fontWeight: '700', fontSize: '25px', textAlign: 'center' }}>
                                            SRI DEVI JEWELLERS.
                                        </span><br />
                                        <span style={{ fontSize: '16px', textAlign: 'center' , fontFamily:'Helvetica Neue,Helvetica,Roboto,Arial,sans-serif'}}>
                                            Kingstone Park, 19/1,2nd Floor<br />
                                            Puthur High Road<br />
                                            Woraiyur<br />
                                            Trichy-620017<br /><br />
                                        </span>
                                        <span style={{ fontSize: '16px', textAlign: 'center' }}>
                                            GSTN No. :33ABDCS8924N1ZL<br />
                                        </span>
                                        
                                    </div>
                                </div>
                                <hr></hr>
                                <h3 style={{textAlign:'center'}}> LABOUR VOUCHER</h3>
                                <hr></hr>
                                <div className="row">
                                    <div className="col-6">
                                        <h4>Name & Address of Job Worker</h4>
                                        {this.state.data['jobw']}
                                        <br /><br />
                                        <span style={{ fontSize: '16px', textAlign: 'center' }}>
                                            GSTN No. :33ABDCS8924N1ZL<br />
                                        </span>
                                    </div>
                                    <div className="col-1"></div>
                                    <div className="col-6" style={{textAlign:'left',paddingLeft:'40px', borderLeft:'1px solid black'}}>
                                    <h4>Voucher No. {this.state.data['sno']}</h4>
                                    <h4>Date.  
                                    <Moment format="DD/MM/YYYY">
                                        {this.state.data['dat']}
                                        </Moment>
                                        </h4>
                                    </div>
                                </div>
                                <table style={{ width: '100%', marginTop: '10px' }}>
                                    <tr className="heading">
                                        <th style={{ border: '2px solid black' }}>SI.No</th>
                                        <th style={{ border: '2px solid black' }}>Particular</th>
                                        <th style={{ border: '2px solid black'}}>HSN</th>
                                        <th style={{ textAlign: 'center', border: '2px solid black'}}>Weight</th>
                                        <th style={{ textAlign: 'center', border: '2px solid black'}}>Rate</th>
                                        <th style={{ textAlign: 'center', border: '2px solid black'}}>Amount</th>
                                    </tr>
                                    <tr>
                                        <td style={{ borderLeft: '2px solid black', textAlign: 'center',padding:'6px 0px' }}>1</td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}>{this.state.data['part']}</td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}>{this.state.data['hsn']}</td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}>{this.state.data['weight']}</td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}>{this.state.data['rate']}</td>
                                        <td style={{ borderLeft: '2px solid black',borderRight: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}>{this.state.data['amt']}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',borderRight: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',borderRight: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',borderRight: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',borderBottom: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}>Taxable</td>
                                        <td style={{ borderLeft: '2px solid black',borderBottom: '2px solid black',borderTop: '2px solid black',borderRight: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}>{this.state.data['total']}</td>
                                    </tr>
                                    <tr>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',borderBottom: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}>CGST @ 0.0%.</td>
                                        <td style={{ borderLeft: '2px solid black',borderBottom: '2px solid black',borderTop: '2px solid black',borderRight: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',borderBottom: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}>SGST @ 0.0%.</td>
                                        <td style={{ borderLeft: '2px solid black',borderBottom: '2px solid black',borderTop: '2px solid black',borderRight: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                    </tr>
                                    <tr>
                                        <td style={{ borderLeft: '2px solid black',borderBottom: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',borderBottom: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',borderBottom: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',borderBottom: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}></td>
                                        <td style={{ borderLeft: '2px solid black',borderBottom: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}>Net Total</td>
                                        <td style={{ borderLeft: '2px solid black',borderBottom: '2px solid black',borderTop: '2px solid black',borderRight: '2px solid black',textAlign: 'center' ,padding:'6px 0px' }}>{this.state.data['total']}</td>
                                    </tr>

                                </table>
                                <p style={{width: '100%', textAlign:'center'}}>E&O.E Certified that the particulars given above are currect.</p>
                                <p style={{width: '100%', textAlign:'right',fontWeight:'700'}}>For SRI DEVI JEWELLERS.</p>
                                
                                <div className="row">
                                    <div className="col-6">
                                        Signature of Job Worker
                                    </div>
                                    <div className="col-1"></div>
                                    <div className="col-6" style={{textAlign:'right'}}>
                                        Authorised Signatory
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="button_box_small_print">
                    <div className="row">
                        <div className="col-6">
                            <Link to={this.state.back} className="Link">
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