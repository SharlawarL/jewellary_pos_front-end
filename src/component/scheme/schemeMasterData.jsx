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
// import 'react-toastify/dist/ReactToastify.css';
// import { NotificationContainer, NotificationManager } from 'react-notifications';
import { Redirect } from 'react-router-dom';


//service 
import SchemaService from '../../service/schema/schemaService'

//object of services
const schemaService = new SchemaService();

export default class stockComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: {},
            success: false,
            branchname: '',
            category: [
                { name: 'Weight Wise', code: 'Weight Wise' },
                { name: 'Amount Wise', code: 'Amount Wise' },
                { name: 'Lucky Draw', code: 'Lucky Draw' },
            ],
            category_name: '',
            schema:[],
            scheme_number: '',
            scheme_name: '',
            mobile: '',
            customer_id: '',
            customer_name: '',
            total_month: '',
            due_date: '',
            remark: '',

            errors:{}
        }

        this.getSchema()
        // this.getLastSchema()
        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)

    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    


    getSchema()
    {
        let data = {
            username : localStorage.getItem("username")
        }

        schemaService.getSchema(data).then((response) =>{
            if(response['data']['status'] === 1)
            {
                // toast.success(response['data']['message']);
                
                response['data']['data'].map( data =>{
                    data['name'] =  data['sname']
                    data['code'] =  data['sname']
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


    submitForm(e) {
        e.preventDefault()
        if (this.validate()) {

            const {
                scheme_name,
                total_month,
                due_date,
                remark,
                category_name
            } = this.state

            let data = {
                login_user: localStorage.getItem("username"),
                branch: localStorage.getItem("Branch"),
                category: category_name['name'],
                scheme_name : scheme_name,
                total_month : total_month,
                due_month: due_date,
            }

            schemaService.saveSchemaMaster(data).then((response) => {
                if (response['data']['status'] === 1) {
                    this.toast.show({severity:'success', summary: 'Success', detail: response['data']['message'], life: 3000});
                    // toast.success(response['data']['message']);
                    // NotificationManager.success('Success message', response['data']['message']);
                    this.setState({
                        success: true,
                    });
                    this.clearForm()
                } else {
                    this.toast.show({severity:'error', summary: 'Error', detail: response['data']['message'], life: 3000});
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
        let category_name = this.state.category_name;
        let scheme_name = this.state.scheme_name;
        let total_month = this.state.total_month;
        let due_date = this.state.due_date;
        let errors = {};
        let isValid = true;

        if (!category_name) {
            isValid = false;
            errors["category_name"] = "Select Category.";
        }

        if (!scheme_name) {
            isValid = false;
            errors["scheme_name"] = "Enter Scheme Name.";
        }

        if (!total_month) {
            isValid = false;
            errors["total_month"] = "Enter Total Month.";
        }

        if (!due_date) {
            isValid = false;
            errors["due_date"] = "Enter Due Month.";
        }

        

        this.setState({
            errors: errors
        });

        return isValid;
    }

    handleChangeCategory = (newValue) => {
        console.log(newValue)
        this.setState({
            scheme_name: newValue.value
        })
    };

    handleChangeCategoryName = (newValue) => {
        console.log(newValue)
        this.setState({
            category_name: newValue.value
        })
    };

    clearForm = () =>{
        this.setState({
            category_name: '',
            scheme_name: '',
            total_month: '',
            due_date: '',
        })
    }


    render() {

        const fontLebel ={padding:'10px 0px 10px', fontSize:'13px'}

        // if (this.state.success) {
        //     return <Redirect to='/home'></Redirect>
        // }

        return (
            <div className="body">
                <Toast ref={(el) => this.toast = el} />
                {/* <ToastContainer />
                <NotificationContainer /> */}
                <Menu loggedIn={this.state.loggedIn} />

                <form onSubmit={this.submitForm} autoComplete="off">
                <div className="button_box_small_title">
                    <h3 className="pageTitle">Scheme Master </h3>
                </div>

                <div className="continerSmallBox">

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Category Type </div>
                            <div style={{width:'100%'}}>
                                <Dropdown style={{width:'100%'}} value={this.state.category_name} options={this.state.category} onChange={this.handleChangeCategoryName} optionLabel="name" placeholder="Select Category Type" />
                                <div className="textDanger">{this.state.errors.category_name}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Scheme Name</div>
                            <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Scheme Name" aria-describedby="username1-help" style={{width:'100%'}} name="scheme_name" value={this.state.scheme_name} onChange={this.onChange}/>
                                {/* <Dropdown style={{width:'100%'}} value={this.state.scheme_name} options={this.state.schema} onChange={this.handleChangeCategory} optionLabel="name" placeholder="Select Name" /> */}
                                <div className="textDanger">{this.state.errors.scheme_name}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Due Amount</div>
                            <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Due Amount" aria-describedby="username1-help" style={{width:'100%'}} name="due_date" value={this.state.due_date} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.errors.due_date}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Total Month</div>
                            <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Total Month" aria-describedby="username1-help" style={{width:'100%'}} name="total_month" value={this.state.total_month} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.errors.total_month}</div>
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
            </div>
        )
    }
}