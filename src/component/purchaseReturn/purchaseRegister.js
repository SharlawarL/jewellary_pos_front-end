import React, { Component, useEffect, useRef } from 'react'
import '../../assets/css/style.css';
import { TextField, Button, Input } from '@material-ui/core';
import { Link } from "react-router-dom";
import Select from 'react-select'
import { autoComplete } from 'primereact/autocomplete';
//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
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
import PurchaseService from '../../service/purchase/purchaseService'

//json
import Init from '../../config/Inint.json'

//object of services
const salesService = new SalesService();
const itemService = new ItemService();
const stockService = new StockService();
const purchaseService = new PurchaseService();

export default class stockComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: localStorage.getItem('username'),
            ipAddress: '',
            success: false,
            branchname: '',
            selectedCategory: '',
            selectedItemType: '',
            lot_no: 0,
            ItemNumber: '',
            tableData: [],
            gross_weight: '',
            loss_weight: '',
            Stock_no: '',
            isClearable: false,
            first: 0,
            action: '',
            StockTotal: 0,
            totalQty: 0,
            totalGrossWeight: 0,
            totalLessWeight: 0,
            totalNetWeight: 0,
            totalItems: 0,
            totalRate: 0,
            afterDes: 0,

            stock : [],
            flterData: [],
            payModeList: Init.PaymentMod,

            billno: 0,
            todaydate: moment().format("YYYY-MM-DD"),
            due_date:'',

            //item data
            selectedItem: [],
            item_code: '',
            rate: 0,
            weight: '',
            net_weight: '',
            westage: '',
            making_charges: '',
            qty: 0,
            price: 0,
            stack: '',
            amount :0,

            //bill details
            grn_number:'',
            billno :'',
            suppliername :'',

            // customer data
            user_data: [],
            customer_data: [],
            customer_mobile_data: [],
            customer_id: '',
            mobile: '',
            customer_name: '',
            address: '',
            remark: '',
            reference: '',
            filterStack: {},
            payMod: 'Credit',

            modelBox: false,


            sub_total : 0,
            dis_per : 0,
            dis_amt : 0,
            gst_per : 0,
            gst_amt : 0,
            grant_total : 0,
            add_amount : 0,
            round : 0,
            total_weight : 0,
        }

        this.getLastStock()
        this.getStock()
        this.onChange = this.onChange.bind(this)
        this.openModel = this.openModel.bind(this)
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this)
        this.submitStock = this.submitStock.bind(this)
        this.handleEnter = this.handleEnter.bind(this)
    }


    onChange(e) {
        console.log(e.target.value)
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    openModel(e) {
        this.setState({
            modelBox: !this.state.modelBox
        })
    }


    handleEnter = (event) => {
        console.log(event.keyCode)
        if (event.keyCode === 13) {
            const form = event.target.form;
            const index = Array.prototype.indexOf.call(form, event.target);
            console.log(index)
            if((index == 8) && (this.state.stack))
            {
                form.elements[10].focus();
                event.preventDefault();
            } else 
            if(index < 12)
            {
                form.elements[index + 1].focus();
                event.preventDefault();
            } else {
                form.elements[8].focus();
                event.preventDefault();
                this.submitStock(event)
            }
        }
    }



    getLastStock() {

        let data = { login_user: localStorage.getItem("username"), branch: localStorage.getItem("Branch") }

        purchaseService.getLastPurchaseReturn(data).then((response) => {
            if (response['data']['status'] === 1) {
                this.setState({
                    ipAddress: response['data']['data']['ip'],
                    billno: response['data']['data']['billno'],
                    grn_number: response['data']['data']['grn'],
                    item_no: response['data']['data']['purchase_no']
                })
            }
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }

    getStock = () => {

        let data = {
            login_user : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            type :'item-report'
        }

        itemService.getItem(data).then((response) => {
            console.log(response)
            if (response['data']['status'] === 1) {
                response['data']['data'].map((data) => {
                    return (
                        data['code'] = data.entry_no,
                        data['name'] = data.lot_no + " " + data.item_name
                    )
                })
                this.setState({
                    stock: response['data']['data']
                })
            } else {

            }
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    };


    submitStock(e) {
        e.preventDefault()

        if ((this.state.qty != 0) && (this.state.item_no != 0)) {
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
                amount,
                hsn_code,
            } = this.state

            let data = {
                login_user: localStorage.getItem("username"),
                branch: localStorage.getItem("Branch"),
                lot_no: lot_no,
                name: name,
                item_code: item_no,
                rate: rate ? parseFloat(rate) : 0,
                amount: parseFloat(rate)*parseFloat(weight),
                weight: weight ? weight : 0,
                net_weight: net_weight ? net_weight : 0,
                westage: westage ? westage : 0,
                making_charges: making_charges ? parseFloat(making_charges) : 0,
                qty: qty ? qty : 0,
                hsn_code:hsn_code?hsn_code:0
            }

            console.log(data)

            this.state.selectedItem.push(data)
            this.setState({
                selectedItem: this.state.selectedItem,
                isClearable: true,
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

    submitStackForm = (e) => {
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
            reference,
            sub_total,
            dis_per,
            dis_amt,
            gst_per,
            gst_amt,
            grant_total,
            add_amount,
            round,
            total_weight,
            grn_number,
            suppliername,
            due_date,
            todaydate
        } = this.state

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            grn_number:grn_number,
            suppliername:suppliername,
            billno: billno,
            due_date:due_date,
            todaydate:todaydate,
            lot_no: lot_no,
            item_no: item_no,
            ipAddress: ipAddress,
            totalQty: totalQty,
            totalGrossWeight: totalGrossWeight,
            totalRate: totalRate,
            descount: '10%',
            afterDes: afterDes,
            selectedItem: JSON.stringify(selectedItem),
            totalItems: totalItems,
            making_charges: making_charges,
            customer_id: customer_id,
            mobile: mobile,
            customer_name: customer_name,
            address: address,
            remark: remark,
            reference: reference,
            sub_total : sub_total,
            dis_per : dis_per,
            dis_amt : dis_amt,
            gst_per : gst_per,
            gst_amt : gst_amt,
            grant_total : grant_total,
            add_amount : add_amount,
            round : round,
            total_weight : total_weight,
        }

        purchaseService.savePurchaseReturn(data).then((response) => {
            if (response['data']['status'] === 1) {
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
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }


    handleselectedItem = (event,newValue) => {
        console.log(newValue)
        if(newValue){
            this.setState({
                stack       : newValue.item_name,
                name        : newValue.item_name,
                item_code   : newValue.item_no,
                net_weight  : newValue.net_weight,
                westage     : newValue.wastage,
                making_charges: newValue.making_charge,
                price_type  : newValue.price_type,
                hsn_code    : newValue.hsn_code
            })
        } 
    }

    handleselectedMode = (newValue) => {
        console.log(newValue)
        if (newValue) {
            this.setState({
                payMod: newValue.value
            })
        }
    }

    handleselectedUser = (newValue) => {
        console.log(newValue)
        if (newValue) {
            this.setState({
                customer_id: newValue.value.cid,
                mobile: newValue.value.mobile,
                customer_name: newValue.value.cname,
                address: newValue.value.add1
            })
        }
    }
    actionBodyTemplate = () => {
        return (
            <Button type="button" icon="pi pi-cog" className="p-button-secondary"></Button>
        );
    }

    searchCountry = (event) =>{
        setTimeout(() => {
            let _filteredCountries;
            if (!event.query.trim().length) {
                _filteredCountries = [...this.state.stock];
            }
            else {
                _filteredCountries = this.state.stock.filter((data) => {
                    return data.item_no.toLowerCase().startsWith(event.query.toLowerCase());
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

    renderFooter = (name) => {
        return (
            <div>
                <div className="p-grid">
                    <div className="p-col-8"></div>
                    <div className="p-col-2">
                        <Button type="submit" className="inputData buttonPrimary" variant="contained">
                            <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">S</span>ave</div>
                        </Button>
                    </div>
                    <div className="p-col-2">
                        <Button type="submit" className="inputData buttonSecondary" variant="contained" onClick={this.openModel}>
                            <div className="buttonText"> <i className="pi pi-times"></i> <span className="buttonTextFirstLetter">C</span>lose</div>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    itemTemplate = (item) => {
        return (
            <div>
                <div style={{width:'100%'}} onClick={(e)=>this.handleselectedItem(e,item)}>{item.item_no} - {item.item_name}</div>
            </div>
        );
    }

    clearForm = () => {
        this.setState({
            selectedCategory: '',
            selectedItemType: '',
            lot_no: 0,
            ItemNumber: '',
            tableData: [],
            gross_weight: '',
            loss_weight: '',
            Stock_no: '',
            isClearable: false,
            first: 0,
            action: '',
            StockTotal: 0,
            totalQty: 0,
            totalGrossWeight: 0,
            totalLessWeight: 0,
            totalNetWeight: 0,
            totalItems: 0,
            totalRate: 0,
            afterDes: 0,

            stock : [],
            flterData: [],
            payModeList: Init.PaymentMod,

            billno: 0,
            todaydate: moment().format("DD-MM-YYYY hh:mm:ss"),

            //item data
            selectedItem: [],
            item_code: '',
            rate: 0,
            weight: '',
            net_weight: '',
            westage: '',
            making_charges: '',
            qty: 0,
            price: 0,
            stack: '',
            amount :0,

            // customer data
            user_data: [],
            customer_data: [],
            customer_mobile_data: [],
            customer_id: '',
            mobile: '',
            customer_name: '',
            address: '',
            remark: '',
            reference: '',
            filterStack: {},
            payMod: 'Credit',

            modelBox: false,

            sub_total : 0,
            dis_per : 0,
            dis_amt : 0,
            gst_per : 0,
            gst_amt : 0,
            grant_total : 0,
            add_amount : 0,
            round : 0,
            total_weight : 0,
        })
    }


    render() {

        const fontLebel = { padding: '5px 0px 10px', fontSize: '13px' }


        console.log(this.state.customer_data)

        if (this.state.success) {
            return <Redirect to='/purchase-return-report'></Redirect>
        }

        var sub_total = 0;
        var total_weight = 0;
        var totalWeight = 0;
        var totalRate = 0;
        var totalNetWeight = 0;

        this.state.selectedItem.map((data) => {
            sub_total = sub_total + parseFloat(data.amount)
            total_weight = total_weight + Number(data.weight)
        })

        this.state.sub_total = parseFloat(sub_total)
        this.state.total_weight = total_weight
        this.state.gst_amt = (this.state.gst_per > 0)?(parseFloat(sub_total) / parseFloat(this.state.gst_per)):this.state.gst_per;
        this.state.dis_amt = (this.state.dis_per > 0)?(parseFloat(sub_total) / parseFloat(this.state.dis_per)):this.state.dis_per;

        this.state.grant_total = parseFloat(this.state.sub_total) - parseFloat(this.state.gst_amt) - parseFloat(this.state.dis_amt)

        const fontIns = { fontSize: '0.6rem', margin: 0 };

        const lebelProps = { fontSize: '0.7rem', margin: -7 };

        if (this.state.gross_weight && this.state.loss_weight) {
            this.state.net_weight = (this.state.gross_weight - this.state.loss_weight)
        }

        var lot_number = this.state.lot_no
        var item_number = this.state.item_no

        this.state.selectedItem.map((data) => {
            data['lot_no'] = lot_number
            data['item_no'] = item_number
            lot_number++
            item_number++
        })




        // alert(date)
        return (
            <div className="body">
                <ToastContainer />
                <NotificationContainer />
                <Menu loggedIn={this.state.loggedIn} />

                <div className="continerBigBox">
                    <div className="p-grid">
                        <div className="p-col-12">
                            <form onSubmit={this.submitStock} autoComplete="off">
                                <br></br>
                                <div className="p-grid" style={{ marginTop: '0px' }}>
                                    <div className="p-col-3">
                                        <h3 className="pageTitle" style={{ fontSize: '1.5rem', color:'black' ,marginTop: '0px', padding: '12px 1px', borderRadius: '10px'}}>
                                            Purchase Register Return
                                    </h3>
                                    </div>
                                    <div className="p-col-1 column-input">
                                        <div style={fontLebel}>GRN Number</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="grn_number" value={this.state.grn_number} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-1 column-input">
                                        <div style={fontLebel}>Bill Number</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="billno" value={this.state.billno} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>

                                    <div className="p-col-1 column-input">
                                        <div style={fontLebel}>Supplier</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="suppliername" value={this.state.suppliername} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />

                                    </div>

                                    <div className="p-col-2 column-input">
                                        <div style={fontLebel}>Bill Date</div>
                                        <InputText id="billno" type="date" aria-describedby="username1-help" name="todaydate" value={this.state.todaydate} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-2 column-input">
                                        <div style={fontLebel}>Due Date</div>
                                        <InputText id="billno" type="date" aria-describedby="username1-help" name="due_date" value={this.state.due_date} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />

                                    </div>
                                    <div className="p-col-2 column-input">
                                        <div style={fontLebel}>Payment Mode</div>
                                        <Dropdown name="payMod" value={this.state.payMod} options={this.state.payModeList} onChange={this.handleselectedMode} style={{ width: '100%' }} style={{ width: '100%', padding: '0px', height: '35px' }} filter editable optionLabel="name" />
                                    </div>
                                </div>
                                <div className="p-grid" style={{ marginTop: '0px' }}>
                                    <div className="p-col-3">
                                        <div style={fontLebel}>Item Code</div>
                                        <autoComplete value={this.state.item_code} suggestions={this.state.flterData} completeMethod={this.searchCountry} dropdown forceSelection
                                         field="item_no" name="stack" onKeyUp={this.handleEnter} itemTemplate={this.itemTemplate}
                                         className="p-d-block InputPrimeBox"/>
                                        {/* <Dropdown value={this.state.stack} options={this.state.Stock} name="customer_id" onChange={this.handleselectedItem} style={{ width: '100%', padding: '0px', height: '35px' }} filter editable optionLabel="name" /> */}
                                    </div>
                                    <div className="p-col-3">
                                        <div style={fontLebel}>Qty</div>
                                        <InputText id="billno" aria-describedby="username1-help" onKeyUp={this.handleEnter} style={{ width: '100%' }} name="qty" value={this.state.qty} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2" />
                                    </div>
                                    <div className="p-col-3">
                                        <div style={fontLebel}>Pur.price</div>
                                        <InputText id="billno" aria-describedby="username1-help" onKeyUp={this.handleEnter} style={{ width: '100%' }} name="rate" value={this.state.rate} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-3">
                                        <div style={fontLebel}>Weight</div>
                                        <InputText id="billno" aria-describedby="username1-help" onKeyUp={this.handleEnter} style={{ width: '100%' }} name="weight" value={this.state.weight} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    {/* <div className="p-col-2" style={{padding:'15px 10px'}}>
                                    <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                        <div className="buttonText"> 
                                            <i className="pi pi-plus-circle"></i>  <span className="buttonTextFirstLetter" style={{marginTop:'-5px'}}>A</span>dd
                                        </div>
                                    </Button>
                                </div> */}
                                </div>
                                <div style={{ height: '180px', border: '1px solid #b0a939', overflowX: 'scroll' }}>
                                    <div style={{ width: '1500px', marginTop: '-5px' }}>
                                        <DataTable state={{ overflowY: 'scroll' }}
                                            value={this.state.selectedItem} paginator rows={3} first={this.state.first} onPage={(e) => this.setState({ first: e.first })}
                                            paginatorTemplate="RowsPerPageDropdown PageLinks FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                            emptyMessage="No Item found.">
                                            <Column style={{ width: '70px' }} field="lot_no" header="Sr_no"></Column>
                                            <Column style={{ width: '100px' }} field="item_code" header="Item Code"></Column>
                                            <Column style={{ width: '180px' }} field="name" header="Item Name"></Column>
                                            <Column style={{ width: '120px' }} field="rate" header="Rate"></Column>
                                            <Column style={{ width: '120px' }} field="qty" header="Qty/Pcs"></Column>
                                            <Column style={{ width: '100px' }} field="weight" header="Weight"></Column>
                                            <Column style={{ width: '120px' }} field="amount" header="Amount"></Column>
                                            <Column style={{ width: '150px' }} field="hsn_code" header="HSN Code"></Column>
                                            <Column body={this.actionBodyTemplate} headerStyle={{ width: '8em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                                        </DataTable>
                                    </div>
                                </div>
                                <div className="p-grid">
                                    <div className="p-col-4">
                                        <div style={fontLebel}>Sub Total</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="sub_total" value={this.state.sub_total} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-2">
                                        <div style={fontLebel}>Dis %</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="dis_per" value={this.state.dis_per} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-2">
                                        <div style={fontLebel}>Dis Amount</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="dis_amt" value={this.state.dis_amt} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-2">
                                        <div style={fontLebel}>GST %</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="gst_per" value={this.state.gst_per} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-2">
                                        <div style={fontLebel}>GST Amount</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="gst_amt" value={this.state.gst_amt} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>

                                    <div className="p-col-4">
                                        <div style={fontLebel}>Grant Total</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="grant_total" value={this.state.grant_total} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-2">
                                        <div style={fontLebel}>Add Amount</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="add_amount" value={this.state.add_amount} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-2">
                                        <div style={fontLebel}>Round</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="round" value={this.state.round} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-4">
                                        <div style={fontLebel}>Total Weight</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="total_weight" value={this.state.total_weight} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                </div>
                            </form>
                            <form onSubmit={this.submitStackForm} autoComplete="off">
                                <div className="p-grid">
                                    <div className="p-col-2">
                                        <Button className="inputData buttonSecondary" variant="contained">
                                            <div className="buttonText"> <i className="pi pi-book"></i> <span className="buttonTextFirstLetter">H</span>ome</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2">
                                        <Button className="inputData buttonSecondary" variant="contained" >
                                            <div className="buttonText"> <i className="pi pi-shopping-cart"></i> <span className="buttonTextFirstLetter">V</span>iew</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2">
                                        <Button className="inputData buttonSecondary" variant="contained">
                                            <div className="buttonText"> <i className="pi pi-angle-double-left"></i> <span className="buttonTextFirstLetter">L</span>ast Entry</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2">
                                    
                                            <Button className="inputData buttonSecondary" variant="contained">
                                                <div className="buttonText"><span className="buttonTextFirstLetter">N</span>ext Entry  <i className="pi pi-angle-double-right"></i> </div>
                                            </Button>
                                        
                                    </div>
                                    <div className="p-col-2">
                                        <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                            <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">S</span>ave</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.clearForm}>
                                            <div className="buttonText"> <i className="pi pi-trash"></i> <span className="buttonTextFirstLetter">C</span>lear</div>
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
                <Footer />
            </div>
        )
    }
}