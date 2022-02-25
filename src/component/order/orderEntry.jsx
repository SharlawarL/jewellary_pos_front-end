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
            schema: [],
            scheme_number: '',
            scheme_name: '',

            order_type:'',
            order_date:'',
            mobile: '',
            customer_id: '',
            customer_name: '',
            particulars:'',
            total_amt:'',
            paid_amt:'',
            blc_amt:'',
            delivery_date:'',
            remark: '',
            errors: {},
            payment_mode: 'Cash',
            payModeList: Init.PaymentMod,
        }

        this.getSchema()
        this.getCustomer()
        this.onChange = this.onChange.bind(this)
        this.onChangeLotNumber = this.onChangeLotNumber.bind(this)
        this.submitForm = this.submitForm.bind(this)

    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
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
            order_type,
            order_date,
            customer_id,
            customer_name,
            mobile,
            particulars,
            total_amt,
            paid_amt,
            blc_amt,
            delivery_date,
            payment_mode,
            remark
        } = this.state

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            order_type : order_type?order_type.name:'.',
            order_date : order_date?order_date:'.',
            customer_id : customer_id?customer_id:'.',
            customer_name : customer_name?customer_name:'.',
            mobile : mobile?mobile:'.',
            particulars: particulars?particulars:'.',
            total_amt : total_amt?total_amt:'.',
            paid_amt : paid_amt?paid_amt:'.',
            blc_amt: blc_amt?blc_amt:'.',
            delivery_date : delivery_date?delivery_date:'.',
            payment_mode:payment_mode?payment_mode:'Cash',
            remark : remark
        }

        console.log(data)

        schemaService.saveOrderEntry(data).then((response) => {
            if (response['data']['status'] === 1) {
                this.toast.show({ severity: 'success', summary: 'Message', detail: response['data']['message'], life: 3000 });
                // toast.success(response['data']['message']);
                // NotificationManager.success('Success message', response['data']['message']);
                // this.setState({
                //     success: true,
                // });
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
        let order_type = this.state.order_type;
        let order_date = this.state.order_date;
        let customer_id = this.state.customer_id;
        let customer_name = this.state.customer_name;
        let mobile = this.state.mobile;
        let particulars = this.state.particulars;
        let total_amt = this.state.total_amt;
        let paid_amt = this.state.paid_amt;
        let blc_amt = this.state.blc_amt;
        let delivery_date = this.state.delivery_date;
        let errors = {};
        let isValid = true;

        if (!order_type) {
            isValid = false;
            errors["order_type"] = "Select Order Type.";
        }

        if (!order_date) {
            isValid = false;
            errors["order_date"] = "Enter Order Date.";
        }

        if (!customer_id) {
            isValid = false;
            errors["customer_id"] = "Enter Customer ID.";
        }

        if (!customer_name) {
            isValid = false;
            errors["customer_name"] = "Enter Customer Name.";
        }

        if (!mobile) {
            isValid = false;
            errors["mobile"] = "Enter Mobile Number.";
        }

        if (!particulars) {
            isValid = false;
            errors["particulars"] = "Enter Particulars.";
        }

        if (!total_amt) {
            isValid = false;
            errors["total_amt"] = "Enter Total Amount.";
        }

        if (!paid_amt) {
            isValid = false;
            errors["paid_amt"] = "Enter Paid Amount.";
        }

        if (!blc_amt) {
            isValid = false;
            errors["blc_amt"] = "Enter Balance Amount.";
        }

        if (!delivery_date) {
            isValid = false;
            errors["delivery_date"] = "Select Delivery Date.";
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
            order_type : '',
            order_date : '',
            customer_id : '',
            customer_name : '',
            mobile : '',
            particulars: '',
            total_amt : '',
            paid_amt : '',
            blc_amt: '',
            delivery_date : '',
            remark : ''
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
                        <h3 className="pageTitle">Order Entry </h3>
                    </div>

                    <div className="continerSmallBox">

                        {/* <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Scheme Number</div>
                            <InputText id="username1" placeholder="Enter Scheme Number" aria-describedby="username1-help" style={{width:'100%'}} name="scheme_number" value={this.state.scheme_number} onChange={this.onChange}/>
                        </div>
                    </div> */}
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Order Type</div>
                                
                                <div style={{width:'100%'}}>
                                    <Dropdown style={{ width: '100%' }} value={this.state.order_type} options={this.state.orderType} onChange={this.handleChangeCategory} optionLabel="name" placeholder="Select Order Type" />
                                    <div className="textDanger">{this.state.errors.order_type}</div>
                                </div>
                            </div>
                        </div>
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Date</div>
                                
                                <div style={{width:'100%'}}>
                                <Calendar id="basic" style={{ width: '100%' }} placeholder="Select Order Date"  value={this.state.order_date} onChange={(e) => this.setState({ order_date: e.value })}  showIcon/>
                                    <div className="textDanger">{this.state.errors.order_date}</div>
                                </div>
                                {/* <InputText id="username1" type="date" placeholder="Enter Total Month" aria-describedby="username1-help" style={{ width: '100%' }} name="order_date" value={this.state.order_date} onChange={this.onChange} /> */}
                            </div>
                        </div>



                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Customer ID</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Customer ID" aria-describedby="username1-help" style={{ width: '100%' }} name="customer_id" value={this.state.customer_id} onChange={this.onChangeLotNumber} />
                                    <div className="textDanger">{this.state.errors.customer_id}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Customer Name</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Customer Name" aria-describedby="username1-help" style={{ width: '100%' }} name="customer_name" value={this.state.customer_name} onChange={this.onChangeLotNumber} />
                                    <div className="textDanger">{this.state.errors.customer_name}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Mobile Number</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Mobile Number" aria-describedby="username1-help" style={{ width: '100%' }} name="mobile" value={this.state.mobile} onChange={this.onChangeLotNumber} />
                                    <div className="textDanger">{this.state.errors.mobile}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Particulars</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Particulars" aria-describedby="username1-help" style={{ width: '100%' }} name="particulars" value={this.state.particulars} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.particulars}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Total Amount</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Total Amount" aria-describedby="username1-help" style={{ width: '100%' }} name="total_amt" value={this.state.total_amt} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.total_amt}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Paid Amount</div>
                                
                                <div style={{width:'100%'}}>
                                    <InputText id="username1" placeholder="Enter Paid Amount" aria-describedby="username1-help" style={{ width: '100%' }} name="paid_amt" value={this.state.paid_amt} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.paid_amt}</div>
                                </div>
                            </div>
                        </div>


                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Balance Amount</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Balance Amount" aria-describedby="username1-help" style={{ width: '100%' }} name="blc_amt" value={this.state.blc_amt} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.blc_amt}</div>
                                </div>
                            </div>
                        </div>


                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Delivery Date</div>
                                
                                <div style={{width:'100%'}}>
                                    <Calendar id="basic" style={{ width: '100%' }} placeholder="Select Delivery Date"  value={this.state.delivery_date} onChange={(e) => this.setState({ delivery_date: e.value })}  showIcon/>
                                    <div className="textDanger">{this.state.errors.delivery_date}</div>
                                </div>
                                {/* <InputText id="username1" type="date" placeholder="Enter Delivery Date" aria-describedby="username1-help" style={{ width: '100%' }} name="delivery_date" value={this.state.delivery_date} onChange={this.onChange} /> */}
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Payment Mode</div>
                                <div style={{ width: '100%' }}>
                                    <input list="payment_mode" placeholder="Enter Payment Mode" style={{ width: '100%', border: '1px solid silver', borderRadius: '3px', padding: '10px 10px' }} name="payment_mode" id="browser" value={this.state.payment_mode} onChange={this.onChange} />
                                    <datalist id="payment_mode" >
                                        {
                                            this.state.payModeList.map((item, index) => {
                                                return <option key={index} value={item.name} />;
                                            })
                                        }
                                    </datalist>
                                    {/* <InputText id="username1" placeholder="Enter Payment Mode" aria-describedby="username1-help" style={{width:'100%'}} name="payment_mode" value={this.state.payment_mode} onChange={this.onChange}/> */}
                                    <div className="textDanger">{this.state.errors.payment_mode}</div>
                                </div>
                            </div>
                        </div>


                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Remarks</div>
                                <InputText id="username1" placeholder="Enter Remarks" aria-describedby="username1-help" style={{ width: '100%' }} name="remark" value={this.state.remark} onChange={this.onChange} />
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