import React, { Component } from 'react'
import '../../assets/css/print.css';
import '../../assets/css/style.css';
import { Button } from '@material-ui/core';
import { Link } from "react-router-dom";
import Moment from 'react-moment';

//pages
import Menu from '../common/menu'
import Footer from '../common/footer'

import Logo from '../../assets/img/skj_logo.png';

import ReactToPrint from 'react-to-print';

import PrintIcon from '@material-ui/icons/Print';

import NumberFormat from 'react-number-format';

import GoldsmithService from '../../service/goldsmith/goldsmithService'

//object of services
const goldsmithService     = new GoldsmithService();

var converter = require('number-to-words');

export default class printComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: {},
            success : false,
            data    : [],
            from    : props.location.state.from,
            to      : props.location.state.to,
            gname   : props.location.state.gname,
            opn_bc : 0,
            close_bc : 0,
            dat :''
        }
        // console.log(props.location.state)
        this.getBillDeatils(props.location.state.from, props.location.state.to, props.location.state.gname)
    }

    async getBillDeatils(from, to , gname) {
        await this.state.from
        await this.state.to
        await this.state.gname

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            from    : from,
            to      : to,
            gname   : gname
        }

        goldsmithService.getSupplierDayBook(data).then((response) => {
            console.log(response)
            if (response['data']['status'] === 1) {
                let temp = response['data']['data']['open_blc'];
                response['data']['data']['daybook'].map( data=> {
                    temp  = Number(temp) +  Number(data['credit']) -  Number(data['debit'])
                    data['closing'] = temp
                })
                this.setState({
                    data: response['data']['data']['daybook'],
                    opn_bc: response['data']['data']['open_blc'],
                    dat: response['data']['data']['dat'],
                    close_bc : temp
                });
            } else {
                this.toast.show({ severity: 'error', summary: 'Message', detail: 'No Data Found..!!', life: 3000 });
            }
        }).catch((error) => {
            console.log(error)
            // this.toast.show({ severity: 'error', summary: 'Message', detail: 'Check Connection', life: 3000 });
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
                                <div style={{ width: '10%' }}>
                                    <img src={Logo} alt="Company logo" style={{ width: '95%' }} />
                                </div>
                                <div style={{ textAlign: 'center', width: '90%' }}>
                                    <span style={{ fontWeight: '700', fontSize: '25px', textAlign: 'center' }}>
                                       {shopName}
                                    </span><br />
                                    <span style={{ fontSize: '16px', textAlign: 'center' }}>
                                        <br />
                                        Statement for: {this.state.gname} <br /><br />
                                        (<Moment format="DD/MM/YYYY">{this.state.from}</Moment> to <Moment format="DD/MM/YYYY">{this.state.to}</Moment>)
                                        <br /><br />
                                    </span>
                                </div>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '20%' }}>
                                    
                                </div>
                                <div style={{ width: '80%', padding:'0px 20px', textAlign: 'right' }}>
                                     Opening Weight on {this.state.dat}:  {this.state.opn_bc?this.state.opn_bc:0.000}
                                </div>
                            </div>
                            <table style={{ width: '100%', marginTop: '10px' }}>
                                <tr className="heading">
                                    <th style={{ borderTop: '2px solid black', borderBottom: '2px solid black' }}>S.No</th>
                                    <th style={{ borderTop: '2px solid black', borderBottom: '2px solid black' }}>Date</th>
                                    <th style={{ borderTop: '2px solid black', borderBottom: '2px solid black' }}>Ref.No</th>
                                    <th style={{ borderTop: '2px solid black', borderBottom: '2px solid black',textAlign: 'left' }}>Particulars</th>
                                    <th style={{ borderTop: '2px solid black', borderBottom: '2px solid black',textAlign: 'right' }}>Issue</th>
                                    <th style={{ borderTop: '2px solid black', borderBottom: '2px solid black',textAlign: 'right' }}>Receipt</th>
                                    <th style={{ borderTop: '2px solid black', borderBottom: '2px solid black',textAlign: 'right',paddingRight:'10px' }}>Closing Weight</th>
                                </tr>
                                {this.state.data.map((data) => (
                                    <tr>
                                        <td style={{ textAlign: 'center' }}>{data.sno}</td>
                                        <td style={{ textAlign: 'center' }}>{data.dat}</td>
                                        <td style={{ textAlign: 'center' }}>{data.billno}</td>
                                        <td style={{ textAlign: 'left' }}>{data.part}</td>
                                        <td style={{ textAlign: 'right' }}>{data.debit}</td>
                                        <td style={{ textAlign: 'right' }}>{data.credit}</td>
                                        <td style={{ textAlign: 'right',paddingRight:'10px' }}>{data.closing}</td>
                                    </tr>
                                ))}
                              
                                {/* <tr className="for-label">
                                    <td colspan="6"></td>
                                    <th colspan="4" style={{ fontSize: '15px' }}>For SRI DEVI JEWELLERS</th>
                                </tr>
                                <tr>
                                    <td colspan="3">E& O.E</td>
                                    <th colspan="3">Thank You! Visit Again!</th>
                                </tr> */}
                            </table>
                            <br></br>
                            <div style={{ display: 'flex', borderTop: '2px solid black',padding: '10px 0px'}}>
                                <div style={{ width: '20%' }}>
                                    
                                </div>
                                <div style={{ width: '80%', padding:'0px 20px', textAlign: 'right' }}>
                                     Clossing Weight on {this.state.dat}:  {this.state.close_bc?this.state.close_bc:0.000}
                                </div>
                            </div>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                            <br></br>
                        </div>
                    </div>
                </div>
                <div className="button_box_small_print">
                    <div className="row">
                        <div className="col-6">
                            <Link to="/supplier-book" className="Link">
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