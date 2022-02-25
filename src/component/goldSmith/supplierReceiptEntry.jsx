import React, { Component } from 'react'
import '../../assets/css/style.css';
import { Button } from '@material-ui/core';
import { Link } from "react-router-dom";
import { Dialog } from 'primereact/dialog';
import PrintIcon from '@material-ui/icons/Print';
//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import { InputText } from 'primereact/inputtext';
import 'primeflex/primeflex.css';
import { Toast } from 'primereact/toast';

import { Calendar } from 'primereact/calendar';

// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';

import { apiUrl } from '../../config/inint';
//service 
import ItemService from '../../service/item/itemService'
import SupplierService from '../../service/supplier/supplierService'
import GoldsmithService from '../../service/goldsmith/goldsmithService'

//object of services
const goldsmithService     = new GoldsmithService();
const supplierService   = new SupplierService();
const itemService       = new ItemService();

export default class orderEntryComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: [],
            success: false,

            entno: 0,
            dat: '',
            part: '',
            partList : [],
            billno:'',
            bdate: '',
            hsn: '',
            weight: 0.000,
            alloywt: 0.000,
            alloyhsn: '',
            netweight: '',
            supplier :'',
            supplierList : [],
            bill: 1,

            errors: {},

            printModelBox: false,
        }

        this.getSupplierLast()
        this.getSupplier()
        this.getItemList()
        this.onChange = this.onChange.bind(this)
        this.onChangePart = this.onChangePart.bind(this)
        this.onChangeLotNumber = this.onChangeLotNumber.bind(this)
        this.submitForm = this.submitForm.bind(this)

    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onChangePart(e){
        this.setState({
            [e.target.name]: e.target.value
        })
        for (let data of this.state.partList) {
            if(e.target.value == data.iname)
            {
                this.setState({
                    part: e.target.value,
                    hsn : data.hsn_code
                }) 
            }
        }
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

    getSupplierLast() {
        let data = {
            login_user : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            type :'item-report'
        }

        goldsmithService.getSupplierReceiptLast(data).then((response) =>{
            console.log(response)
            if (response['data']['status'] === 1) {
                this.setState({
                    bill: response['data']['data']
                });
                // toast.current.show({severity:'success', summary: 'Message', detail:'Generated data!', life: 3000});
            } else {
                // toast.current.show({severity:'error', summary: 'Message', detail:'No result found!', life: 3000});
            }
      }).catch((error) => {
            console.log(error)
            // toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }


    getSupplier() {
        let data = {
            login_user : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            type :'supplier-list'
        }

        supplierService.getSupplier(data).then((response) =>{
            
            if (response['data']['status'] === 1) {
                this.setState({
                    supplierList: response['data']['data'],
                });

                // this.toast.show({ severity: 'success', summary: 'Message', detail: response['data']['message'], life: 3000 });
            } else {
                // toast.current.show({severity:'error', summary: 'Message', detail:'No result found!', life: 3000});
            }
      }).catch((error) => {
            console.log(error)
            // toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }


    getItemList() {
        let data = {
            login_user : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            type :'item-report'
        }

        itemService.getItem(data).then((response) =>{
            console.log(response)
            if (response['data']['status'] === 1) {
                this.setState({
                    partList: response['data']['data'],
                });

                // toast.current.show({severity:'success', summary: 'Message', detail:'Generated data!', life: 3000});
            } else {
                // toast.current.show({severity:'error', summary: 'Message', detail:'No result found!', life: 3000});
            }
      }).catch((error) => {
            console.log(error)
            // toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }


    submitForm(e) {
        e.preventDefault()

        if (this.validate()) {

        const {
            dat,
            bill,
            supplier,
            part,
            hsn,
            weight,
            alloywt,
            alloyhsn,
        } = this.state

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            bill:bill,
            dat : dat,
            supplier:supplier,
            part: part,
            hsn: hsn,
            weight: weight,
            alloywt: alloywt,
            alloyhsn: alloyhsn,
            netwt: (parseFloat(weight) + parseFloat(alloywt))
        }


        console.log(data)

        goldsmithService.supplierReceiptEntry(data).then((response) => {
            if (response['data']['status'] === 1) {
                
                this.toast.show({ severity: 'success', summary: 'Message', detail: response['data']['message'], life: 3000 });
                this.clearForm();
                this.setState({
                    loggedIn: false,
                });
                
            } else {
                this.toast.show({ severity: 'error', summary: 'Oops', detail: response['data']['message'], life: 3000 });
                
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
        let supplier = this.state.supplier;
        let part = this.state.part;
        let hsn = this.state.hsn;
        let weight = this.state.weight;
        let alloywt = this.state.alloywt;
        let alloyhsn = this.state.alloyhsn;

        let errors = {};
        let isValid = true;

        if (!dat) {
            isValid = false;
            errors["dat"] = "Select Date.";
        }

        if (!supplier) {
            isValid = false;
            errors["supplier"] = "Select Supplier.";
        }

        if (!part) {
            isValid = false;
            errors["part"] = "Select Particular.";
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
            part: '',
            billno:'',
            bdate: '',
            hsn: '',
            weight: '',
            alloywt:'',
            alloyhsn: '',
            netweight: '',
            supplier :'',
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
                        <h3 className="pageTitle">Supplier Receipt Entry</h3>
                    </div>

                    <div className="continerSmallBox">

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Ref. No</div>
                                <div style={{width:'100%'}}>
                                    <InputText id="username1" placeholder="Enter Ref. No" aria-describedby="username1-help" style={{ width: '100%' }} name="bill" value={this.state.bill} onChange={this.onChange} />
                                </div>
                            </div>
                        </div>

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
                                <div style={fontLebel}>Supplier Name</div>
                                
                                <div style={{width:'100%'}}>
                                <input list="browsers" placeholder="Enter Supplier Name" style={{width:'100%',border:'1px solid silver',outline:'1px solid #ced4da',borderRadius:'3px',padding:'10px 10px'}} id="browser" name="supplier" value={this.state.supplier}  onChange={this.onChange} />
                                <datalist id="browsers" >
                                    {  
                                        this.state.supplierList.map((item,index)=>{
                                            return  <option key={index} value={item.cname} />;
                                        })
                                    }
                                </datalist>
                                <div className="textDanger">{this.state.errors.supplier}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Particulars</div>
                                
                                <div style={{width:'100%'}}>
                                <input list="browsers11" placeholder="Enter Particulars" style={{width:'100%',border:'1px solid silver',outline:'1px solid #ced4da',borderRadius:'3px',padding:'10px 10px'}} id="browser" name="part" value={this.state.part}  onChange={this.onChangePart} />
                                <datalist id="browsers11" >
                                    {  
                                        this.state.partList.map((item,index)=>{
                                            return  <option key={index} value={item.iname} />;
                                        })
                                    }
                                </datalist>
                                <div className="textDanger">{this.state.errors.part}</div>
                                </div>
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
                                <div style={fontLebel}>Alloy %</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Alloy %" aria-describedby="username1-help" style={{ width: '100%' }} name="alloyhsn" value={this.state.alloyhsn} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.alloyhsn}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Alloy Weight</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Alloy Weight" aria-describedby="username1-help" style={{ width: '100%' }} name="alloywt" value={this.state.alloywt} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.alloywt}</div>
                                </div>
                            </div>
                        </div>
                        

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Net Weight</div>
                                
                                <div style={{width:'100%'}}>
                                <InputText id="username1" placeholder="Enter Net Weight" aria-describedby="username1-help" style={{ width: '100%' }} name="weight" value={parseFloat(this.state.weight) + parseFloat(this.state.alloywt)} onChange={this.onChange} />
                                    <div className="textDanger">{this.state.errors.netweight}</div>
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