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



export default class stockComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: [],
            success: false,
            branchname: '',
            category: [
                { name: 'Kuberan Jewel Saving Scheme', code: 'Kuberan Jewel Saving Scheme' },
                { name: 'Dhanlaskmi Jewel Saving Scheme', code: 'Dhanlaskmi Jewel Saving Scheme' },
            ],
            schema: [],
            scheme_number: '',
            scheme_name: '',
            mobile: '',
            customer_id: '',
            customer_name: '',
            total_month: '',
            due_date: '',
            remark: '',
            client_id: '',
            client_name: '',
            client_data: [],
            errors: {},

            weight_type: '',
            weight: 0,
            payment_mode: 'Cash',
            payModeList: Init.PaymentMod,
        }

        this.getSchema()
        this.getCustomer()
        this.getClient()
        this.onChange = this.onChange.bind(this)
        this.onChangeClient = this.onChangeClient.bind(this)
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

    onChangeClient(e) {
        let count = 0;
        // console.log(this.state.userData)
        for (let data of this.state.client_data) {
            console.log(count)
            if ((data.acode === e.target.value) || (data.aname === e.target.value)) {
                count++
                this.setState({
                    client_id: data.acode,
                    client_name: data.aname,
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
                client_id: '',
                client_name: '',
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
                console.log(response['data']['data'])
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

    getClient() {
        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            type: 'agent-list'
        }

        customerService.getCustomer(data).then((response) => {
            if (response['data']['status'] === 1) {

                // toast.success(response['data']['message']);
                this.setState({
                    client_data: response['data']['data'],
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
                scheme_number,
                scheme_name,
                mobile,
                customer_id,
                customer_name,
                total_month,
                due_date,
                remark,
                client_id,
                client_name,
                category,
                payment_mode,
                weight
            } = this.state

            let data = {
                login_user: localStorage.getItem("username"),
                branch: localStorage.getItem("Branch"),
                scheme_number: scheme_number,
                scheme_name: scheme_name['sname'],
                mobile: mobile ? mobile : '.',
                customer_id: customer_id ? customer_id : '.',
                customer_name: customer_name ? customer_name : '.',
                total_month: total_month ? total_month : '0',
                due_date: due_date ? due_date : '0',
                client_id: client_id ? client_id : '.',
                client_name: client_name ? client_name : '.',
                remark: remark ? remark : '.',
                category: category ? category : '.',
                payment_mode: payment_mode ? payment_mode : '.',
                weight: weight?weight:0
            }

            schemaService.saveSchemaRegistration(data).then((response) => {
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
            })
        }
    }

    validate() {
        let scheme_number = this.state.scheme_number;
        let scheme_name = this.state.scheme_name;
        let mobile = this.state.mobile;
        let customer_id = this.state.customer_id;
        let customer_name = this.state.customer_name;
        let total_month = this.state.total_month;
        let due_date = this.state.due_date;
        let category = this.state.category;
        let client_id = this.state.client_id;
        let client_name = this.state.client_name;
        let errors = {};
        let isValid = true;

        if (!scheme_name) {
            isValid = false;
            errors["scheme_name"] = "Select Scheme Name.";
        }

        if (!mobile) {
            isValid = false;
            errors["mobile"] = "Enter Mobile Number.";
        }

        if (!customer_id) {
            isValid = false;
            errors["customer_id"] = "Enter Customer ID.";
        }

        if (!customer_name) {
            isValid = false;
            errors["customer_name"] = "Enter Customer Name.";
        }

        if (!total_month) {
            isValid = false;
            errors["total_month"] = "Enter Total Month.";
        }

        if (!due_date) {
            isValid = false;
            errors["due_date"] = "Enter Due Days.";
        }

        if (!category) {
            isValid = false;
            errors["category"] = "Select Category.";
        }

        if (!client_id) {
            isValid = false;
            errors["client_id"] = "Enter Client Id.";
        }

        if (!client_name) {
            isValid = false;
            errors["client_name"] = "Enter Client Name.";
        }


        this.setState({
            errors: errors
        });

        return isValid;
    }

    handleChangeCategory = (newValue) => {
        console.log(newValue)
        this.setState({
            scheme_name: newValue.value,
            weight_type: newValue.value['category'],
            due_date: newValue.value['due'],
            total_month: newValue.value['months'],
            category: newValue.value['category'],
        })
    };

    clearForm = () => {
        this.setState({
            scheme_number: '',
            scheme_name: '',
            mobile: '',
            customer_id: '',
            customer_name: '',
            total_month: '',
            due_date: '',
            client_id: '',
            client_name: '',
            remark: '',
            weight:0,
            weight_type:''
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
                        <h3 className="pageTitle">Scheme Register </h3>
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
                                <div style={fontLebel}>Scheme Name</div>
                                <div style={{ width: '100%' }}>
                                    <Dropdown style={{ width: '100%' }} value={this.state.scheme_name} options={this.state.schema} onChange={this.handleChangeCategory} optionLabel="name" placeholder="Select Scheme Name" />
                                    <div className="textDanger">{this.state.errors.scheme_name}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Total Months</div>
                                <div style={{ width: '100%' }}>
                                    <InputText id="username1" placeholder="Enter Total Month" aria-describedby="username1-help" style={{ width: '100%' }} name="total_month" value={this.state.total_month} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.total_month}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Due Amount</div>
                                <div style={{ width: '100%' }}>
                                    <InputText id="username1" placeholder="Enter Due Amount" aria-describedby="username1-help" style={{ width: '100%' }} name="due_date" value={this.state.due_date} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.due_date}</div>
                                </div>
                            </div>
                        </div>



                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Mobile Number</div>
                                <div style={{ width: '100%' }}>
                                    <input list="mobile" placeholder="Enter Customer Name" style={{ width: '100%', border: '1px solid silver', borderRadius: '3px', padding: '10px 10px' }} name="mobile" id="browser" value={this.state.mobile} onChange={this.onChangeLotNumber} />
                                    <datalist id="mobile" >
                                        {
                                            this.state.userData.map((item, index) => {
                                                return <option key={index} value={item.mobile} />;
                                            })
                                        }
                                    </datalist>
                                    {/* <InputText id="username1" placeholder="Enter Mobile Number" aria-describedby="username1-help" style={{width:'100%'}} name="mobile" value={this.state.mobile} onChange={this.onChangeLotNumber}/> */}
                                    <div className="textDanger">{this.state.errors.mobile}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Customer ID</div>
                                <div style={{ width: '100%' }}>
                                    <input list="customer_id" placeholder="Enter Customer Name" style={{ width: '100%', border: '1px solid silver', borderRadius: '3px', padding: '10px 10px' }} name="customer_id" id="browser" value={this.state.customer_id} onChange={this.onChangeLotNumber} />
                                    <datalist id="customer_id" >
                                        {
                                            this.state.userData.map((item, index) => {
                                                return <option key={index} value={item.cid} />;
                                            })
                                        }
                                    </datalist>
                                    {/* <InputText id="username1" placeholder="Enter Customer ID" aria-describedby="username1-help" style={{width:'100%'}} name="customer_id" value={this.state.customer_id} onChange={this.onChangeLotNumber}/> */}
                                    <div className="textDanger">{this.state.errors.customer_id}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Customer Name</div>
                                <div style={{ width: '100%' }}>
                                    <input list="customer_name" placeholder="Enter Customer Name" style={{ width: '100%', border: '1px solid silver', borderRadius: '3px', padding: '10px 10px' }} name="customer_name" id="browser" value={this.state.customer_name} onChange={this.onChangeLotNumber} />
                                    <datalist id="customer_name" >
                                        {
                                            this.state.userData.map((item, index) => {
                                                return <option key={index} value={item.cname} />;
                                            })
                                        }
                                    </datalist>
                                    {/* <InputText id="username1" placeholder="Enter Customer Name" aria-describedby="username1-help" style={{width:'100%'}} name="customer_name" value={this.state.customer_name} onChange={this.onChangeLotNumber}/> */}
                                    <div className="textDanger">{this.state.errors.customer_name}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Client ID</div>
                                <div style={{ width: '100%' }}>
                                    {/* <InputText id="username1" placeholder="Enter Client ID" aria-describedby="username1-help" style={{width:'100%'}} name="client_id" value={this.state.client_id} onChange={this.onChange}/> */}
                                    <input list="client_id" placeholder="Enter Client Id" style={{ width: '100%', border: '1px solid silver', borderRadius: '3px', padding: '10px 10px' }} name="client_id" id="browser" value={this.state.client_id} onChange={this.onChangeClient} />
                                    <datalist id="client_id" >
                                        {
                                            this.state.client_data.map((item, index) => {
                                                return <option key={index} value={item.acode} />;
                                            })
                                        }
                                    </datalist>
                                    <div className="textDanger">{this.state.errors.client_id}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Client Name</div>
                                <div style={{ width: '100%' }}>
                                    <input list="client_name" placeholder="Enter Client Name" style={{ width: '100%', border: '1px solid silver', borderRadius: '3px', padding: '10px 10px' }} name="client_name" id="browser" value={this.state.client_name} onChange={this.onChangeClient} />
                                    <datalist id="client_name" >
                                        {
                                            this.state.client_data.map((item, index) => {
                                                return <option key={index} value={item.aname} />;
                                            })
                                        }
                                    </datalist>
                                    {/* <InputText id="username1" placeholder="Enter Client Name" aria-describedby="username1-help" style={{width:'100%'}} name="client_name" value={this.state.client_name} onChange={this.onChange}/> */}
                                    <div className="textDanger">{this.state.errors.client_name}</div>
                                </div>
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