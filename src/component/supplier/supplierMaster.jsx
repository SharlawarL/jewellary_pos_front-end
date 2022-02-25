import React,{ Component } from 'react'
import '../../assets/css/style.css';
import {  Button    } from '@material-ui/core';

//loader
import LoadingOverlay from 'react-loading-overlay'

//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import { InputText } from 'primereact/inputtext';
import 'primeflex/primeflex.css';
import { Toast } from 'primereact/toast';

// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

//service 
import SupplierService from '../../service/supplier/supplierService'

//object of services
const supplierService = new SupplierService();

export default class stockComponent extends Component {

    constructor(props){
        super(props)
        this.state ={
            loggedIn : props.loggedIn,
            loader: false,
            userData : {},
            success : false,
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
            category:'',
            creditLimit:'',
            dueDays:'',
            customerCardNumber:'',
            dateOfBith:'',
            weddingDate:'',
            remark:'',
            errors: {},
        }
        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)
        this.reset = this.reset.bind(this)

      }

      onChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    reset(){
        this.setState({
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

      submitForm(e){
        e.preventDefault()

        // this.setState({
        //     loader : true
        // })

        if(this.validate()){

            const { 
                customerName,
                address,
                address2,
                address3, 
                area,
                mobile, 
                altMobile,
                email, 
                region,
                country,
                stateCode, 
                gstVatNumber ,
                dueDays,
                remark
            } = this.state

            let data = {
                login_user : localStorage.getItem("username"), 
                branch : localStorage.getItem("Branch"), 
                customerName :customerName,
                address :address, 
                address2 :address2, 
                address3 :address3, 
                area :area, 
                mobile :mobile, 
                altMobile :altMobile,
                email :email, 
                state: region,
                stateCode :stateCode, 
                country:country,
                gstVatNumber :gstVatNumber ,
                dueDays :dueDays,
                remark: remark
            }

            supplierService.saveSupplier(data).then((response) =>{
                if(response['data']['status'] === 1)
                {
                    this.toast.show({ severity: 'info', summary: 'Saved', detail: 'Save Successfuly', life: 3000 });
                    // toast.success(response['data']['message']);
                    // NotificationManager.success('Success message', response['data']['message']);
                    this.setState({
                        success: true,
                        loader : false
                    });
                    this.clearForm();
                } else {
                    this.toast.show({ severity: 'error', summary: 'Error', detail: response['data']['message'], life: 3000 });
                    // toast.error(response['data']['message']);
                    this.setState({
                        loggedIn: false,
                        loader : false
                    });
                }
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    validate(){
        let customerName = this.state.customerName;
        let errors = {};
        let isValid = true;
        
        if (!customerName) {
            isValid = false;
            errors["customerName"] = "Enter Supplier Name.";
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

      clearForm = () => {
          this.setState({
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
        //     return <Redirect to='/supplier-list'></Redirect>
        // }

        const { country, region } = this.state;

        return(
            <div className="body">
                {/* <ToastContainer />
                <NotificationContainer/> */}
                <Toast ref={(el) => this.toast = el} />
                <LoadingOverlay
                    active={this.state.loader}
                    spinner
                    >
                <Menu loggedIn = { this.state.loggedIn} />
                
                <form onSubmit={this.submitForm} autoComplete="off">
                <div className="button_box_small_title">
                    <h3 className="pageTitle">Supplier Master </h3>
                </div>
                <div className="continerSmallBox">

                                <div className="p-grid">
                                    <div className="p-col-12">
                                        <div style={fontLebel}>Supplier Name</div>
                                        <div style={{width:'100%'}}>
                                            <InputText id="username1" placeholder="Enter Supplier Name" aria-describedby="username1-help" style={{width:'100%'}} name="customerName" value={this.state.customerName} onChange={this.onChange}/>
                                            <div className="textDanger">{this.state.errors.customerName}</div>
                                        </div>
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
                                        <div style={fontLebel}>Mobile</div>
                                        <InputText id="username1" placeholder="Enter Mobile" aria-describedby="username1-help" style={{width:'100%'}} name="mobile" value={this.state.mobile} onChange={this.onChange}/>
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

                                <div className="p-grid">
                                    <div className="p-col-12">
                                        <div style={fontLebel}>GST VAT Number</div>
                                        <InputText id="username1" placeholder="Enter GST VAT Number" aria-describedby="username1-help" style={{width:'100%'}} name="gstVatNumber" value={this.state.gstVatNumber} onChange={this.onChange}/>
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
                    </LoadingOverlay>
                <Footer />
            </div>
        )
    }
}