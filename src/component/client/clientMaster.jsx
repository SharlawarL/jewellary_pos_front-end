import React,{ Component } from 'react'
import '../../assets/css/style.css';
import {  Input, Button, TextField    } from '@material-ui/core';
import {   Link   } from "react-router-dom";


//pages
import Menu from '../common/menu'
import Footer from '../common/footer'


// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { Redirect } from 'react-router-dom';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import 'primeflex/primeflex.css';

//service 
import CustomerService from '../../service/customer/customerService'

//object of services
const customerService = new CustomerService();

export default class stockComponent extends Component {

    constructor(props){
        super(props)
        this.state ={
            loggedIn : props.loggedIn,
            userData : {},
            success : false,
            country: '', 
            region: '',
            customerName:'',
            nomineeName:'',
            address:'',
            area:'',
            pincode :'',
            mobile:'',
            altMobile:'',
            email:'',
            stateCode:'',
            gstVatNumber:'',
            category:'',
            creditLimit:'',
            dueDays:'',
            customerCardNumber:'',
            dateOfBith:'',
            weddingDate:'',
            remark:'',
            ClientCode : 0,

            errors: {},
        }

        this.getCode();
        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)

      }

      onChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    getCode()
    {
        let data = {
            login_user : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch")
        }

        customerService.getAgentCode(data).then((response) =>{
            console.log(response)
            if (response['data']['status'] === 1) {
               this.setState({
                   ClientCode: response.data.data.last_id
               })
            } else {
                this.toast.show({severity:'error', summary: 'Oops', detail:'No result found!', life: 3000});
                // toast.current.show({severity:'error', summary: 'Message', detail:'No result found!', life: 3000});
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    }


      submitForm(e){
        e.preventDefault()
        if(this.validate()){
            const { 
                name,
                customerName, 
                nomineeName, 
                address, 
                area, 
                pincode, 
                mobile, 
                altMobile,
                email, 
                region,
                country,
                stateCode, 
                gstVatNumber ,
                category,
                creditLimit,
                dueDays,
                customerCardNumber,
                dateOfBith,
                weddingDate,
                remark
            } = this.state

            let data = {
                login_user : localStorage.getItem("username"), 
                branch : localStorage.getItem("Branch"), 
                customerName :name, 
                nomineeName :nomineeName, 
                address :address, 
                area :area, 
                pincode :pincode, 
                mobile :mobile, 
                altMobile :altMobile,
                email :email, 
                state: region,
                stateCode :stateCode, 
                country:country,
                earning :gstVatNumber ,
                category :category,
                remark :remark
            }

            customerService.saveCustomerAgent(data).then((response) =>{
                console.log("response")
                if(response['data']['status'] == 1)
                {
                    console.log(response)
                    this.toast.show({severity:'success', summary: 'Message', detail:response['data']['message'], life: 3000});
                    // toast.success(response['data']['message']);
                    // NotificationManager.success('Success message', response['data']['message']);
                    // this.setState({
                    //     success: true,
                    // });
                    this.clearForm()
                    
                } else {
                    this.toast.show({severity:'error', summary: 'Oops', detail:response['data']['message'], life: 3000});
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

    validate(){
        let name = this.state.name;
        let mobile = this.state.mobile;
        let gstVatNumber = this.state.gstVatNumber;
        let errors = {};
        let isValid = true;
        
        if (!name) {
            isValid = false;
            errors["name"] = "Enter Client Name.";
        }

        if (!mobile) {
            isValid = false;
            errors["mobile"] = "Enter Mobile Number.";
        }

        if (!gstVatNumber) {
            isValid = false;
            errors["gstVatNumber"] = "Enter Earning Percent.";
        }
         
        this.setState({
          errors: errors
        });
    
        return isValid;
    }

    handleChangeCategory = (newValue) => {
        this.setState({
            selectedCategory : newValue
        })
    };
    
    handleChangeItemType = (newValue) => {
        this.setState({
            selecteditemType : newValue
        })
    };

    handleChangePriceType = (newValue) => {
        this.setState({
            selectedPriceType : newValue
        })
    };

    selectCountry (val) {
        this.setState({ country: val });
      }
    
      selectRegion (val) {
        this.setState({ region: val });
      }

    clearForm = () =>{
        this.setState({
            name:'',
            country: '', 
            region: '',
            customerName:'',
            nomineeName:'',
            address:'',
            area:'',
            pincode :'',
            mobile:'',
            altMobile:'',
            email:'',
            stateCode:'',
            gstVatNumber:'',
            category:'',
            creditLimit:'',
            dueDays:'',
            customerCardNumber:'',
            dateOfBith:'',
            weddingDate:'',
            remark:''
        })
    }

    render(){

        const fontLebel ={padding:'10px 0px 10px', fontSize:'13px'}

        // if(this.state.success)
        // {
        //     return <Redirect to='/customer-list'></Redirect>
        // }

        const { country, region } = this.state;

        return(
            <div className="body">
                <Toast ref={(el) => this.toast = el} />
                {/* <ToastContainer />
                <NotificationContainer/> */}
                <Menu loggedIn = { this.state.loggedIn} />
                <form onSubmit={this.submitForm} autoComplete="off">
                <div className="button_box_small_title">
                    <h3 className="pageTitle">Client Master </h3>
                </div>

                <div className="continerSmallBox">

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Client Code</div>
                            <InputText id="username1" placeholder="Enter Code" aria-describedby="username1-help" style={{width:'100%'}} name="ClientCode" value={this.state.ClientCode} onChange={this.onChange} disabled />
                            
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Client Name *</div>
                            <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Customer Name" aria-describedby="username1-help" style={{width:'100%'}} name="name" value={this.state.name} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.errors.name}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Address</div>
                            <InputText id="username1" placeholder="Enter Address" aria-describedby="username1-help" style={{width:'100%'}} name="address" value={this.state.address} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Mobile</div>
                            
                            <div style={{width:'100%'}}>
                            <InputText id="username1" placeholder="Enter Mobile" aria-describedby="username1-help" style={{width:'100%'}} name="mobile" value={this.state.mobile} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.errors.mobile}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Alternate number</div>
                            <InputText id="username1" placeholder="Enter Alternate number" aria-describedby="username1-help" style={{width:'100%'}} name="altMobile" value={this.state.altMobile} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Email</div>
                            <InputText id="username1" placeholder="Enter Email" aria-describedby="username1-help" style={{width:'100%'}} name="email" value={this.state.email} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Area / City</div>
                            <InputText id="username1" placeholder="Enter Area / City" aria-describedby="username1-help" style={{width:'100%'}} name="area" value={this.state.area} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Country</div>
                            <CountryDropdown style={{width:'100%',padding:'10px 5px', border:'1px solid silver'}} value={country} onChange={(val) => this.selectCountry(val)} />
                        </div>
                    </div> 

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>State</div>
                            <RegionDropdown
                                style={{width:'100%',padding:'10px 5px', border:'1px solid silver'}}
                                country={country}
                                value={region}
                                onChange={(val) => this.selectRegion(val)} />
                        </div>
                    </div> 

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Category</div>
                            <InputText id="username1" placeholder="Enter Category" aria-describedby="username1-help" style={{width:'100%'}} name="category" value={this.state.category} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Earnings Percentage %</div>
                            
                            <div style={{width:'100%'}}>
                            <InputText id="username1" placeholder="Earnings Percentage %" aria-describedby="username1-help" style={{width:'100%'}} name="gstVatNumber" value={this.state.gstVatNumber} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.errors.gstVatNumber}</div>
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