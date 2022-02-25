import React, { Component } from 'react'
import '../../assets/css/style.css';
import { TextField, Button } from '@material-ui/core';
import { Link } from "react-router-dom";
import Select from 'react-select'
import { Dialog } from 'primereact/dialog';
import PrintIcon from '@material-ui/icons/Print';
//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import 'primeflex/primeflex.css';
import { Toast } from 'primereact/toast';

import { Calendar } from 'primereact/calendar';

// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Redirect } from 'react-router-dom';

import Init from '../../config/Inint.json'
//service 
import SchemaService from '../../service/schema/schemaService'
import CustomerService from '../../service/customer/customerService'

//object of services
const schemaService = new SchemaService();
const customerService = new CustomerService();

export default class orderEntryComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: [],
            success: false,
            branchname: '',
            orderType: [
                { name: 'New Order', code: 'New Order' },
                { name: 'Alteration', code: 'Alteration' },
            ],

            entno: 0,
            dat: '',
            part: '',
            billno:'',
            bdate: '',
            hsn: '',
            weight: '',
            alloywt:'',
            alloyhsn: '',
            rate: '',
            amt:'',
            gst:'',
            gstrs: '',
            tds:'',
            tdsrs:'',
            total:'',
            jobw:'',

            errors: {},

            printModelBox: false,

            payModeList: Init.PaymentMod,
        }

        // this.getSchema()
        // this.getCustomer()
        this.onChange = this.onChange.bind(this)
        this.onChangeLotNumber = this.onChangeLotNumber.bind(this)
        this.submitForm = this.submitForm.bind(this)

    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    openModelPrint(e) {
        this.setState({
            printModelBox: !this.state.printModelBox
        })
    }

    onChangeLotNumber(e) {
        let count = 0;
        // console.log(this.state.userData)
        for (let data of this.state.userData) {
            console.log(count)
            if ((data.mobile === e.target.value) || (data.cid === e.target.value) || (data.cname === e.target.value)) {
                count++
                this.setState({
                    mobile: data.mobile,
                    customer_id: data.cid,
                    customer_name: data.cname,
                })

            }
            // else {
            //     this.setState({
            //         stack       : 0,
            //         name        : '',
            //         item_code   : 0,
            //         rate        : 0,
            //         weight      : 0,
            //         net_weight  : 0,
            //         westage     : 0,
            //         making_charges: 0,
            //         qty         : 1,
            //         qty_total   : 0,
            //         price_type  : 0,
            //         hsn_code    : 0,
            //         price       : 0
            //     })
            // }

        }

        console.log(count)
        if (count == 0) {
            this.setState({
                mobile: '',
                customer_id: '',
                customer_name: '',
            })
        }
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    getSchema() {
        let data = {
            username: localStorage.getItem("username")
        }

        schemaService.getSchemaMaster(data).then((response) => {
            if (response['data']['status'] === 1) {
                // toast.success(response['data']['message']);

                response['data']['data'].map(data => {
                    data['name'] = data['sname']
                    data['code'] = data['sname']
                })
                this.setState({
                    schema: response['data']['data'],
                });
                // console.log(response['data']['data'])
            } else {
                // toast.error(response['data']['message']);
                this.setState({
                    loggedIn: false,
                });
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }


    getCustomer() {
        let data = {
            login_user: localStorage.getItem("username")
        }

        customerService.getCustomer(data).then((response) => {
            if (response['data']['status'] === 1) {
                // toast.success(response['data']['message']);

                this.setState({
                    userData: response['data']['data'],
                });
                // console.log(response['data']['data'])
            } else {
                // toast.error(response['data']['message']);
                this.setState({
                    loggedIn: false,
                });
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }


    submitForm(e) {
        e.preventDefault()

        if (this.validate()) {

        const {
            entno,
            dat,
            jobw,
            part,
            billno,
            bdate,
            hsn,
            weight,
            alloywt,
            alloyhsn,
            rate,
            amt,
            gst,
            gstrs,
            tds,
            tdsrs,
            total
        } = this.state

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            type: 'purchase-entry',
            dat : dat,
            jobw: jobw,
            part: part,
            billno: billno,
            bdate : bdate,
            hsn: hsn,
            weight: weight,
            alloywt: alloywt,
            alloyhsn: alloyhsn,
            rate: rate,
            amt: amt,
            gst: gst,
            gstrs: gstrs,
            tds: tds,
            tdsrs: tdsrs,
            total:total
        }

        console.log(data)

        schemaService.savePurchaseEntry(data).then((response) => {
            if (response['data']['status'] === 1) {
                
                this.setState({
                    entno: response['data']['last']
                });
                this.toast.show({ severity: 'success', summary: 'Message', detail: response['data']['message'], life: 3000 });
                // toast.success(response['data']['message']);
                // NotificationManager.success('Success message', response['data']['message']);
                this.setState({
                    entno: response['data']['last'],
                    printModelBox: true
                });
                console.log(this.state.entno)

                this.clearForm();
            } else {
                this.toast.show({ severity: 'error', summary: 'Oops', detail: response['data']['message'], life: 3000 });
                // toast.error(response['data']['message']);
                this.setState({
                    loggedIn: false,
                });
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }
    }


    validate() {
        let dat = this.state.dat;
        let part = this.state.part;
        let billno = this.state.billno;
        let bdate = this.state.bdate;
        let hsn = this.state.hsn;
        let weight = this.state.weight;
        let alloywt = this.state.alloywt;
        let alloyhsn = this.state.alloyhsn;
        let rate = this.state.rate;
        let amt = this.state.amt;
        let gst = this.state.gst;
        let gstrs = this.state.gstrs;
        let tds = this.state.tds;
        let tdsrs = this.state.tdsrs;
        let total = this.state.total;
        let jobw = this.state.jobw

        let errors = {};
        let isValid = true;

        if (!jobw) {
            isValid = false;
            errors["jobw"] = "Enter Job Worker";
        }
        if (!dat) {
            isValid = false;
            errors["dat"] = "Select Date.";
        }

        if (!part) {
            isValid = false;
            errors["part"] = "Enter Part Name.";
        }

        if (!billno) {
            isValid = false;
            errors["billno"] = "Enter Bill number.";
        }

        if (!bdate) {
            isValid = false;
            errors["bdate"] = "Enter Bill Date.";
        }

        if (!hsn) {
            isValid = false;
            errors["hsn"] = "Enter HSN.";
        }

        if (!weight) {
            isValid = false;
            errors["weight"] = "Enter Weight.";
        }

        if (!alloywt) {
            isValid = false;
            errors["alloywt"] = "Enter Alloy Weight.";
        }

        if (!alloyhsn) {
            isValid = false;
            errors["alloyhsn"] = "Enter Alloy HSN.";
        }

        if (!rate) {
            isValid = false;
            errors["rate"] = "Enter Rate.";
        }

        if (!amt) {
            isValid = false;
            errors["amt"] = "Select Amount.";
        }

        if (!gst) {
            isValid = false;
            errors["gst"] = "Select GST.";
        }
        if (!gstrs) {
            isValid = false;
            errors["gstrs"] = "Select GST Rs.";
        }
        if (!amt) {
            isValid = false;
            errors["amt"] = "Select Amount.";
        }
        if (!tds) {
            isValid = false;
            errors["tds"] = "Select TDS.";
        }
        if (!tdsrs) {
            isValid = false;
            errors["tdsrs"] = "Select TDS Rs.";
        }

        if (!total) {
            isValid = false;
            errors["total"] = "Select Total.";
        }

        this.setState({
            errors: errors
        });

        return isValid;
    }

    handleChangeCategory = (newValue) => {
        console.log(newValue)
        this.setState({
            order_type: newValue.value
        })
    };

    clearForm = () => {
        this.setState({
            dat: '',
            jobw:'',
            part: '',
            billno:'',
            bdate: '',
            hsn: '',
            weight: '',
            alloywt:'',
            alloyhsn: '',
            rate: '',
            amt:'',
            gst:'',
            gstrs: '',
            tds:'',
            tdsrs:'',
            total:'',
        })
    }


    render() {

        const fontLebel = { padding: '10px 0px 10px', fontSize: '13px' }

        if (this.state.success) {
            return <Redirect to='/home'></Redirect>
        }

        return (
            <div className="body">
                <Toast ref={(el) => this.toast = el} />
                {/* <ToastContainer />
                <NotificationContainer /> */}
                <Menu loggedIn={this.state.loggedIn} />

                <form onSubmit={this.submitForm} autoComplete="off">
                    <div className="button_box_small_title">
                        <h3 className="pageTitle">Purchase Entry </h3>
                    </div>

                    <div className="continerSmallBox">

                        {/* <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Scheme Number</div>
                            <InputText id="username1" placeholder="Enter Scheme Number" aria-describedby="username1-help" style={{width:'100%'}} name="scheme_number" value={this.state.scheme_number} onChange={this.onChange}/>
                        </div>
                    </div> */}
                    {/* <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Ent No</div>
                                
                                <div style={{width:'100%'}}>
                                    <InputText id="username1" placeholder="Entry Number" aria-describedby="username1-help" style={{ width: '100%' }} name="ent_no" value={this.state.ent_no} onChange={this.onChangeLotNumber} />
                                    
                                </div>
                            </div>
                        </div> */}

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Date</div>
                                
                                <div style={{width:'100%'}}>
                                <Calendar id="basic" style={{ width: '100%' }} placeholder="Select Date"  value={this.state.dat} onChange={(e) => this.setState({ dat: e.value })}  showIcon/>
                                    <div className="textDanger">{this.state.errors.dat}</div>
                                </div>
                                {/* <InputText id="username1" type="date" placeholder="Enter Total Month" aria-describedby="username1-help" style={{ width: '100%' }} name="order_date" value={this.state.order_date} onChange={this.onChange} /> */}
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Job Worker</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Job Worker" aria-describedby="username1-help" style={{ width: '100%' }} name="jobw" value={this.state.jobw} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.jobw}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Particulars</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Particulars" aria-describedby="username1-help" style={{ width: '100%' }} name="part" value={this.state.part} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.part}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Bill Number</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Bill Number" aria-describedby="username1-help" style={{ width: '100%' }} name="billno" value={this.state.billno} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.billno}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Bill Date</div>
                                
                                <div style={{width:'100%'}}>
                                <Calendar id="basic" style={{ width: '100%' }} placeholder="Select Bill Date"  value={this.state.bdate} onChange={(e) => this.setState({ bdate: e.value })}  showIcon/>
                                    <div className="textDanger">{this.state.errors.bdate}</div>
                                </div>
                                {/* <InputText id="username1" type="date" placeholder="Enter Total Month" aria-describedby="username1-help" style={{ width: '100%' }} name="order_date" value={this.state.order_date} onChange={this.onChange} /> */}
                            </div>
                        </div>
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>HSN</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter HSN" aria-describedby="username1-help" style={{ width: '100%' }} name="hsn" value={this.state.hsn} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.hsn}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Weight</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Weight" aria-describedby="username1-help" style={{ width: '100%' }} name="weight" value={this.state.weight} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.weight}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Alloy %/Weight</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Alloy %/Weight" aria-describedby="username1-help" style={{ width: '100%' }} name="alloywt" value={this.state.alloywt} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.alloywt}</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Alloy HSN</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Alloy HSN" aria-describedby="username1-help" style={{ width: '100%' }} name="alloyhsn" value={this.state.alloyhsn} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.alloyhsn}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Rate</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Rate" aria-describedby="username1-help" style={{ width: '100%' }} name="rate" value={this.state.rate} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.rate}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Amount</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Amount" aria-describedby="username1-help" style={{ width: '100%' }} name="amt" value={this.state.amt} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.amt}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>GST %</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter GST %" aria-describedby="username1-help" style={{ width: '100%' }} name="gst" value={this.state.gst} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.gst}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>GST Rs</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter GST Rs" aria-describedby="username1-help" style={{ width: '100%' }} name="gstrs" value={this.state.gstrs} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.gstrs}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>TDS %</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter TDS %" aria-describedby="username1-help" style={{ width: '100%' }} name="tds" value={this.state.tds} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.tds}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>TDS Rs</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter TDS Rs" aria-describedby="username1-help" style={{ width: '100%' }} name="tdsrs" value={this.state.tdsrs} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.tdsrs}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Total</div>
                                
                                <div style={{width:'100%'}}>
                                    <InputText id="username1" placeholder="Enter Total" aria-describedby="username1-help" style={{ width: '100%' }} name="total" value={this.state.total} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.total}</div>
                                </div>
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

                <Dialog header="Saved Successfully" visible={this.state.printModelBox} modal style={{ width: '30vw', height: 'auto', backgroundColor: 'white', padding:'20px' }} onHide={this.openModelPrint}
                    draggable={true} resizable={false} baseZIndex={1}>
                    You want to print bill ?
                    <br></br><br></br><br></br>
                    <div className="row">
                        <div className="col-6">
                            <Button type="submit" className="inputData buttonSecondary" variant="contained" onClick={this.openModelPrint}>
                                <div className="buttonText"> <span className="buttonTextFirstLetter"> <i className="pi pi-times-circle"></i> C</span>lose</div>
                            </Button>
                        </div>
                        <div className="col-1"></div>
                        <div className="col-6">
                            <Link
                                to={{
                                    pathname: "/order-print",
                                    state: {
                                        billno: this.state.entno,
                                        back:'/purchase-entry'
                                    }
                                }}

                                className="linkPrimary">
                                <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                    <div className="buttonText"> <PrintIcon className="materialIcon" /> <span className="buttonTextFirstLetter">P</span>rint</div>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}