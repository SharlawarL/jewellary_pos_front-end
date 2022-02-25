import React,{ Component , useEffect, useRef } from 'react'
import '../../assets/css/style.css';
import {  TextField, Button , Input  } from '@material-ui/core';
import {   Link   } from "react-router-dom";
import Select from 'react-select'
import { autoComplete } from 'primereact/autocomplete';

//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Ip from 'ip'
import moment from "moment";

//prime
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { PrimeIcons } from 'primereact/api';
import { Dropdown } from 'primereact/dropdown';
import 'primeflex/primeflex.css';

//service
import SalesService from '../../service/sales/salesService' 
import StockService from '../../service/stock/stockService'
import ItemService from '../../service/item/itemService'
import CustomerService from '../../service/customer/customerService'

//json
import { apiUrl } from '../../config/inint';

//object of services
const salesService = new SalesService();
const itemService = new ItemService();
const stockService = new StockService();
const customerService = new CustomerService();

const publicIp = require("react-public-ip");

export default class stockComponent extends Component {

    constructor(props){
        super(props)
        this.state ={
            loggedIn : props.loggedIn,
            userData : localStorage.getItem('username'),
            ipAddress: '',
            success : false,
            branchname:'',
            selectedCategory:'',
            selectedItemType:'',
            lot_no:0,
            ItemNumber :'',
            tableData: [],
            gross_weight:'',
            loss_weight:'',
            Stock_no:'',
            isClearable: false,
            first: 0,
            action:'',
            StockTotal:0,
            totalQty            : 0,
            totalGrossWeight    : 0,
            totalLessWeight     : 0,
            totalNetWeight      : 0,
            totalItems          : 0,
            totalRate:0,
            afterDes:0,

            payMode : Init.PaymentMod,
            payModList : [
                { name: 'Credit', code: 'Credit' },
                { name: 'Cash', code: 'Cash' }
            ],

            type:{ name: 'Gold', code: 'Gold' },
            typeList : [
                { name: 'Gold', code: 'Gold' },
                { name: 'Diamond', code: 'Diamond' },
                { name: 'Platinum', code: 'Platinum' },
                { name: 'Silver', code: 'Silver' }
            ],
            purity: { name: '916 BIS HM', code: '916 BIS HM' },
            purityList:[
                { name: '916 BIS HM', code: '916 BIS HM' },
                { name: '22 CT', code: '22 CT' },
                { name: 'Others', code: 'Others' },
            ],

            billno:0,
            todaydate : moment().format("DD-MM-YYYY hh:mm:ss"),

            //item data
            selectedItem:[],
            item_code: '',
            rate:'',
            weight:'',
            net_weight:'',
            westage:'',
            making_charges:'',
            qty:'',
            price:0,
            stack:'',
            stackOld:'',

            // old itemdata
            selectedOldItem:[],
            nameOld:'',
            qtyOld  :'',
            weightOld : '',
            rateOld:'',
            amountOld:'',
            qtyOldTotal : 0,
            weightOldTotal:0,
            amountOldTotal:0,

            // customer data
            user_data:[],
            customer_data: [],
            customer_mobile_data: [],
            customer_id: '',
            mobile:'',
            customer_name:'',
            address:'',
            remark:'',
            reference:'',
            filterStack:{},

            modelBox: false,
            cashReceived: 0,
            balance:0
        }

        this.getLastStock()
        this.getStock()
        this.getCustomer()
       
        this.onChange = this.onChange.bind(this)
        this.handleEnter = this.handleEnter.bind(this)

        this.openModel = this.openModel.bind(this)
        
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this)
        this.submitStock = this.submitStock.bind(this)
        this.submitOldIem = this.submitOldIem.bind(this)
      }


      onChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    openModel(e){
        this.setState({
            modelBox : !this.state.modelBox
        })
    }
 

    handleEnter = (event) => {
        // console.log(event.keyCode)
        // if (event.keyCode === 13) {
        //     const form = event.target.div;
        //     const index = Array.prototype.indexOf.call(form, event.target);
        //     form.elements[index + 1].focus();
        //     event.preventDefault();
        // }
    }
    


    getLastStock(){

        let data = {login_user : localStorage.getItem("username") , branch: localStorage.getItem("Branch")}

        salesService.getLastSales(data).then((response) =>{
            if(response['data']['status'] === 1)
            {
                this.setState({
                    ipAddress : response['data']['data']['ip'],
                    billno : response['data']['data']['billno'],
                    lot_no : response['data']['data']['lot_no'],
                    item_no : response['data']['data']['item_no']
                })
            } 
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }

    getStock = () => {

        let data = {login_user : localStorage.getItem("username")}
    
        salesService.getStocks(data).then((response) =>{
            console.log(response)
            if(response['data']['status'] ===1)
            {
                response['data']['data'].map((data) =>{
                    return(
                    data['code'] = data.entry_no,
                    data['name'] = data.lot_no + " " + data.item_name
                    )
                })
                this.setState({
                    Stock :  response['data']['data']
                })
            }  else {
              
          }
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    
      };

      getCustomer = () => {

        let data = {login_user : localStorage.getItem("username")}
    
        customerService.getCustomer(data).then((response) =>{
            console.log(response)
            if(response['data']['status'] ===1)
            {
                for(let data of response['data']['data'])
                {
                    let temp = {name: data['cid'],code: data['cid'],cname: data['cname'],mobile:data['mobile'],cid:data['cid'],add1:data['add1']}
                    let tempMobile = {name: data['mobile'],code: data['mobile'],cname: data['cname'],mobile:data['mobile'],cid:data['cid'],add1:data['add1']}
                    this.state.customer_data.push(temp)
                    this.state.customer_mobile_data.push(tempMobile)
                }
                this.setState({
                    user_data : response['data']['data'],
                })
                
            }  else {
              
          }
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    
      };

      submitStock(e){
        e.preventDefault()

        if((this.state.qty != 0) && (this.state.item_no != 0))
        {
            const { 
                lot_no,
                name, 
                item_no,
                rate,
                weight,
                net_weight,
                qty,
                making_charges,
                westage,
            } = this.state

            let data = {
                login_user : localStorage.getItem("username"), 
                branch : localStorage.getItem("Branch"),
                lot_no : lot_no,
                name: name,
                item_code: item_no,
                rate: rate?rate:0,
                weight: weight?weight:0,
                net_weight: net_weight?net_weight:0,
                westage: westage?westage:0,
                making_charges: making_charges?making_charges:0,
                qty: qty?qty:0,
            }
            
            console.log(data)
            
            this.state.selectedItem.push(data)
            this.setState({
                selectedItem: this.state.selectedItem,
                isClearable : true,
                item_code: 0,
                rate: 0,
                weight: 0,
                net_weight: 0,
                westage: 0,
                making_charges: 0,
                qty: 0,
            })
            console.log(this.state.selectedItem)
        } else {
            alert("Please select items")
        }
    }

    submitOldIem(e){
        e.preventDefault()

        if((this.state.qtyOld != 0) && (this.state.amountOld != 0))
        {
            const {
                nameOld,
                type,
                purity,
                qtyOld,
                weightOld,
                rateOld,
                amountOld
            } = this.state

            let data = {
                nameOld     : nameOld?nameOld:0,
                type        :type?type.name:'',
                purity      : purity?purity.name:'',
                qtyOld      : qtyOld?qtyOld:0,
                weightOld   : weightOld?weightOld:0,
                rateOld     : rateOld?rateOld:0,
                amountOld   : amountOld?amountOld:0,
            }
            
            console.log(data)
            
            this.state.selectedOldItem.push(data)
            // this.setState({
            //     selectedOldItem: this.state.selectedOldItem,
            //     nameOld     : '',
            //     qtyOld      : 0,
            //     weightOld   : 0,
            //     rateOld     : 0,
            //     amountOld   : 0,
            // })
            console.log(this.state.selectedOldItem)
        } else {
            alert("Please select items")
        }
    }

    submitStackForm = (e) =>{
        e.preventDefault()

            const { 
                totalQty,
                totalGrossWeight,
                selectedItem,
                totalItems,
                lot_no,
                item_no,
                rate,
                weight,
                net_weight,
                ipAddress,
                qty,
                billno,
                making_charges,
                westage,
                afterDes,
                totalRate,
                customer_id,
                mobile,
                customer_name,
                address,
                remark,
                reference
            } = this.state

            let data = {
                login_user : localStorage.getItem("username"), 
                branch : localStorage.getItem("Branch"), 
                billno:billno,
                lot_no : lot_no,
                item_no : item_no,
                ipAddress:ipAddress,
                totalQty : totalQty,
                totalGrossWeight : totalGrossWeight,
                totalRate : totalRate,
                descount : '10%',
                afterDes : afterDes,
                selectedItem : JSON.stringify(selectedItem ),
                totalItems: totalItems,
                making_charges:making_charges,
                customer_id: customer_id,
                mobile: mobile,
                customer_name: customer_name,
                address: address,
                remark: remark,
                reference: reference
            }

            salesService.saveSales(data).then((response) =>{
                if(response['data']['status'] === 1)
                {
                    toast.success(response['data']['message']);
                    NotificationManager.success('Success message', response['data']['message']);
                    this.setState({
                        success: true,
                    });
                } else {
                    toast.error(response['data']['message']);
                    this.setState({
                        loggedIn: false,
                    });
                }
            }).catch((error) => {
                console.log(error)
            })
    }


    handleselectedItem = (newValue) => {
        console.log(newValue)
        if(newValue){
            this.setState({
                stack       : newValue.value.name,
                name        : newValue.value.item_name,
                item_code   : newValue.value.item_no,
                rate        : newValue.value.price,
                weight      : 0,
                net_weight  : newValue.value.net_weight,
                westage     : newValue.value.wastage,
                making_charges: newValue.value.making_charge,
                qty         : newValue.value.quan,
            })
        }   
    }

    handleselectedItemOld = (newValue) => {
        console.log(newValue)
        if(newValue){
            this.setState({
                stackOld        :newValue.value.item_name,
                nameOld         : newValue.value.item_name,
                rateOld         : newValue.value.price,
                weightOld       : 0,
                qtyOld          : newValue.value.quan,
            })
        }   
    }

    handleselectedUser = (newValue) => {
        console.log(newValue)
        if(newValue){
            this.setState({
                customer_id     : newValue.value.cid,
                mobile          : newValue.value.mobile,
                customer_name   : newValue.value.cname,
                address         : newValue.value.add1
            })
        }   
    }
    actionBodyTemplate = () => {
        return (
            <Button type="button" icon="pi pi-cog" className="p-button-secondary"></Button>
        );
    }

    searchCountry = (event) => {
        setTimeout(() => {
            console.log(event)
            // let _filteredCountries;
            // if (!event.query.trim().length) {
            //     _filteredCountries = [...this.state.Stock];
            // }
            // else {
            //     _filteredCountries = this.state.Stock.filter((data) => {
            //         return data.name.toLowerCase().startsWith(event.query.toLowerCase());
            //     });
            // }

            // this.setState({
            //     filterStack : _filteredCountries
            // })
            // this.state.filterStack = _filteredCountries;
        }, 250);
    }

    renderFooter = (name) => {
        return (
            <div>
                <div className="p-grid">
                    <div className="p-col-10"></div>
                    <div className="p-col-2">
                        <Button type="submit" className="inputData buttonSecondary" variant="contained" onClick ={this.openModel}>
                            <div className="buttonText"> <i className="pi pi-times"></i> <span className="buttonTextFirstLetter">C</span>lose</div>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    handleselectedType = (newValue) => {
        console.log(newValue)
        if(newValue){
            this.setState({
                type : newValue.value
            })
        }   
    }

    handleselectedPurity = (newValue) => {
        console.log(newValue)
        if(newValue){
            this.setState({
                purity : newValue.value
            })
        }   
    }


    render(){


        console.log(this.state.customer_data)

        if(this.state.success)
        {
            return <Redirect to='/estimate-report'></Redirect>
        }

        var totalStocks         = 0;
        var totalQty            = 0;
        var totalWeight         = 0;
        var totalRate           = 0;
        var totalNetWeight      = 0;

        this.state.selectedItem.map((data) =>{
            totalStocks++
            totalQty            = totalQty + Number(data.qty)
            totalWeight    = totalWeight + Number(data.weight)
            totalRate     = totalRate + Number(data.rate)
        })

        this.state.totalQty = totalQty
        this.state.totalGrossWeight = totalWeight
        this.state.totalRate = totalRate
        this.state.totalItems = totalStocks
        this.state.afterDes = totalRate - (totalRate / 10)

        var qtyOldTotal       = 0;
        var weightOldTotal    = 0;
        var amountOldTotal    = 0;

        this.state.selectedOldItem.map((data) =>{
            qtyOldTotal       = qtyOldTotal + Number(data.qtyOld)
            weightOldTotal    = weightOldTotal + Number(data.weightOld)
            amountOldTotal    = amountOldTotal + Number(data.amountOld)
        })

        this.state.qtyOldTotal = qtyOldTotal
        this.state.weightOldTotal  = weightOldTotal
        this.state.amountOldTotal = amountOldTotal


        const fontIns = {fontSize: '0.6rem',margin:0 };

        const lebelProps = {fontSize: '0.7rem',margin:-7};

        if(this.state.gross_weight && this.state.loss_weight)
        {
            this.state.net_weight = (this.state.gross_weight - this.state.loss_weight)
        }

        var lot_number = this.state.lot_no
        var item_number = this.state.item_no

        this.state.selectedItem.map((data) =>{
            data['lot_no'] = lot_number
            data['item_no'] = item_number
            lot_number++
            item_number++
        })

        const lebelStyle = {fontSize:'12px',color:'black'};

        const cities = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];

        // alert(date)
        return(
            <div className="body">
                <ToastContainer />
                <NotificationContainer/>
                <Menu loggedIn = { this.state.loggedIn} />
                    
                <div className="continerBigBox">
                <div className="p-grid">
                    <div className="p-col-10">
                    <form onSubmit = {this.submitStock} autoComplete="off"> 
                    <br></br>
                            <div className="p-grid" style={{marginTop:'-10px'}}>
                                <div className="p-col-4">
                                    <h3 className="pageTitle" style={{fontSize:'1.5rem',marginTop:'-15px',border:'1px solid silver',padding:'12px 10px', borderRadius:'10px', backgroundColor:'#f8fac8'}}>Point of Sale </h3>
                                </div>
                                <div className="p-col-2 column-input">
                                    
                                        <label htmlFor="username1" style={lebelStyle}>Bll Number</label>
                                        <InputText id="billno" aria-describedby="username1-help" value={this.state.billno} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2"/>
                                    {/* <TextField id="outlined-basic" label="Bll Number" onKeyDown={this.handleEnter}
                                    inputProps={{style: fontIns}}  
                                    InputLabelProps={{style: lebelProps}}     
                                    variant="outlined" className="InputBox" name="billno" value={this.state.billno} onChange ={this.onChange}   /> */}
                                </div>
                                <div className="p-col-2 column-input">
                                        <label htmlFor="username1" style={lebelStyle}>Date</label>
                                        <InputText id="billno" aria-describedby="username1-help" value={this.state.todaydate} onChange ={this.onChange}   className="p-inputtext-sm p-d-block p-mb-2"/>
                                    {/* <TextField id="outlined-basic" label="Date" onKeyDown={this.handleEnter}
                                    inputProps={{style: fontIns}}  
                                    InputLabelProps={{style: lebelProps}}     
                                    variant="outlined" className="InputBox" name="StockTotal" value={this.state.todaydate} onChange ={this.onChange}   /> */}
                                </div>
                                <div className="p-col-2 column-input">
                                    <label htmlFor="username1" style={lebelStyle}>Cashier</label>
                                    <InputText id="billno" aria-describedby="username1-help" value={this.state.userData} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2"/>
                                    {/* <TextField id="outlined-basic" label="Cashier" onKeyDown={this.handleEnter}
                                    inputProps={{style: fontIns}}  
                                    InputLabelProps={{style: lebelProps}}     
                                    variant="outlined" className="InputBox" name="StockTotal" value={this.state.userData} onChange ={this.onChange}   /> */}
                                </div>
                                <div className="p-col-2 column-input">
                                <label htmlFor="username1" style={lebelStyle}>System IP</label>
                                    <InputText id="billno" aria-describedby="username1-help" value={this.state.ipAddress} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2"/>
                                    {/* <TextField id="outlined-basic" label="System IP" onKeyDown={this.handleEnter}
                                    inputProps={{style: fontIns}}  
                                    InputLabelProps={{style: lebelProps}}     
                                    variant="outlined" className="InputBox" name="StockTotal" value={this.state.ipAddress} onChange ={this.onChange}   /> */}
                                </div>
                            </div>
                            <div className="p-grid" style={{marginTop:'0px'}}>
                                <div className="p-col-2 column-input-2">
                                    <span className="p-float-label">
                                        {/* <Dropdown value={this.state.stack} options={this.state.Stock} name="customer_id" onChange ={this.handleselectedItem} style={{width:'100%',padding:'0px',height:'35px'}} filter editable optionLabel="name" /> */}
                                        <label htmlFor="username1" style={lebelStyle}>LotNo (SearchBy name)</label>
                                    </span>
                                    {/* <label htmlFor="username1" style={lebelStyle}>LotNo (SearchBy name)</label> */}
                                    {/* <autoComplete value={this.state.stack} completeMethod={this.searchCity} name="stack" field="name" onChange={this.handleselectedItem} /> */}
                                    {/* <Select onKeyDown={this.handleEnter} placeholder={<div>Select</div>}  onChange={this.handleselectedItem} options={this.state.Stock} isClearable={this.state.isClearable} required/> */}
                                </div>
                                <div className="p-col-1 column-input-2">
                                    <span className="p-float-label">
                                        <InputText id="billno" aria-describedby="username1-help" name="item_code" value={this.state.item_code} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                        <label htmlFor="username1" style={lebelStyle}>Item Code</label>
                                    </span>
                                    
                                    {/* <TextField id="outlined-basic" label="Item Code" onKeyDown={this.handleEnter}
                                    inputProps={{style: fontIns}}  
                                    InputLabelProps={{style: lebelProps}}     
                                    variant="outlined" className="InputBox" name="item_code" value={this.state.item_code} onChange ={this.onChange}   /> */}
                                </div>
                                <div className="p-col-1 column-input-2">
                                    <span className="p-float-label">
                                        <InputText id="billno" aria-describedby="username1-help" name="rate" value={this.state.rate} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                        <label htmlFor="username1" style={lebelStyle}>Rate</label>
                                    </span>
                                    {/* <label htmlFor="username1" style={lebelStyle}>Rate</label>
                                    <InputText id="billno" aria-describedby="username1-help" name="rate" value={this.state.rate} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/> */}
                                    {/* <TextField id="outlined-basic" label="Rate" onKeyDown={this.handleEnter}
                                    inputProps={{style: fontIns}}  
                                    InputLabelProps={{style: lebelProps}}     
                                    variant="outlined" className="InputBox" name="rate" value={this.state.rate} onChange ={this.onChange}   /> */}
                                </div>
                                <div className="p-col-1 column-input-2">
                                    <span className="p-float-label">
                                        <InputText id="billno" aria-describedby="username1-help" name="weight" value={this.state.weight} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                        <label htmlFor="username1" style={lebelStyle}>Weight</label>
                                    </span>
                                    {/* <label htmlFor="username1" style={lebelStyle}>Weight</label>
                                    <InputText id="billno" aria-describedby="username1-help" name="weight" value={this.state.weight} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/> */}
                                    {/* <TextField id="outlined-basic" label="Weight" onKeyDown={this.handleEnter}
                                    inputProps={{style: fontIns}}  
                                    InputLabelProps={{style: lebelProps}}     
                                    variant="outlined" className="InputBox" name="weight" value={this.state.weight} onChange ={this.onChange}   /> */}
                                </div>
                                {/* <div className="p-col-4"></div> */}
                                <div className="p-col-1 column-input-2">
                                    <span className="p-float-label">
                                        <InputText id="billno" aria-describedby="username1-help" name="westage" value={this.state.westage} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                        <label htmlFor="username1" style={lebelStyle}>Westage %</label>
                                    </span>
                                    {/* <label htmlFor="username1" style={lebelStyle}>Westage %</label>
                                    <InputText id="billno" aria-describedby="username1-help" name="westage" value={this.state.westage} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/> */}
                                    {/* <TextField id="outlined-basic" label="Westage %" onKeyDown={this.handleEnter}
                                    inputProps={{style: fontIns}}  
                                    InputLabelProps={{style: lebelProps}}     
                                    variant="outlined" className="InputBox" name="westage" value={this.state.westage} onChange ={this.onChange}   /> */}
                                </div>
                                <div className="p-col-1 column-input-2">
                                    <span className="p-float-label">
                                        <InputText id="billno" aria-describedby="username1-help" name="net_weight" value={this.state.net_weight} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                        <label htmlFor="username1" style={lebelStyle}>Net Weight</label>
                                    </span>
                                    {/* <label htmlFor="username1" style={lebelStyle}>Net Weight</label>
                                    <InputText id="billno" aria-describedby="username1-help" name="net_weight" value={this.state.net_weight} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/> */}
                                    {/* <TextField id="outlined-basic" label="Net Weight" onKeyDown={this.handleEnter}
                                    inputProps={{style: fontIns}}  
                                    InputLabelProps={{style: lebelProps}}     
                                    variant="outlined" className="InputBox" name="net_weight" value={this.state.net_weight} onChange ={this.onChange}   /> */}
                                </div>
                                <div className="p-col-2 column-input-2">
                                    <span className="p-float-label">
                                        <InputText id="billno" aria-describedby="username1-help" name="making_charges" value={this.state.making_charges}  onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                        <label htmlFor="username1" style={lebelStyle}>Making Charges</label>
                                    </span>
                                    {/* <label htmlFor="username1" style={lebelStyle}>Making Charges</label>
                                    <InputText id="billno" aria-describedby="username1-help" name="making_charges" value={this.state.making_charges}  onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/> */}
                                    {/* <TextField id="outlined-basic" label="Making Charges" onKeyDown={this.handleEnter}
                                    inputProps={{style: fontIns}}  
                                    InputLabelProps={{style: lebelProps}}     
                                    variant="outlined" className="InputBox" name="making_charges" value={this.state.making_charges} onChange ={this.onChange}   /> */}
                                </div>
                                <div className="p-col-1 column-input-2">
                                    <span className="p-float-label">
                                    <InputText id="billno" aria-describedby="username1-help" name="qty" value={this.state.qty}  onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                        <label htmlFor="username1" style={lebelStyle}>Qty</label>
                                    </span>
                                    {/* <label htmlFor="username1" style={lebelStyle}>Qty</label>
                                    <InputText id="billno" aria-describedby="username1-help" name="qty" value={this.state.qty}  onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/> */}
                                    {/* <TextField id="outlined-basic" label="Qty" onKeyDown={this.handleEnter}
                                    inputProps={{style: fontIns}}  
                                    InputLabelProps={{style: lebelProps}}     
                                    variant="outlined" className="InputBox" name="qty" value={this.state.qty} onChange ={this.onChange}   /> */}
                                </div>
                                <div className="p-col-2" style={{padding:'15px 10px'}}>
                                    <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                        <div className="buttonText"> 
                                            <i className="pi pi-plus-circle"></i>  <span className="buttonTextFirstLetter" style={{marginTop:'-5px'}}>A</span>dd
                                        </div>
                                    </Button>
                                </div>
                            </div>
                            <div style={{height:'200px'}}>
                            <DataTable state={{ overflowY:'scroll'}}
                            value={this.state.selectedItem} paginator rows={3} first={this.state.first} onPage={(e) => this.setState({ first: e.first})}
                                paginatorTemplate="RowsPerPageDropdown PageLinks FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                emptyMessage="No Item found.">
                                <Column style={{width:'70px'}} field="lot_no" header="Sr_no"></Column>
                                <Column style={{width:'70px'}} field="lot_no" header="Lot_no"></Column>
                                <Column style={{width:'180px'}} field="name" header="Name"></Column>
                                <Column style={{width:'120px'}} field="qty" header="Qty/Pcs"></Column>
                                <Column style={{width:'100px'}} field="weight" header="Weight"></Column>
                                <Column style={{width:'120px'}} field="westage" header="Westage"></Column>
                                <Column style={{width:'150px'}} field="making_charges" header="Making Charges"></Column>
                                <Column style={{width:'120px'}} field="net_weight" header="Total weight"></Column>
                                <Column style={{width:'100px'}} field="rate" header="Rate"></Column>
                                <Column body={this.actionBodyTemplate} headerStyle={{width: '8em', textAlign: 'center'}} bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
                            </DataTable>
                            </div>
                            <div className="p-grid" style={{marginTop:'15px'}}>
                                <div className="p-col-4">
                                    <span className="p-float-label">
                                        <Dropdown value={this.state.customer_id} options={this.state.customer_data} name="customer_id" onChange ={this.handleselectedUser} style={{width:'100%',padding:'0px',height:'35px'}} filter editable optionLabel="name" />
                                        <label htmlFor="username1" style={lebelStyle}>Customer ID</label>
                                    </span>
                                </div>
                                <div className="p-col-4">
                                    <span className="p-float-label">
                                        <Dropdown value={this.state.mobile} options={this.state.customer_mobile_data} name="mobile" onChange ={this.handleselectedUser} style={{width:'100%',padding:'0px',height:'35px'}} filter editable optionLabel="name" />
                                        <label htmlFor="username1" style={lebelStyle}>Mobile Numbe</label>
                                    </span>
                                    {/* <span className="p-float-label">
                                        <InputText id="billno" aria-describedby="username1-help" name="mobile" value={this.state.mobile} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                        <label htmlFor="username1" style={lebelStyle}>Mobile Number</label>
                                    </span> */}
                                    {/* <TextField id="outlined-basic" label="Mobile Number" onKeyDown={this.handleEnter}
                                    inputProps={{style: fontIns}}  
                                    InputLabelProps={{style: lebelProps}}     
                                    variant="outlined" className="InputBox" name="StockTotal" value={this.state.mobile} onChange ={this.onChange}   /> */}
                                </div>
                                <div className="p-col-4">
                                    <span className="p-float-label">
                                        <InputText id="billno" aria-describedby="username1-help" name="customer_name" value={this.state.customer_name} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                        <label htmlFor="username1" style={lebelStyle}>Customer Name</label>
                                    </span>
                                    {/* <TextField id="outlined-basic" label="Customer Name" onKeyDown={this.handleEnter}
                                    inputProps={{style: fontIns}}  
                                    InputLabelProps={{style: lebelProps}}     
                                    variant="outlined" className="InputBox" name="StockTotal" value={this.state.customer_name} onChange ={this.onChange}   /> */}
                                </div>
                                
                            </div>
                    </form>
                    
                                <div className="p-grid" style={{marginTop:'8px'}}>
                                    <div className="p-col-4">
                                            <span className="p-float-label">
                                                <InputText id="billno" aria-describedby="username1-help" name="address" value={this.state.address} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                                <label htmlFor="username1" style={lebelStyle}>Address</label>
                                            </span>
                                        {/* <TextField id="outlined-basic" label="Address" onKeyDown={this.handleEnter}
                                        inputProps={{style: fontIns}}  
                                        InputLabelProps={{style: lebelProps}}     
                                        variant="outlined" className="InputBox" name="StockTotal" value={this.state.address} onChange ={this.onChange}   /> */}
                                    </div>
                                    <div className="p-col-4">
                                        <span className="p-float-label">
                                            <InputText id="billno" aria-describedby="username1-help" name="remark" value={this.state.remark} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                            <label htmlFor="username1" style={lebelStyle}>Remarks</label>
                                        </span>
                                        {/* <TextField id="outlined-basic" label="Remark" onKeyDown={this.handleEnter}
                                        inputProps={{style: fontIns}}  
                                        InputLabelProps={{style: lebelProps}}     
                                        variant="outlined" className="InputBox" name="StockTotal" value={this.state.remark} onChange ={this.onChange}   /> */}
                                    </div>
                                    <div className="p-col-4">
                                        <span className="p-float-label">
                                            <InputText id="billno" aria-describedby="username1-help" name="refernce" value={this.state.refernce} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                            <label htmlFor="username1" style={lebelStyle}>Reference</label>
                                        </span>
                                        {/* <TextField id="outlined-basic" label="Reference" onKeyDown={this.handleEnter}
                                        inputProps={{style: fontIns}}  
                                        InputLabelProps={{style: lebelProps}}     
                                        variant="outlined" className="InputBox" name="StockTotal" value={this.state.refernce} onChange ={this.onChange}   /> */}
                                    </div>
                                </div>
                                <form onSubmit = {this.submitStackForm} autoComplete="off">
                    <div className="p-grid">
                        <div className="p-col-2">
                            <Button type="submit" className="inputData buttonSecondary" variant="contained">
                                <div className="buttonText"> <i className="pi pi-book"></i> <span className="buttonTextFirstLetter">H</span>old</div>
                            </Button>
                        </div>
                        <div className="p-col-2">
                            <Button className="inputData buttonSecondary" variant="contained" onClick ={this.openModel}>
                                <div className="buttonText"> <i className="pi pi-shopping-cart"></i> <span className="buttonTextFirstLetter">O</span>ld Item</div>
                            </Button>
                        </div>
                        <div className="p-col-2">
                            <Button type="submit" className="inputData buttonSecondary" variant="contained">
                                <div className="buttonText"> <i className="pi pi-angle-double-left"></i> <span className="buttonTextFirstLetter">L</span>ast Bil</div>
                            </Button>
                        </div>
                        <div className="p-col-2">
                            <Link to="/Stock-summary" className="Link">
                                <Button type="submit" className="inputData buttonSecondary" variant="contained">
                                    <div className="buttonText"><span className="buttonTextFirstLetter">N</span>ext Bill  <i className="pi pi-angle-double-right"></i> </div>
                                </Button>
                            </Link>
                        </div>
                        <div className="p-col-2">
                            <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">S</span>ave</div>
                            </Button>
                        </div>
                        <div className="p-col-2">
                            <Link to="/Stock-summary" className="Link">
                                <Button type="submit" className="inputData buttonSecondary" variant="contained">
                                    <div className="buttonText"> <i className="pi pi-trash"></i> <span className="buttonTextFirstLetter">C</span>lear</div>
                                </Button>
                            </Link>
                        </div>
                    </div>
                    </form>
                    </div>
                    <div className="p-col-2">
                        <br></br>
                        <div className="p-grid">
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6" style={{padding:'15px 10px'}}>
                                        Pay Mode
                                    </div>
                                    <div className="p-col-6" style={{color:'black',cursor:'pointer'}}>
                                        <Select style={{color:'black'}} placeholder={<div>Cash</div>}  onChange={this.handleselectedItem} options={this.state.payMode} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Total Items
                                    </div>
                                    <div className="p-col-6 right_total_box_title">
                                    : {this.state.totalItems}
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Total Qty
                                    </div>
                                    <div className="p-col-6 right_total_box_title">
                                    : {this.state.totalQty}
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Total Weight
                                    </div>
                                    <div className="p-col-6 right_total_box_title">
                                    : {this.state.totalGrossWeight}
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Sub Total
                                    </div>
                                    <div className="p-col-6 right_total_box_title">
                                    : {this.state.totalRate}
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Making
                                    </div>
                                    <div className="p-col-6 right_total_box_title">
                                    : 0.00
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Old Value
                                    </div>
                                    <div className="p-col-6 right_total_box_title">
                                    : {this.state.amountOldTotal}
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Bill Dis%
                                    </div>
                                    <div className="p-col-6 right_total_box_title">
                                    : 10%
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Bill Dis Amt
                                    </div>
                                    <div className="p-col-6 right_total_box_title">
                                    : {this.state.afterDes}
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Grand Total
                                    </div>
                                    <div className="p-col-6 right_total_box_title">
                                    : 0.00
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Tax Amt
                                    </div>
                                    <div className="p-col-6 right_total_box_title">
                                    : 0.00
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_final_total_box">
                                <div className="p-grid">
                                    <div className="p-col-7">
                                        <h3 style={{padding:'0px',margin: '0px'}}>Net Total</h3>
                                    </div>
                                    <div className="p-col-5">
                                    : {this.state.afterDes - this.state.amountOldTotal} /-
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_final_total_box">
                                <div className="p-grid">
                                    <div className="p-col-7">
                                        <h3 style={{padding:'0px',margin: '0px'}}> Cash Received</h3>
                                    </div>
                                    <div className="p-col-5" style={{padding:'10px 2px'}}>
                                    : <InputText style={{width:'90%'}} name="cashReceived" value={this.state.cashReceived} onChange ={this.onChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_final_total_box">
                                <div className="p-grid">
                                    <div className="p-col-7">
                                        <h3 style={{padding:'0px',margin: '0px'}}>Balance </h3>
                                    </div>
                                    <div className="p-col-5" style={{padding:'10px 2px'}}>
                                    : {this.state.cashReceived?(this.state.cashReceived - this.state.afterDes - this.state.amountOldTotal):(this.state.afterDes - this.state.amountOldTotal)} /-
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                    
                </div>
                <Footer />

                {/* Dialog box */}
                <Dialog header="Old Items Entry" visible={this.state.modelBox}  modal style={{ width: '80vw',height:'80vh',backgroundColor: 'white' }}  onHide={this.openModel} footer={this.renderFooter('displayBasic')}
                    draggable={true} resizable={false} baseZIndex={1}>
                        <div>
                        <form onSubmit = {this.submitOldIem} autoComplete="off">
                        <div className="p-grid" style={{marginTop:'0px'}}>
                                <div className="p-col-2 column-input-2">
                                    <span className="p-float-label">
                                        <Dropdown value={this.state.stackOld} options={this.state.Stock} name="customer_id" onChange ={this.handleselectedItemOld} style={{width:'100%',padding:'0px',height:'35px'}} filter editable optionLabel="name" />
                                        <label htmlFor="username1" style={lebelStyle}>Item Number</label>
                                    </span>
                                </div>
                                <div className="p-col-2 column-input-2">
                                    <span className="p-float-label">
                                        <Dropdown name="type" value={this.state.type}  options={this.state.typeList} onChange ={this.handleselectedType} style={{width:'100%',padding:'0px',height:'35px'}} filter editable optionLabel="name" />
                                        <label htmlFor="username1" style={lebelStyle}>Type</label>
                                    </span>
                                </div>
                                <div className="p-col-2 column-input-2">
                                    <span className="p-float-label">
                                        <Dropdown name="purity" value={this.state.purity}  options={this.state.purityList} onChange ={this.handleselectedPurity} style={{width:'100%',padding:'0px',height:'35px'}} filter editable optionLabel="name" />
                                        <label htmlFor="username1" style={lebelStyle}>Purity</label>
                                    </span>
                                </div>
                                <div className="p-col-1 column-input-2">
                                    <span className="p-float-label">
                                        <InputText id="billno" aria-describedby="username1-help" name="qtyOld" value={this.state.qtyOld} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                        <label htmlFor="username1" style={lebelStyle}>PCS( Qty )</label>
                                    </span>
                                
                                </div>

                                <div className="p-col-1 column-input-2">
                                    <span className="p-float-label">
                                        <InputText id="billno" aria-describedby="username1-help" name="weightOld" value={this.state.weightOld} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                        <label htmlFor="username1" style={lebelStyle}>Weight</label>
                                    </span>
                                </div>
                                <div className="p-col-1 column-input-2">
                                    <span className="p-float-label">
                                        <InputText id="billno" aria-describedby="username1-help" name="rateOld" value={this.state.rateOld} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                        <label htmlFor="username1" style={lebelStyle}>Rate / grm</label>
                                    </span>
                                </div>
                                <div className="p-col-1 column-input-2">
                                    <span className="p-float-label">
                                    <InputText id="billno" aria-describedby="username1-help" name="amountOld" value={this.state.amountOld}  onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                        <label htmlFor="username1" style={lebelStyle}>Amount</label>
                                    </span>
                                </div>
                                <div className="p-col-2" style={{padding:'15px 10px'}}>
                                    <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                        <div className="buttonText"> 
                                            <i className="pi pi-plus-circle"></i>  <span className="buttonTextFirstLetter" style={{marginTop:'-5px'}}>A</span>dd
                                        </div>
                                    </Button>
                                </div>
                        </div>
                        </form>
                            <div style={{height:'200px'}}>
                            <DataTable state={{ overflowY:'scroll'}}
                            value={this.state.selectedOldItem} paginator rows={3} first={this.state.first} onPage={(e) => this.setState({ first: e.first})}
                                paginatorTemplate="RowsPerPageDropdown PageLinks FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                emptyMessage="No Item found.">
                                <Column style={{width:'200px'}} field="nameOld" header="nameOld"></Column>
                                <Column style={{width:'120px'}} field="type" header="Type"></Column>
                                <Column style={{width:'200px'}} field="purity" header="Purity"></Column>
                                <Column style={{width:'120px'}} field="qtyOld" header="PCS Qty"></Column>
                                <Column style={{width:'120px'}} field="weightOld" header="Weight"></Column>
                                <Column style={{width:'150px'}} field="rateOld" header="Rate / grm"></Column>
                                <Column style={{width:'120px'}} field="amountOld" header="Amount"></Column>
                                <Column body={this.actionBodyTemplate} headerStyle={{width: '8em', textAlign: 'center'}} bodyStyle={{textAlign: 'center', overflow: 'visible'}} />
                            </DataTable>
                            </div>
                            <div className="p-grid" style={{marginTop:'0px'}}>
                                <div className="p-col-4 column-input-2">
                                    <span className="p-float-label">
                                        <InputText id="billno" aria-describedby="username1-help" name="item_code" value={this.state.qtyOldTotal} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                        <label htmlFor="username1" style={lebelStyle}>Qty</label>
                                    </span>
                                </div>
                                <div className="p-col-4 column-input-2">
                                    <span className="p-float-label">
                                        <InputText id="billno" aria-describedby="username1-help" name="item_code" value={this.state.weightOldTotal} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                        <label htmlFor="username1" style={lebelStyle}>Weight</label>
                                    </span>
                                </div>
                                <div className="p-col-4 column-input-2">
                                    <span className="p-float-label">
                                        <InputText id="billno" aria-describedby="username1-help" name="item_code" value={this.state.amountOldTotal} onChange ={this.onChange}  className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox"/>
                                        <label htmlFor="username1" style={lebelStyle}>Amount</label>
                                    </span>
                                </div>
                            </div>
                        </div>
                </Dialog>
            </div>
        )
    }
}