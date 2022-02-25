import React from 'react'
import '../../assets/css/style.css';
import {  Button   } from '@material-ui/core';
import {   Link   } from "react-router-dom";
import Select from 'react-select'

//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import {NotificationContainer} from 'react-notifications';
import Ip from 'ip'
import moment from "moment";

//prime
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import 'primeflex/primeflex.css';

//service
import SalesService from '../../service/sales/salesService'
import CustomerService from '../../service/customer/customerService'

//json
import { apiUrl } from '../../config/inint';

//object of services
const salesService = new SalesService();
const customerService = new CustomerService();

const publicIp = require("react-public-ip");

export default class salesPointComponent extends React.Component {

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
            stock : [],

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
            customer_card:'',
            address:'',
            remark:'',
            reference:'',
            filterStack:{},

            modelBox: false,
            tenderModelBox: false,
            cashReceived: 0,
            balance:0,
            flterData: [],

            tender_cash : 0,
            tender_card : 0,
            tender_other : 0,
            tender_total : 0
        }

        this.getLastStock()
        this.getStock()
        this.getCustomer()
       
        this.onChange = this.onChange.bind(this)
        this.onChangeTender = this.onChangeTender.bind(this)
        this.handleEnter = this.handleEnter.bind(this)

        this.openModel = this.openModel.bind(this)
        this.openModelTender = this.openModelTender.bind(this)
        // this.searchCountry = this.searchCountry.bind(this)
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this)
        this.submitStock = this.submitStock.bind(this)
        this.submitOldIem = this.submitOldIem.bind(this)
      }


    onChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    onChangeTender(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    openModel(e){
        this.setState({
            modelBox : !this.state.modelBox
        })
    }

    openModelTender(e){
        this.setState({
            tenderModelBox : !this.state.tenderModelBox
        })
    }
 

    handleEnter = (event) => {
        console.log(event.keyCode)
        if (event.keyCode === 13) {
            const form = event.target.form;
            const index = Array.prototype.indexOf.call(form, event.target);
            console.log(index)
            if((index == 0) && (this.state.stack))
            {
                form.elements[3].focus();
                event.preventDefault();
            } else 
            if(index < 7)
            {
                form.elements[index + 1].focus();
                event.preventDefault();
            } else {
                form.elements[0].focus();
                event.preventDefault();
                this.submitStock(event)
            }
        }
    }

    handleEnterTender = (event) => {
        console.log(event.keyCode)
        if (event.keyCode === 13) {
            const form = event.target.form;
            const index = Array.prototype.indexOf.call(form, event.target);
            console.log(index) 
            if(index < 2)
            {
                form.elements[index + 1].focus();
                event.preventDefault();
            } else {
                form.elements[0].focus();
                event.preventDefault();
                this.submitStock(event)
            }
        }
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
            // console.log(response)
            if(response['data']['status'] ===1)
            {
                response['data']['data'].map((data) =>{
                    return(
                    data['code'] = data.entry_no,
                    data['name'] = data.lot_no + " " + data.item_name
                    )
                })
                this.setState({
                    stock : response['data']['data']
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
            // console.log(response)
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
        if((this.state.stack != 0) && (this.state.item_no != 0))
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
                stack: '',
                isClearable : true,
                item_code: '',
                rate: '',
                weight: '',
                net_weight: '',
                westage: '',
                making_charges: '',
                qty: '',
            })
            console.log(this.state.selectedItem)
        } else {
            alert("Please select Lot Number or Item")
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
            this.setState({
                selectedOldItem: this.state.selectedOldItem,
                nameOld : '',
                qtyOld      : 0,
                weightOld   : 0,
                rateOld     : 0,
                amountOld   : 0,
            })
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
                ipAddress,
                billno,
                making_charges,
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

            console.log(data)

            if(this.state.selectedItem.length > 0)
            {
                // salesService.saveSales(data).then((response) =>{
                //     if(response['data']['status'] === 1)
                //     {
                //         toast.success(response['data']['message']);
                //         NotificationManager.success('Success message', response['data']['message']);
                //         this.setState({
                //             success: true,
                //         });
                //     } else {
                //         toast.error(response['data']['message']);
                //         this.setState({
                //             loggedIn: false,
                //         });
                //     }
                // }).catch((error) => {
                //     console.log(error)
                // })
            } else {
                alert("Please Select Item")
            }
    }

    itemTemplate = (item) => {
        return (
            <div>
                <div style={{width:'100%'}} onClick={(e)=>this.handleselectedItem(e,item)}>{item.item_name}</div>
            </div>
        );
    }

    handleselectedItem = (event,newValue) => {
        console.log(newValue)
        if(newValue){
            this.setState({
                stack       : newValue.item_name,
                name        : newValue.item_name,
                item_code   : newValue.item_no,
                rate        : newValue.price,
                weight      : 0,
                net_weight  : newValue.net_weight,
                westage     : newValue.wastage,
                making_charges: newValue.making_charge,
                qty         : newValue.quan,
            })
        }  
        const form = event.target.form;
        console.log(form)
        // form.elements[3].focus();
        // event.preventDefault();
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

    searchCountry = (event) =>{
        setTimeout(() => {
            let _filteredCountries;
            if (!event.query.trim().length) {
                _filteredCountries = [...this.state.stock];
            }
            else {
                _filteredCountries = this.state.stock.filter((data) => {
                    return data.item_name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }
            _filteredCountries.map( data =>{
                data['label'] = data.item_name
                data['code'] = data.item_name
            })
            this.setState({
                flterData :_filteredCountries
            });
            // console.log(this.state.flterData)
        }, 250);
    }

    clearForm = () =>{
        this.setState(
            {
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

                selectedOldItem:[],
                nameOld:'',
                qtyOld  :'',
                weightOld : '',
                rateOld:'',
                amountOld:'',
                qtyOldTotal : 0,
                weightOldTotal:0,
                amountOldTotal:0,

                user_data:[],
                customer_data: [],
                customer_mobile_data: [],
                customer_id: '',
                mobile:'',
                customer_name:'',
                customer_card:'',
                address:'',
                remark:'',
                reference:'',
                filterStack:{},

                modelBox: false,
                tenderModelBox: false,
                cashReceived: 0,
                balance:0,
                flterData: [],

                tender_cash : 0,
                tender_card : 0,
                tender_other : 0,
                tender_total : 0

            }
        )
    }
    


    render(){


        // console.log(this.state.customer_data)

        if(this.state.success)
        {
            return <Redirect to='/sales-report'></Redirect>
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

        this.state.tender_total = Number(this.state.tender_cash) + Number(this.state.tender_card) + Number(this.state.tender_other)

        // alert(date)
        return(
            <div className="body">
                <ToastContainer />
                <NotificationContainer/>
                <Menu loggedIn = { this.state.loggedIn} />
                    
                <div className="continerBigBox">
                <div className="p-grid">
                    <div className="p-col-9">
                    <form onSubmit = {this.submitStock} autoComplete="off"> 
                    <br></br>
                            <div className="p-grid" style={{marginTop:'0px'}}>
                                <div className="p-col-4">
                                    <h3 className="pageTitle" style={{fontSize:'1.5rem',marginTop:'-10px',border:'1px solid silver',padding:'5px 10px', borderRadius:'10px', backgroundColor:'#f8fac8'}}>Estimate Master </h3>
                                </div>
                            </div>
                            <div className="p-grid" style={{marginTop:'0px'}}>
                                <div className="p-col-4 column-input">
                                    <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>LotNo (SearchBy name)</label>
                                        <autoComplete value={this.state.stack} suggestions={this.state.flterData} completeMethod={this.searchCountry} dropdown forceSelection
                                         field="item_name" name="stack" onKeyUp={this.handleEnter} itemTemplate={this.itemTemplate}
                                         className="p-d-block InputPrimeBox"/>
                                        {/* <InputText id="username1" value={this.state.stack} name="stack" aria-describedby="username1-help" onChange ={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox"/> */}
                                    </div>
                                </div>
                                <div className="p-col-4 column-input">
                                    <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Item Code</label>
                                        <InputText id="username1" value={this.state.item_code} name="item_code" aria-describedby="username1-help" onChange ={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox"/>
                                    </div>
                                </div>
                                <div className="p-col-2 column-input">
                                    <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Rate</label>
                                        <InputText id="username1" value={this.state.rate} name="rate" aria-describedby="username1-help" onChange ={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox"/>
                                    </div>
                                    
                                </div>
                                <div className="p-col-2 column-input">
                                    <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Weight</label>
                                        <InputText id="username1" value={this.state.weight} name="weight" aria-describedby="username1-help" onChange ={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox"/>
                                    </div>
                                </div>
                                <div className="p-col-4 column-input"></div>
                                <div className="p-col-2 column-input">
                                    <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Westage %</label>
                                        <InputText id="username1" value={this.state.westage} name="westage" aria-describedby="username1-help" onChange ={this.onChange}  onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox"/>
                                    </div>
                                </div>
                                <div className="p-col-2 column-input">
                                    <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Net Weight</label>
                                        <InputText id="username1" value={this.state.net_weight} name="net_weight" aria-describedby="username1-help" onChange ={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox"/>
                                    </div>
                                </div>
                                <div className="p-col-2 column-input">
                                    <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Making Charges</label>
                                        <InputText id="username1" value={this.state.making_charges} name="making_charges" aria-describedby="username1-help" onChange ={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox"/>
                                    </div>
                                </div>
                                <div className="p-col-2 column-input">
                                    <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Qty</label>
                                        <InputText id="username1" value={this.state.qty} name="qty" aria-describedby="username1-help" onChange ={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox"/>
                                    </div>
                                </div>
                            </div>
                            <div style={{height:'180px',border:'2px solid #227bce',overflowX:'scroll'}}>
                                <div style={{width:'1000px',marginTop: '-5px'}}>
                            {/* <ScrollBox style={{height: '200px',width:'100%'}} axes="1500px"> */} 
                                <DataTable state={{ overflowY:'scroll'}}
                                value={this.state.selectedItem} rows={3} first={this.state.first} onPage={(e) => this.setState({ first: e.first})}
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
                            {/* </ScrollBox> */}
                            </div>
                            </div>
                    
                    <div className="p-grid" style={{marginTop:'10px'}}>
                        <div className="p-col-3 column-input">
                            <div className="p-field">
                                <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Customer ID</label>
                                <InputText id="username1" aria-describedby="username1-help" value={this.state.customer_id} name="customer_id" onChange ={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox"/>
                            </div>
                        </div>
                        <div className="p-col-3 column-input">
                            <div className="p-field">
                                <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Card Number</label>
                                <InputText id="username1" aria-describedby="username1-help" value={this.state.customer_card} name="customer_card" onChange ={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox"/>
                            </div>
                        </div>
                        <div className="p-col-3 column-input">
                            <div className="p-field">
                                <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Customer Mobile</label>
                                <InputText id="username1" aria-describedby="username1-help" value={this.state.mobile} name="mobile" onChange ={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox"/>
                            </div>
                        </div>
                        <div className="p-col-3 column-input">
                            <div className="p-field">
                                <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Customer Name</label>
                                <InputText id="username1" aria-describedby="username1-help" value={this.state.customer_name} name="customer_name" onChange ={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox"/>
                            </div>
                        </div>
                    </div>
                    </form>
                    <br></br>
                    <form  autoComplete="off">
                    <div className="p-grid">
                        <div className="p-col-2">
                            <Button onClick = {this.submitStackForm} className="inputData buttonSecondary" variant="contained">
                                <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">S</span>ave</div>
                            </Button>
                        </div>
                        <div className="p-col-2">
                            <Button className="inputData buttonSecondary" variant="contained" onClick ={this.openModelTender}>
                                <div className="buttonText"> <i className="pi pi-book"></i> <span className="buttonTextFirstLetter">T</span>ender</div>
                            </Button>
                        </div>
                        <div className="p-col-2">
                            <Button className="inputData buttonSecondary" variant="contained" >
                                <div className="buttonText"> <i className="pi pi-calendar-plus"></i> <span className="buttonTextFirstLetter">D</span>raft</div>
                            </Button>
                        </div>
                        <div className="p-col-2">
                            <Button className="inputData buttonSecondary" variant="contained">
                                <div className="buttonText"> <i className="pi pi-external-link"></i> <span className="buttonTextFirstLetter">L</span>oad</div>
                            </Button>
                        </div>
                        <div className="p-col-2">
                            <Button className="inputData buttonSecondary" variant="contained" >
                                <div className="buttonText"> <i className="pi pi-plus-circle"></i> <span className="buttonTextFirstLetter">A</span>pply</div>
                            </Button>
                        </div>
                        <div className="p-col-2">
                            <Button className="inputData buttonSecondary" variant="contained" >
                                <div className="buttonText"> <i className="pi pi-microsoft"></i> <span className="buttonTextFirstLetter">H</span>old</div>
                            </Button>
                        </div>
                        <div className="p-col-2">
                            <Button className="inputData buttonSecondary" variant="contained" onClick ={this.openModel}>
                                <div className="buttonText"> <i className="pi pi-shopping-cart"></i> <span className="buttonTextFirstLetter">O</span>ld Item</div>
                            </Button>
                        </div>
                        <div className="p-col-2">
                            <Button className="inputData buttonSecondary" variant="contained">
                                <div className="buttonText"> <i className="pi pi-angle-double-left"></i> <span className="buttonTextFirstLetter">L</span>ast Bil</div>
                            </Button>
                        </div>
                        <div className="p-col-2">
                            <Button className="inputData buttonSecondary" variant="contained">
                                <div className="buttonText"><span className="buttonTextFirstLetter">N</span>ext Bill  <i className="pi pi-angle-double-right"></i> </div>
                            </Button>
                        </div>
                        <div className="p-col-2">
                            <Button className="inputData buttonSecondary" variant="contained">
                                <div className="buttonText"> <i className="pi pi-eye"></i> <span className="buttonTextFirstLetter">V</span>iew</div>
                            </Button>
                        </div>
                        <div className="p-col-2">
                                <Button className="inputData buttonSecondary" variant="contained" onClick={this.clearForm}>
                                    <div className="buttonText"> <i className="pi pi-trash"></i> <span className="buttonTextFirstLetter">C</span>lear</div>
                                </Button>
                        </div>
                        <div className="p-col-2">
                            <Link to="/home" className="Link">
                                <Button className="inputData buttonSecondary" variant="contained">
                                    <div className="buttonText"> <i className="pi pi-times-circle"></i> <span className="buttonTextFirstLetter">C</span>lose</div>
                                </Button>
                            </Link>
                        </div>
                    </div>
                    </form>
                    </div>
                    <div className="p-col-3" style={{marginTop:'25px'}}>
                        <div className="p-grid">
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Bill Number
                                    </div>
                                    <div className="p-col-6 right_total_box_amount">
                                     {this.state.billno}
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Date
                                    </div>
                                    <div className="p-col-6 right_total_box_amount">
                                     {this.state.todaydate}
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Cashier
                                    </div>
                                    <div className="p-col-6 right_total_box_amount">
                                     {this.state.userData}
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        System IP
                                    </div>
                                    <div className="p-col-6 right_total_box_amount">
                                     {this.state.ipAddress}
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <hr></hr>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Total Items
                                    </div>
                                    <div className="p-col-6 right_total_box_amount">
                                    : {this.state.totalItems}
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Total Qty
                                    </div>
                                    <div className="p-col-6 right_total_box_amount">
                                    : {this.state.totalQty}
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Total Weight
                                    </div>
                                    <div className="p-col-6 right_total_box_amount">
                                    : {this.state.totalGrossWeight}
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Sub Total
                                    </div>
                                    <div className="p-col-6 right_total_box_amount">
                                    : {this.state.totalRate}
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Making
                                    </div>
                                    <div className="p-col-6 right_total_box_amount">
                                    : 0.00
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Old Value
                                    </div>
                                    <div className="p-col-6 right_total_box_amount">
                                    : {this.state.amountOldTotal}
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Bill Dis%
                                    </div>
                                    <div className="p-col-6 right_total_box_amount">
                                    : 10%
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Bill Dis Amt
                                    </div>
                                    <div className="p-col-6 right_total_box_amount">
                                    : {this.state.afterDes}
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Grand Total
                                    </div>
                                    <div className="p-col-6 right_total_box_amount">
                                    : 0.00
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-6 right_total_box_title">
                                        Tax Amt
                                    </div>
                                    <div className="p-col-6 right_total_box_amount">
                                    : 0.00
                                    </div>
                                </div>
                            </div>
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
                                        <h3 style={{padding:'0px',margin: '0px'}}> Tender </h3>
                                    </div>
                                    <div className="p-col-5" style={{padding:'5px 2px 0px'}}>
                                        : {this.state.tender_total}/-
                                    {/* : <InputText style={{width:'90%'}} name="cashReceived" value={this.state.cashReceived} onChange ={this.onChange} /> */}
                                    </div>
                                </div>
                            </div>
                            <div className="p-col-12 right_final_total_box">
                                <div className="p-grid">
                                    <div className="p-col-7">
                                        <h3 style={{padding:'0px',margin: '0px'}}>Balance </h3>
                                    </div>
                                    <div className="p-col-5" style={{padding:'5px 2px 0px'}}>
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
                                        <Dropdown value={this.state.stackOld} options={this.state.stock} name="customer_id" onChange ={this.handleselectedItemOld} style={{width:'100%',padding:'0px',height:'35px'}} filter editable optionLabel="name" />
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
                        <div style={{height:'180px',border:'2px solid #227bce',overflowX:'scroll'}}>
                                <div style={{width:'1000px',marginTop: '-5px'}}>
                            <DataTable state={{ overflowY:'scroll'}}
                            value={this.state.selectedOldItem} rows={3} first={this.state.first} onPage={(e) => this.setState({ first: e.first})}
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

                <Dialog header="Tender" visible={this.state.tenderModelBox}  modal style={{ width: '40vw',height:'60vh',backgroundColor: 'white' }}  onHide={this.openModelTender}
                    draggable={true} resizable={false} baseZIndex={1}>
                        <form>
                    <div className="p-grid" style={{marginTop:'10px'}}>
                        <div className="p-col-2 column-input">
                            <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Cash</label>
                        </div>
                        <div className="p-col-10 column-input">
                            <div className="p-field">
                                <InputText id="username1" aria-describedby="username1-help" name="tender_cash" value={this.state.tender_cash} onChange ={this.onChangeTender} onKeyDown={this.handleEnterTender} className="p-d-block InputPrimeBox"/>
                            </div>
                        </div>
                        <div className="p-col-2 column-input">
                            <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Card</label>
                        </div>
                        <div className="p-col-10 column-input">
                            <div className="p-field">
                                <InputText id="username1" aria-describedby="username1-help" name="tender_card" value={this.state.tender_card} onChange ={this.onChangeTender} onKeyDown={this.handleEnterTender} className="p-d-block InputPrimeBox"/>
                            </div>
                        </div>
                        <div className="p-col-2 column-input">
                            <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Other</label>
                        </div>
                        <div className="p-col-10 column-input">
                            <div className="p-field">
                                <InputText id="username1" aria-describedby="username1-help" name="tender_other" value={this.state.tender_other} onChange ={this.onChangeTender} onKeyDown={this.handleEnterTender} className="p-d-block InputPrimeBox"/>
                            </div>
                        </div>
                        <div className="p-col-12"><hr></hr></div>
                        <div className="p-col-2 column-input">
                            <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Total</label>
                        </div>
                        <div className="p-col-10 column-input">
                            <div className="p-field">
                                <InputText id="username1" aria-describedby="username1-help" name="tender_total" value={this.state.tender_total} onChange ={this.onChangeTender} onKeyDown={this.handleEnterTender} className="p-d-block InputPrimeBox"/>
                            </div>
                        </div>
                    </div>
                    </form>
                </Dialog>
            </div>
        )
    }
}