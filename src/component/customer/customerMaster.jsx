import React,{ Component } from 'react'
import '../../assets/css/style.css';
import {  Input, Button, TextField    } from '@material-ui/core';
import {   Link   } from "react-router-dom";


//pages
import Menu from '../common/menu'
import Footer from '../common/footer'

import { Dropdown } from 'primereact/dropdown';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { Redirect } from 'react-router-dom';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';

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
            country: 'India', 
            region: props.location.state?props.location.state['state']:'',
            name: props.location.state?props.location.state['cname']:'',
            cid: props.location.state?props.location.state['custNo']:'',
            customerName:'',
            nomineeName: props.location.state?props.location.state['nominee']:'',
            address: props.location.state?props.location.state['add1']:'',
            address2: props.location.state?props.location.state['add2']:'',
            address3: props.location.state?props.location.state['add3']:'',
            area: props.location.state?props.location.state['city']:'',
            pincode : props.location.state?props.location.state['pincode']:'',
            mobile: props.location.state?props.location.state['mobile']:'',
            altMobile: props.location.state?props.location.state['phone']:'',
            email: props.location.state?props.location.state['email']:'',
            stateCode: props.location.state?props.location.state['scode']:'',
            gstVatNumber: props.location.state?props.location.state['tax_no']:'',
            category:[
                {name:'B2B', code : 'B2B'},
                {name:'B2C', code : 'B2C'}
            ],
            categoryValue: props.location.state?{name:props.location.state['category'], code:props.location.state['category']}:{},
            creditLimit: props.location.state?props.location.state['climit']:'',
            dueDays: props.location.state?props.location.state['duedays']:'',
            customerCardNumber: props.location.state?props.location.state['duedays']:'',
            dateOfBith: props.location.state?props.location.state['bdate']:'',
            weddingDate: props.location.state?props.location.state['wdate']:'',
            remark: props.location.state?props.location.state['remarks']:'',
            type: props.location.state?props.location.state['type']:'Save',
            updatedData : props.location.state?props.location.state['custList']:{},
            errors: {},
        }
        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)

        if(this.state.updatedData)
        {
            this.updateForm(this.state.updatedData)
        }
      }

      onChange(e){
        this.setState({
            [e.target.name] : e.target.value
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
                address2, 
                address3, 
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
                categoryValue,
                creditLimit,
                dueDays,
                customerCardNumber,
                dateOfBith,
                weddingDate,
                remark,
                type,
                cid
            } = this.state

            let data = {
                login_user : localStorage.getItem("username"), 
                branch : localStorage.getItem("Branch"), 
                customerName :name, 
                nomineeName :nomineeName, 
                address :address, 
                address2 :address2, 
                address3 :address3, 
                area :area, 
                pincode :pincode, 
                mobile :mobile, 
                altMobile :altMobile,
                email :email, 
                state: region,
                stateCode :stateCode, 
                country:country,
                gstVatNumber :gstVatNumber ,
                category :categoryValue?categoryValue.name:'',
                creditLimit :creditLimit,
                dueDays :dueDays,
                customerCardNumber :customerCardNumber,
                dateOfBith : dateOfBith,
                weddingDate :weddingDate,
                remark :remark,
                type : type,
                cid: cid
            }

            customerService.saveCustomer(data).then((response) =>{
                if(response['data']['status'] ===1)
                {
                    this.toast.show({ severity: 'success', summary: 'Success', detail: this.state.type+' Successfully', life: 3000 });
                    // toast.success(response['data']['message']);
                    // NotificationManager.success('Success message', response['data']['message']);
                    this.setState({
                        success: true,
                    });
                    if(this.state.type == 'Save')
                        this.clearForm()
                } else {
                    // toast.error(response['data']['message']);
                    this.toast.show({ severity: 'error', summary: 'Error', detail: response['data']['message'], life: 3000 });
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
        let errors = {};
        let isValid = true;

        // this.setState({
        //     region: '.',
        //     nomineeName:'.',
        //     address:'.',
        //     address2:'.',
        //     address3:'.',
        //     area:'.',
        //     pincode :'.',
        //     altMobile:'.',
        //     email:'.',
        //     stateCode:'.',
        //     gstVatNumber:'.',
        //     category:'.',
        //     creditLimit:'0',
        //     dueDays:'1',
        //     customerCardNumber:'0',
        //     dateOfBith: '0000/00/00',
        //     weddingDate: '00/00/0000',
        //     remark:'.'
        // })
        
        if (!name) {
            isValid = false;
            errors["name"] = "Enter Customer Name.";
        }
          
        if (!mobile) {
          isValid = false;
          errors["mobile"] = "Enter Mobile.";
        }
    
        this.setState({
          errors: errors
        });
    
        return isValid;
    }

   

    selectCountry (val) {
        this.setState({ country: val });
      }
    
      selectRegion (val) {
        this.setState({ region: val });
      }

    updateForm = (data) =>{
        console.log(data['cname'])
        this.setState({
            name            : data['cname'],
            country         : data['cname'],
            region          : data['cname'],
            customerName    :data['cname'],
            nomineeName     :data['nominee'],
            address         :data['add1'],
            area            :data['cname'],
            pincode         :data['cname'],
            mobile          :data['mobile'],
            altMobile       :data['phone'],
            email           :data['email'],
            stateCode       :data['scode'],
            gstVatNumber    :data['cname'],
            category        :data['cname'],
            creditLimit     :data['cname'],
            dueDays         :data['cname'],
            customerCardNumber:data['cname'],
            dateOfBith      :data['bdate'],
            weddingDate     :data['wdate'],
            remark          :data['remarks'],
        })
    }

    clearForm = () =>{
        this.setState({
            name:'',
            country: '', 
            region: '',
            customerName:'',
            nomineeName:'',
            address:'',
            address2:'',
            address3:'',
            area:'',
            pincode :'',
            mobile:'',
            altMobile:'',
            email:'',
            stateCode:'',
            gstVatNumber:'',
            creditLimit:'',
            dueDays:'',
            customerCardNumber:'',
            dateOfBith:'',
            weddingDate:'',
            remark:''
        })
    }

    handleChangeCategory = (e) => {
        console.log(e.target)
        this.setState({
            categoryValue: e.target.value
        })
    };


    render(){

        const fontLebel ={padding:'10px 0px 10px', fontSize:'13px'}

        // if(this.state.success)
        // {
        //     return <Redirect to='/customer-list'></Redirect>
        // }

        const { country, region } = this.state;

        return(
            <div className="body">
                {/* <ToastContainer />
                <NotificationContainer/> */}
                <Toast ref={(el) => this.toast = el} />
                <Menu loggedIn = { this.state.loggedIn} />
                <form onSubmit={this.submitForm} autoComplete="off">
                <div className="button_box_small_title">
                    <h3 className="pageTitle">Customer Master </h3>
                </div>

                <div className="continerSmallBox">

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Customer Name *</div>
                            <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Customer Name" aria-describedby="username1-help" style={{width:'100%'}} name="name" value={this.state.name} onChange={this.onChange}/>
                                <div className="textDanger">{this.state.errors.name}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Nominee Name</div>
                            <InputText id="username1" placeholder="Enter Nominee Name" aria-describedby="username1-help" style={{width:'100%'}} name="nomineeName" value={this.state.nomineeName} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Address 1</div>
                            <InputText id="username1" placeholder="Enter Address 1" aria-describedby="username1-help" style={{width:'100%'}} name="address" value={this.state.address} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Address 2</div>
                            <InputText id="username1" placeholder="Enter Address 2" aria-describedby="username1-help" style={{width:'100%'}} name="address2" value={this.state.address2} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Address 3</div>
                            <InputText id="username1" placeholder="Enter Address 3" aria-describedby="username1-help" style={{width:'100%'}} name="address3" value={this.state.address3} onChange={this.onChange}/>
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
                            <div style={fontLebel}>Pin Code</div>
                            <InputText id="username1" placeholder="Enter Pin Code" aria-describedby="username1-help" style={{width:'100%'}} name="pincode" value={this.state.pincode} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Mobile *</div>
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
                            <div style={fontLebel}>State code</div>
                            <InputText id="username1" placeholder="Enter State code" aria-describedby="username1-help" style={{width:'100%'}} name="stateCode" value={this.state.stateCode} onChange={this.onChange}/>
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

                    
                    
                    <div>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Category </div>
                            <Dropdown style={{width:'100%'}} value={this.state.categoryValue} name="name" options={this.state.category} onChange={this.handleChangeCategory} optionLabel="name" placeholder="Select Category" />
                            {/* <InputText id="username1" placeholder="Enter Category" aria-describedby="username1-help" style={{width:'100%'}} name="category" value={this.state.category} onChange={this.onChange}/> */}
                        </div>
                    </div>
                    </div>

                    <div className="p-grid">    
                        <div className="p-col-12">
                            <div style={fontLebel}>Tax Number</div>
                            <InputText id="username1" placeholder="Enter GST VAT Number" aria-describedby="username1-help" style={{width:'100%'}} name="gstVatNumber" value={this.state.gstVatNumber} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Credit Limit</div>
                            <InputText id="username1" placeholder="Enter Credit Limit" aria-describedby="username1-help" style={{width:'100%'}} name="creditLimit" value={this.state.creditLimit} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Due Days</div>
                            <InputText id="username1" placeholder="Enter Due Days" aria-describedby="username1-help" style={{width:'100%'}} name="dueDays" value={this.state.dueDays} onChange={this.onChange}/>
                        </div>
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Customer Card Number</div>
                            <InputText id="username1" placeholder="Enter Customer Card Number" aria-describedby="username1-help" style={{width:'100%'}} name="customerCardNumber" value={this.state.customerCardNumber} onChange={this.onChange}/>
                        </div>
                    </div>
                    {(this.state.type != 'Update')?
                    <div>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Date of bith </div>
                            <Calendar id="basic"  style={{ width: '100%' }} placeholder="Select Birth Date"  value={this.state.dateOfBith} onChange={(e) => this.setState({ dateOfBith: e.value })} dateFormat="dd/mm/yy" yearRange="1950:2030"  showIcon/>
                            {/* <InputText type="date" style={{width:'100%'}}  name="dateOfBith"  value={this.state.dateOfBith} onChange ={this.onChange}  /> */}
                        </div>  
                    </div>

                    <div className="p-grid">
                        <div className="p-col-12">
                            <div style={fontLebel}>Wedding date </div>
                            <Calendar id="basic" style={{ width: '100%' }} placeholder="Select Wedding Date"  value={this.state.weddingDate} onChange={(e) => this.setState({ weddingDate: e.value })} dateFormat="dd/mm/yy"  showIcon/>
                            {/* <InputText type="date" style={{width:'100%'}}  name="weddingDate"  value={this.state.weddingDate} onChange ={this.onChange}  /> */}
                        </div>
                    </div>
                    </div>:''}
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
                                    <div className="buttonText"> <i className="pi pi-save"></i> 
                                    {(this.state.type != 'Update')?
                                    <span className="buttonTextFirstLetter">Save</span>:
                                    <span className="buttonTextFirstLetter">Update</span>}
                                    </div>
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