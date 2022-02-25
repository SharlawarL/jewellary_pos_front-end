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
import { apiUrl } from '../../config/inint';

//service 
import ItemService from '../../service/item/itemService'
//service 
import SchemaService from '../../service/schema/schemaService'

//object of services
const schemaService = new SchemaService();
//object of services
const itemService = new ItemService();

export default class stockComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: {},
            success: false,

            scheme_data: [],
            remark :'',
            scheme_status :'',
            amount_paid :'',
            scheme_number :'',
            bill_number :'',
            due_date :'',

            mobile: '',
            cid: '',
            cname: '',
            acode:'',
            aname:'',
            
            today : '',
            payment_mode :'Cash',
            payModeList: [
                { name:'Cash/Card', value:'Cash/Card'},
                { name:'Online', value:'Online'},
                { name:'Others', value:'Others'}                
            ],
            errors: {}
        }

        this.getLastSchema()
        this.getSchema()
        this.onChange = this.onChange.bind(this)
        this.onChangeClient = this.onChangeClient.bind(this)
        this.submitForm = this.submitForm.bind(this)

    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onChangeClient(e){
        let count = 0;
        // console.log(this.state.userData)
        for (let data of this.state.scheme_data) {
            console.log(count)
            if (data.sno === e.target.value) {
                console.log(data)
                count++
                this.setState({
                    scheme_number: data.sno,
                    amount_paid: data.paid,
                    due_date: data.dues,
                    mobile: data.mobile,
                    cid: data.cid,
                    cname: data.cname,
                    acode: data.acode,
                    aname: data.aname,
                })

            }

        }

        console.log(count)
        if (count == 0) {
            this.setState({
                client_id     : '',
                client_name   : '',
            })
        }
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    getLastSchema()
    {
        let data = {
            username : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch")
        }

        schemaService.getLastSchema(data).then((response) =>{
            console.log(response)
            if (response['data']['status'] === 1) {
               this.setState({
                    bill_number: response.data.data.last_id_pay,
                    today: response.data.data.today,
               })
            } else {
                // this.toast.show({severity:'error', summary: 'Message', detail:'No result found!', life: 3000});
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    }


    getSchema()
    {
        let data = {
            username : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch")
        }

        schemaService.getSchemaEntry(data).then((response) =>{
            console.log(response)
            if (response['data']['status'] === 1) {
               this.setState({
                    scheme_data: response.data.data
               })
            } else {
                // this.toast.show({severity:'error', summary: 'Message', detail:'No result found!', life: 3000});
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    }


    getLastItem() {

        // let data = { login_user: localStorage.getItem("username"), branch: localStorage.getItem("Branch") }

        // itemService.getLastItem(data).then((response) => {
        //     if (response['data']['status'] === 1) {
        //         this.setState({
        //             last_id: response['data']['data']['last_id'],
        //             last_item: response['data']['data']['item_no']
        //         })
        //     }
        // }).catch((error) => {
        //     console.log(error)
        // })

    }


    submitForm(e) {
        e.preventDefault()

        if (this.validate()) {
            const {
                bill_number,
                today,
                scheme_number,
                scheme_name,
                due_date,
                amount_paid,
                payment_mode,
                remark,
                mobile,
                cid,
                cname,
                acode,
                aname
            } = this.state

            let data = {
                login_user: localStorage.getItem("username"),
                branch: localStorage.getItem("Branch"),
                bill_number: bill_number?bill_number:'.',
                today: today?today:'.',
                scheme_number: scheme_number?scheme_number:'.',
                scheme_name:scheme_name?scheme_name:'',
                due_date: due_date,
                amount_paid: amount_paid,
                payment_mode: payment_mode,
                remark: remark,
                mobile: mobile,
                cid: cid,
                cname: cname,
                acode: acode,
                aname: aname,
            }

            

            schemaService.saveSchemaPay(data).then((response) => {
                if (response['data']['status'] === 1) {
                    this.toast.show({severity:'success', summary: 'Message', detail:response['data']['message'], life: 3000});
                    // toast.success(response['data']['message']);
                    // NotificationManager.success('Success message', response['data']['message']);
                    this.clearForm()
                    this.setState({
                        success: true,
                    });
                } else {
                    this.toast.show({severity:'error', summary: 'Message', detail:response['data']['message'], life: 3000});
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
        let due_date = this.state.due_date;
        let amount_paid = this.state.amount_paid;
        let payment_mode = this.state.payment_mode;
        let errors = {};
        let isValid = true;

        if (!scheme_number) {
            isValid = false;
            errors["scheme_number"] = "Enter Scheme Number.";
        }

        if (!due_date) {
            isValid = false;
            errors["due_date"] = "Enter No of Dues.";
        }

        if (!amount_paid) {
            isValid = false;
            errors["amount_paid"] = "Enter Paid Amount.";
        }

        if (!payment_mode) {
            isValid = false;
            errors["payment_mode"] = "Select Pay Mode.";
        }

        this.setState({
            errors: errors
        });

        return isValid;
    }

    handleChangeCategory = (newValue) => {
        console.log(newValue)
        this.setState({
            selectedCategory: newValue
        })
    };

    handleChangeItemType = (newValue) => {
        console.log(newValue)
        this.setState({
            selecteditemType: newValue
        })
    };

    handleChangePriceType = (newValue) => {
        console.log(newValue)
        this.setState({
            selectedPriceType: newValue
        })
    };

    handleChangePurity = (newValue) => {
        console.log(newValue)
        this.setState({
            selectedPurity: newValue
        })
    };

    clearForm = () =>{
        this.setState({
            remark :'',
            scheme_status :'',
            amount_paid :'',
            scheme_number :'',
            due_date :'',
            payment_mode :'',
        })
    }


    render() {

        const fontLebel ={padding:'10px 0px 10px', fontSize:'13px'}

        // if (this.state.success) {
        //     return <Redirect to='/item-summary'></Redirect>
        // }

        return (
            <div className="body">
                <Toast ref={(el) => this.toast = el} />
                {/* <ToastContainer />
                <NotificationContainer /> */}
                <Menu loggedIn={this.state.loggedIn} />

                <form onSubmit={this.submitForm} autoComplete="off">
                <div className="button_box_small_title">
                    <h3 className="pageTitle">Scheme Payment Register </h3>
                </div>


                <div className="continerSmallBox">

                    {/* <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Bill Number</div>
                            <InputText id="username1" placeholder="Enter Bill Number" aria-describedby="username1-help" style={{width:'100%'}} name="bill_number" value={this.state.bill_number} disabled onChange={this.onChange}/>
                        </div>
                    </div> */}

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Date </div>
                            <InputText id="username1" placeholder="Date" aria-describedby="username1-help" style={{width:'100%'}} name="today" value={this.state.today} disabled onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Scheme Number</div>
                            
                            <div style={{width:'100%'}}>
                                    <input list="scheme_number" placeholder="Enter Scheme Number" style={{width:'100%',border:'1px solid silver',borderRadius:'3px',padding:'10px 10px'}} name="scheme_number" id="browser" value={this.state.scheme_number}  onChange={this.onChangeClient} />
                                        <datalist id="scheme_number" >
                                            {  
                                                this.state.scheme_data.map((item,index)=>{
                                                    return  <option key={index} value={item.sno} />;
                                                })
                                            }
                                        </datalist>
                                {/* <InputText id="username1" placeholder="Enter Scheme Number" aria-describedby="username1-help" style={{width:'100%'}} name="scheme_number" value={this.state.scheme_number} onChange={this.onChange}/> */}
                                <div className="textDanger">{this.state.errors.scheme_number}</div>
                            </div>
                        </div>
                    </div>

                    {this.state.scheme_number?
                    <>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Mobile</div>
                            
                            <div style={{width:'100%'}}>
                                    <input list="mobile" placeholder="Enter Mobile Number" style={{width:'100%',border:'1px solid silver',borderRadius:'3px',padding:'10px 10px'}} name="mobile" id="browser" value={this.state.mobile}  onChange={this.onChangeClient} />
                                        <datalist id="mobile" >
                                            {  
                                                this.state.scheme_data.map((item,index)=>{
                                                    return  <option key={index} value={item.mobile} />;
                                                })
                                            }
                                        </datalist>
                                {/* <InputText id="username1" placeholder="Enter Scheme Number" aria-describedby="username1-help" style={{width:'100%'}} name="scheme_number" value={this.state.scheme_number} onChange={this.onChange}/> */}
                                <div className="textDanger">{this.state.errors.scheme_number}</div>
                            </div>
                        </div>
                    </div>


                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Customer ID</div>
                            
                            <div style={{width:'100%'}}>
                                    <input list="cid" placeholder="Enter Customer Id" style={{width:'100%',border:'1px solid silver',borderRadius:'3px',padding:'10px 10px'}} name="cid" id="browser" value={this.state.cid}  onChange={this.onChangeClient} />
                                        <datalist id="cid" >
                                            {  
                                                this.state.scheme_data.map((item,index)=>{
                                                    return  <option key={index} value={item.cid} />;
                                                })
                                            }
                                        </datalist>
                                {/* <InputText id="username1" placeholder="Enter Scheme Number" aria-describedby="username1-help" style={{width:'100%'}} name="scheme_number" value={this.state.scheme_number} onChange={this.onChange}/> */}
                                <div className="textDanger">{this.state.errors.scheme_number}</div>
                            </div>
                        </div>
                    </div>


                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Customer Name</div>
                            
                            <div style={{width:'100%'}}>
                                    <input list="cname" placeholder="Enter Customer Name" style={{width:'100%',border:'1px solid silver',borderRadius:'3px',padding:'10px 10px'}} name="cname" id="browser" value={this.state.cname}  onChange={this.onChangeClient} />
                                        <datalist id="cname" >
                                            {  
                                                this.state.scheme_data.map((item,index)=>{
                                                    return  <option key={index} value={item.cname} />;
                                                })
                                            }
                                        </datalist>
                                {/* <InputText id="username1" placeholder="Enter Scheme Number" aria-describedby="username1-help" style={{width:'100%'}} name="scheme_number" value={this.state.scheme_number} onChange={this.onChange}/> */}
                                <div className="textDanger">{this.state.errors.scheme_number}</div>
                            </div>
                        </div>
                    </div>
                    </>:''}


                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>No of Dues</div>
                            
                            <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter No of Dues" aria-describedby="username1-help" style={{width:'100%'}} name="due_date" value={this.state.due_date} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.errors.due_date}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Paid Amount</div>
                            
                            <div style={{width:'100%'}}>
                            <InputText id="username1" placeholder="Enter Paid Amount" aria-describedby="username1-help" style={{width:'100%'}} name="amount_paid" value={this.state.amount_paid} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.errors.amount_paid}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Payment Mode</div>
                            <div style={{width:'100%'}}>
                                <input list="payment_mode" placeholder="Enter Payment Mode" style={{width:'100%',border:'1px solid silver',borderRadius:'3px',padding:'10px 10px'}} name="payment_mode" id="browser" value={this.state.payment_mode}  onChange={this.onChange} />
                                        <datalist id="payment_mode" >
                                            {  
                                                this.state.payModeList.map((item,index)=>{
                                                    return  <option key={index} value={item.name} />;
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
                            <InputText id="username1" placeholder="Enter Remarks" aria-describedby="username1-help" style={{width:'100%'}} name="remark" value={this.state.remark} onChange={this.onChange}/>
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