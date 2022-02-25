import React, { Component, useEffect } from 'react'
import '../../assets/css/style.css';
import { Button } from '@material-ui/core';
import { Link } from "react-router-dom";
import Select from 'react-select'

//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
// import { ToastContainer, toast } from 'react-toastify';
// import { Toast } from 'primereact/toast';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Ip from 'ip'
import moment from "moment";
import PrintIcon from '@material-ui/icons/Print';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

//prime
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { AutoComplete } from 'primereact/autocomplete';
import 'primeflex/primeflex.css';

// import MsgAlert from '../dialogBox/msgAlert'

//service
import SalesService from '../../service/estimate/salesService'
import CustomerService from '../../service/customer/customerService'

//json
import Init from '../../config/Inint.json'
import { CompareArrowsOutlined, FilterTiltShiftSharp, SignalCellularNullOutlined } from '@material-ui/icons';

import $ from 'jquery';

//object of services
const salesService = new SalesService();
const customerService = new CustomerService();

const publicIp = require("react-public-ip");

export default class salesPointComponent extends React.Component {

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
            lot_no: '',
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

            qty_total: 0,

            viewBill: '',
            item_type:'',

            payMode: Init.PaymentMod,
            payModList: [
                { name: 'Credit', code: 'Credit' },
                { name: 'Cash', code: 'Cash' }
            ],

            type: { name: 'Gold', code: 'Gold' },
            typeList: [
                { name: 'Gold', code: 'Gold' },
                { name: 'Diamond', code: 'Diamond' },
                { name: 'Platinum', code: 'Platinum' },
                { name: 'Silver', code: 'Silver' }
            ],
            purity: { name: '916 BIS HM', code: '916 BIS HM' },
            purityList: [
                { name: '916 BIS HM', code: '916 BIS HM' },
                { name: '22 CT', code: '22 CT' },
                { name: 'Others', code: 'Others' },
            ],

            billno: 0,
            newbillno: 0,
            todaydate: moment().format("DD-MM-YYYY"),
            currentTime: moment().format("hh:mm:ss"),
            stock: [],

            //item data
            selectedItem: [],
            item_code: '',
            rate: '',
            weight: '',
            net_weight: '',
            westage: '',
            making_charges: '',
            qty: '',
            price: 0,
            stack: '',
            stackOld: '',
            selectedProducts: null,

            // old itemdata
            selectedOldItem: [],
            nameOld: '',
            qtyOld: '',
            weightOld: '',
            rateOld: '',
            amountOld: '',
            qtyOldTotal: 0,
            weightOldTotal: 0,
            amountOldTotal: 0,
            net_total:0,
            ten_total: 0,

            // customer data
            user_data: [],
            customer_data: [],
            customer_mobile_data: [],
            customer_id: '',
            mobile: '',
            customer_name: '',
            customer_card: '',
            address: '',
            remark: '',
            reference: '',
            filterStack: {},
            agentList:[],
            retrivalList:[],

            selecteddPay: 'Cash',

            focus : false,

            modelBox: false,
            tenderModelBox: false,
            printModelBox: false,
            suggestionModexBox: false,
            customerModexBox: false,
            viewModelBox: false,
            draftModelBox: false,
            agentModexBox : false,
            retrivalModexBox : false,

            cashReceived: 0,
            balance: 0,
            flterData: [],

            tender_cash: 0,
            tender_card: 0,
            tender_other: 0,
            tender_total: 0,

            hsn_code: 0,
            price_type: 0,
            amount: 0,
            tax_item_per:0,
            tax_per: 0,
            tax_amt: 0.00,
            total_sub: 0,
            total_making: 0,

            des_per: 0,
            des_amt: 0,

            others : 0,
            agentCode :'',
            pay_remarks: '',

            //redirected bill
            billRedirect: props.location.state ? props.location.state['page'] : '',
            billViewRedirect: props.location.state ? props.location.state['billno'] : '',

            globalFilter: null,
        }

        this.getLastStock()
        this.getStock()
        this.getCustomer()
        this.getAgent()
        this.getRetrival()
        this.getTax()

        this.originalRows = {};

        this.accept = this.accept.bind(this);
        this.reject = this.reject.bind(this);

        this.onChangeEmpty = this.onChangeEmpty.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onChangeView = this.onChangeView.bind(this)
        this.onChangeLotNumber = this.onChangeLotNumber.bind(this)
        this.onChangeTender = this.onChangeTender.bind(this)
        this.onCustomerUser = this.onCustomerUser.bind(this)
        this.handleEnter = this.handleEnter.bind(this)

        this.onRowEditInit = this.onRowEditInit.bind(this);

        this.handleCustomerEnter = this.handleCustomerEnter.bind(this)
        this.handleselectedPAY = this.handleselectedPAY.bind(this)
        this.openModel = this.openModel.bind(this)
        this.openModelClose = this.openModelClose.bind(this)
        this.openModelTender = this.openModelTender.bind(this)
        this.closeModelTender = this.closeModelTender.bind(this)
        this.openModelPrint = this.openModelPrint.bind(this)
        this.openModelSuggestion = this.openModelSuggestion.bind(this)
        this.openModelCustomer = this.openModelCustomer.bind(this)
        this.openModelRetrival = this.openModelRetrival.bind(this)
        this.openModelAgent = this.openModelAgent.bind(this)
        this.openModelView = this.openModelView.bind(this)
        this.openModelDraft = this.openModelDraft.bind(this)
        // this.searchCountry = this.searchCountry.bind(this)
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this)
        this.trashSelectedItem = this.trashSelectedItem.bind(this)

        this.clickCustomerTable = this.clickCustomerTable.bind(this)
        this.clickAgentTable = this.clickAgentTable.bind(this)
        this.clickItemTable = this.clickItemTable.bind(this)
        this.clickRetrivalTable = this.clickRetrivalTable.bind(this)

        this.getViewBill = this.getViewBill.bind(this)
        this.getLastBill = this.getLastBill.bind(this)
        this.getNextBill = this.getNextBill.bind(this)

        this.removeItem = this.removeItem.bind(this)
        this.draftForm = this.draftForm.bind(this)
        this.loadForm = this.loadForm.bind(this)
        this.submitStock = this.submitStock.bind(this)
        this.submitOldIem = this.submitOldIem.bind(this)


    }

    componentDidMount() {

        // alert(this.state.billRedirect)
        // alert(this.state.billViewRedirect)
        if (this.state.billRedirect == 'redirect') {
            this.state.viewModelBox = true
            // this.openModelView();
            this.state.viewBill = this.state.billViewRedirect
            this.getViewBill()
        }
    }


    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
        this.getCal()
    }

    onChangeEmpty(e) {
        if(e.target.value == 0)
        {
            // alert(e.target.value)
            this.setState({
                [e.target.name]: ''
            })
        }
    }

    onChangeView(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
        if (e.keyCode === 13) {
            this.getViewBill()
        }

    }

    onChangeLotNumber(e) {
        let count = 0;
        for (let data of this.state.stock) {
            console.log(count)
            if (data.lot_no === e.target.value) {
                count++
                this.setState({
                    lot_no: e.target.value,
                    stack: data.item_name,
                    name: data.item_name,
                    item_code: data.item_no,
                    rate: data.price,
                    weight: '',
                    net_weight: 0,
                    westage: '',
                    making_charges: '',
                    qty: 1,
                    qty_total: data.quan,
                    price_type: data.price_type,
                    hsn_code: data.hsn_code,
                    price: data.price
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
            // if(this.state.lot_no)
            // {
            //     alert("Nill Stock")
            // } 
            this.setState({
                lot_no: '',
                stack: '',
                name: '',
                item_code: '',
                rate: '',
                weight: '',
                net_weight: '',
                westage: '',
                making_charges: '',
                qty: '',
                qty_total: '',
                price_type: '',
                hsn_code: '',
                price: ''
            })
        }
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    onCustomerUser(e) {
        let count = 0;
        for (let data of this.state.customer_data) {
            console.log(count)
            if (data.cid === e.target.value) {
                count++
                this.setState({
                    customer_id: data.cid,
                    mobile: data.mobile,
                    customer_name: data.cname,
                    address: data.add1
                })

            }

        }

        console.log(count)
        if (count == 0) {
            this.setState({
                customer_id: null,
                mobile: null,
                customer_name: null,
                address: null
            })
        }
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onChangeTender(e) {
        if(e.target.value.charAt(0) == 0)
        {
            this.setState({
                [e.target.name]: e.target.value.charAt(1)
            })
        } else {
            this.setState({
                [e.target.name]: e.target.value
            })
        }
    }

    openModel(e) {
        this.setState({
            modelBox: !this.state.modelBox
        })
    }

    openModelClose(e){
        this.setState({
            modelBox: !this.state.modelBox,
            selectedOldItem: null
        })
    }

    openModelSuggestion(e) {
        this.setState({
            suggestionModexBox: !this.state.suggestionModexBox
        })
        $('#lot_no').focus();
    }

    openModelCustomer(e) {
        this.setState({
            customerModexBox: !this.state.customerModexBox
        })
    }

    openModelRetrival(e) {
        this.setState({
            retrivalModexBox: !this.state.retrivalModexBox
        })
    }

    openModelAgent(e) {
        this.setState({
            agentModexBox: !this.state.agentModexBox
        })
    }

    openModelView(e) {
        this.setState({
            viewModelBox: !this.state.viewModelBox
        })

    }

    openModelDraft(e) {
        this.setState({
            draftModelBox: !this.state.draftModelBox
        })

    }

    openModelTender(e) {
        this.setState({
            tenderModelBox: !this.state.tenderModelBox
        })
        $('#mobile').focus();

    }

    closeModelTender(e){
        this.setState({
            tenderModelBox: !this.state.tenderModelBox,
            tender_card:0,
            tender_cash:0,
            tender_other:0
        })
        $('#mobile').focus();
    }


    openModelPrint(e) {
        this.setState({
            printModelBox: !this.state.printModelBox
        })
    }


    handleEnter = (event) => {
        console.log(event)
        
        const form = event.target.form;
        const index = Array.prototype.indexOf ? Array.prototype.indexOf.call(form, event.target) : 0;
        // console.log(index) 
        if (event.keyCode === 16) {
            form.elements[index - 1].focus();
            event.preventDefault();
        }
        // alert(event.keyCode)
        if ((event.keyCode === 9)) {
            // if((index == 0) && (this.state.stack))
            // {
            //     form.elements[3].focus();
            //     event.preventDefault();
            // } else 
            // const form = event.target.form;
            // const index = Array.prototype.indexOf.call(form, event.target);
            console.log("Index number --->>>",index)
            console.log("Lots number --->>>",this.state.lot_no)
            if (this.state.lot_no === '' ) {
                if(index == 0)
                {
                    console.log("Item --->>>",this.state.selectedItem.length)
                    console.log("index 32", (32+ this.state.selectedItem.length))
                    form.elements[31 + 2*this.state.selectedItem.length].focus();
                    event.preventDefault();

                } else if(index == (31 + 2*this.state.selectedItem.length)) 
                {
                    console.log("index 33", (35+ 2*this.state.selectedItem.length))
                    form.elements[34 + 2*this.state.selectedItem.length].focus();
                    event.preventDefault();
                } else if(index == (34 + 2*this.state.selectedItem.length)) 
                {
                    console.log("index 33", (35+ 2*this.state.selectedItem.length))
                    form.elements[36 + 2*this.state.selectedItem.length].focus();
                    event.preventDefault();
                } else if(index == (37 + 2*this.state.selectedItem.length)) 
                {
                    this.openModelTender()
                    form.elements[8 + 2*this.state.selectedItem.length].focus();
                    event.preventDefault();
                    // if(this.state.selecteddPay === 'Credit' || this.state.selecteddPay === 'Card')
                    // {
                    //     form.elements[8 + 2*this.state.selectedItem.length].focus();
                    //     event.preventDefault();
                    // }  else if( this.state.selecteddPay =='Multipay') {
                    //     this.openModelTender()
                    // }
                    //     else {
                    //     form.elements[36 + 2*this.state.selectedItem.length].focus();
                    //     event.preventDefault();
                    // }
                    
                } else 
                {
                    form.elements[index + 1].focus();
                    event.preventDefault();
                } 
            } else {
                console.log("item After enter next")
                if(index == 0)
                {
                    form.elements[2].focus();
                    event.preventDefault();
                }
                if (index <= 5) {
                    form.elements[index + 1].focus();
                    event.preventDefault();
                } else {
                    form.elements[0].focus();
                    event.preventDefault();
                    this.submitStock(event)
                }
            }
            if((this.state.selectedItem.length > 0) && (index == (9+ this.state.selectedItem.length)) )
                {
                    // alert("Want to save..??")
                    // this.submitStock(event)
                    // confirmDialog({
                    //     message: 'Are you sure you want to proceed?',
                    //     header: 'Save Bill',
                    //     icon: 'pi pi-info-circle',
                    //     accept: this.acceptSave,
                    //     reject: this.reject
                    // });
                }
        }

        if ( (event.keyCode === 40) && (event.target.name === 'lot_no') ) {
            this.setState({
                suggestionModexBox: true
            })
            // $("#item_table_search body tr[tabindex=0]").focus();
            $("#item_table table").focus(function (event) {
                $(this).closest('tr').next().find('td').eq(0).focus();  
            })
        }


        if ( (event.keyCode === 40) && ((event.target.name === 'customer_id') || (event.target.name === 'customer_name') || (event.target.name === 'mobile'))){
            this.setState({
                customerModexBox: true
            })
        }

        if ( (event.keyCode === 40) && (event.target.name === 'reference') ) {
            this.setState({
                agentModexBox: true
            })
        }

        if((event.target.value == null ) || (event.target.value == '' ))
        {
            if(event.target.name != 'lot_no')
            {
                this.setState({
                    [event.target.name] : 0 
                })
            }
        }
    }

    handleCustomerEnter = (event) => {
        // console.log(event.keyCode)
        // if (event.keyCode === 13) {
        //     const form = event.target.form;
        //     const index = Array.prototype.indexOf.call(form, event.target);
        //     console.log(index)
        //     if (index < 5) {
        //         form.elements[index + 1].focus();
        //         event.preventDefault();
        //     } else {
        //         form.elements[0].focus();
        //         event.preventDefault();
        //         // this.submitStock(event)
        //     }
        // }
        // if (event.keyCode === 40) {
        //     this.setState({
        //         customerModexBox: true
        //     })
        // }
    }

    handleEnterTender = (event) => {
        console.log(event.keyCode)
        if (event.keyCode === 13) {
            const form = event.target.form;
            const index = Array.prototype.indexOf.call(form, event.target);
            console.log(index)
            if (index < 2) {
                form.elements[index + 1].focus();
                event.preventDefault();
            } else {
                
                form.elements[0].focus();
                event.preventDefault();
                this.openModelTender()
                // this.submitStock(event)
            }
        }
    }

    handleEnterOld = (event) => {
        
        const form = event.target.form;
        const index = Array.prototype.indexOf ? Array.prototype.indexOf.call(form, event.target) : 0;

        console.log(index)

        if (event.keyCode === 16) {
            form.elements[index - 1].focus();
            event.preventDefault();
        }

        if ((event.keyCode === 9) || (event.keyCode === 13) ) {
            const form = event.target.form;
            const index = Array.prototype.indexOf.call(form, event.target);
            if (index < 12) {
                console.log(index)
                form.elements[index].focus();
                event.preventDefault();
            } else if (index == 12) {
                this.submitOldIem(event)
                form.elements[0].focus();
                event.preventDefault();
                // this.openModelTender()
                // this.submitStock(event)
            }
        }
    }

    handleEnterModel = (event) => {
        console.log("Model",event.keyCode)
    }

    accept() {
        this.toast.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    }

    reject() {
        this.toast.show({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }

    acceptSave(event) {
        // if(this.state.selectedItem.length > 0)
        //     this.submitStackForm(event)
    }




    getLastStock() {
        let data = { login_user: localStorage.getItem("username"), branch: localStorage.getItem("Branch") }

        salesService.getLastSales(data).then((response) => {
            if (response['data']['status'] === 1) {
                this.setState({
                    ipAddress: response['data']['data']['ip'],
                    billno: response['data']['data']['billno'],
                    newbillno: response['data']['data']['billno'],
                    // lot_no : response['data']['data']['lot_no'],
                    item_no: response['data']['data']['item_no']
                })
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }

    getTax() {
        let data = { login_user: localStorage.getItem("username"), branch: localStorage.getItem("Branch") }

        salesService.getTax(data).then((response) => {
            if (response['data']['status'] === 1) {
                this.setState({
                    tax_per: response['data']['data'][0]['taxp'],
                })
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }


    getStock = () => {

        let data = { login_user: localStorage.getItem("username") }

        salesService.getStocks(data).then((response) => {
            // console.log(response)
            if (response['data']['status'] === 1) {
                response['data']['data'].map((data) => {
                    return (
                        data['code'] = data.entry_no,
                        data['name'] = data.item_name
                    )
                })
                this.setState({
                    stock: response['data']['data']
                })
            } else {

            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    };

    getCustomer = () => {

        let data = { login_user: localStorage.getItem("username") }

        customerService.getCustomer(data).then((response) => {
            // console.log(response)
            if (response['data']['status'] === 1) {
                for (let data of response['data']['data']) {
                    let temp = { name: data['cid'], code: data['cid'], cname: data['cname'], mobile: data['mobile'], cid: data['cid'], add1: data['add1'] }
                    let tempMobile = { name: data['mobile'], code: data['mobile'], cname: data['cname'], mobile: data['mobile'], cid: data['cid'], add1: data['add1'] }
                    this.state.customer_data.push(temp)
                    this.state.customer_mobile_data.push(tempMobile)
                }
                this.setState({
                    user_data: response['data']['data'],
                })

            } else {

            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    };

    getRetrival = () => {

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            type: 'hold-data',
        }

        salesService.getSalesReport(data).then((response) => {
            // console.log(response)
            if (response['data']['status'] === 1) {
                this.setState({
                    retrivalList: response['data']['data'],
                })

            } else {

            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    };

    getAgent = () => {

        let data = {
            login_user : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            type :'agent-list'
        }
        customerService.getCustomer(data).then((response) =>{
            // console.log(response)
            if (response['data']['status'] === 1) {
                this.setState({
                    agentList: response['data']['data'],
                })

            } else {

            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    };

    submitStock(e) {
        e.preventDefault()
        if (Number(this.state.qty) <= Number(this.state.qty_total)) {
            if ((this.state.stack != 0) && (this.state.item_no != 0)) {
                const {
                    lot_no,
                    name,
                    item_no,
                    item_code,
                    rate,
                    weight,
                    net_weight,
                    qty,
                    amount,
                    making_charges,
                    westage,
                    hsn_code,
                    price,
                    price_type,
                    tax_item_per,
                    tax_per
                } = this.state

                // alert(price_type)

                var net_weight_data = 0;
                var amount_data = 0;
                // alert(net_weight)
                if (price_type === 'Weight Wise Rate') {
                    net_weight_data = parseFloat(net_weight) * parseFloat(qty);
                    amount_data = parseFloat(rate) * parseFloat(net_weight);
                }
                if (price_type === 'Piece Wise Rate') {
                    net_weight_data = parseFloat(net_weight);
                    amount_data = parseFloat(rate) * parseFloat(qty);
                    // alert(net_weight_data)
                }

                // alert(net_weight_data)

                let totalAmt = parseFloat(amount_data) + parseFloat(making_charges)

                let totalTax = (tax_item_per == 0) ? (totalAmt*tax_per/100) : (totalAmt*tax_item_per/100)

                let data = {
                    login_user: localStorage.getItem("username"),
                    branch: localStorage.getItem("Branch"),
                    lot_no: lot_no,
                    name: name,
                    item_code: item_code,
                    rate: rate ? rate : 0,
                    amount: amount_data,
                    weight: weight ? weight : 0,
                    net_weight: net_weight_data ? net_weight_data : 0,
                    westage: westage ? westage : 0,
                    making_charges: making_charges ? making_charges : 0,
                    total: amount_data ? (totalAmt + totalTax) : amount_data,
                    qty: qty ? qty : 0,
                    hsn_code: hsn_code ? hsn_code : 0,
                    price_type: price_type ? price_type : '',
                }

                console.log(data)

                this.state.selectedItem.push(data)
                this.setState({
                    selectedItem: this.state.selectedItem,
                    lot_no: '',
                    stack: '',
                    isClearable: true,
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
                if(this.state.selectedItem.length > 0)
                    alert("Please select Lot Number or Item")
            }
        } else {
            alert("Stock in hand " + this.state.qty_total)
        }
    }

    onRowEditInit(event) {
        console.log(event)
        // this.originalRows[event.index] = { ...this.state.selectedItem[event.index] };
    }

    onRowEditCancel(event) {
        let products = [...this.state.selectedItem];
        products[event.index] = this.originalRows[event.index];
        delete this.originalRows[event.index];

        this.setState({ selectedItem: products });
    }

    codeEditor(productKey, props, name) {
        return this.inputTextEditor(productKey, props, name);
    }

    inputTextEditor(productKey, props, field) {
        return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChange(productKey, props, e.target.value)} />;
    }

    onEditorValueChange(productKey, props, value) {
        let updatedProducts = [...props.value];
        updatedProducts[props.rowIndex][props.field] = value;
        this.setState({ [`${productKey}`]: updatedProducts });
    }

    submitOldIem(e) {
        e.preventDefault()

        if ((this.state.qtyOld != 0) && (this.state.amountOld != 0)) {
            const {
                nameOld,
                type,
                purity,
                qtyOld,
                weightOld,
                rateOld,
                amountOld,
                qtyOldTotal,
                weightOldTotal,
                amountOldTotal
            } = this.state

            let data = {
                nameOld: nameOld ? nameOld : 0,
                type: type ? type.name : '',
                purity: purity ? purity.name : '',
                qtyOld: qtyOld ? qtyOld : 0,
                weightOld: weightOld ? weightOld : 0,
                rateOld: rateOld ? rateOld : 0,
                amountOld: amountOld ? amountOld : 0,
                qtyOldTotal: qtyOldTotal?qtyOldTotal:0,
                weightOldTotal: weightOldTotal?weightOldTotal:0,
                amountOldTotal: amountOldTotal? amountOldTotal:0
            }

            console.log(data)

            this.state.selectedOldItem.push(data)
            this.setState({
                selectedOldItem: this.state.selectedOldItem,
                nameOld: '',
                qtyOld: 0,
                weightOld: 0,
                rateOld: 0,
                amountOld: 0,
            })
            console.log(this.state.selectedOldItem)
        } else {
            alert("Please fill all details")
        }
    }

    submitStackForm = (e) => {
        e.preventDefault()

        const {
            totalQty,
            currentTime,
            totalGrossWeight,
            selectedItem,
            totalItems,
            lot_no,
            item_no,
            ipAddress,
            billno,
            total_making,
            afterDes,
            tax_amt,
            totalRate,
            customer_id,
            other_amt,
            mobile,
            customer_name,
            address,
            remark,
            reference,
            selecteddPay,
            aname,
            agentCode,
            amountOldTotal,
            total_sub,
            net_total,
            ten_total,
            selectedOldItem,
            pay_remarks,
            tender_cash,
            tender_card,
            tender_other,
            tax_per
        } = this.state

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            
            type: (this.state.billno === this.state.newbillno) ? 'new' : 'alter',

            time: currentTime,

            billno: billno,
            lot_no: lot_no,
            item_no: item_no,
            ipAddress: ipAddress,

            sub_total:total_sub,
            gross_total: (parseFloat(this.state.total_sub) + parseFloat(this.state.total_making) - parseFloat(this.state.amountOldTotal) - parseFloat(this.state.des_amt)).toFixed(2),
            net_total: (parseFloat(this.state.net_total) - parseFloat(this.state.others) - parseFloat(this.state.des_amt)).toFixed(2),
            other_amt : other_amt,
            round_amt: net_total.toFixed(0),
            tender_total: ten_total,

            pby: selecteddPay,
            totalQty: totalQty,
            totalGrossWeight: totalGrossWeight,
            
            descount: '10%',
            afterDes: afterDes,
            selectedItem: JSON.stringify(selectedItem),
            selectedOldItem : JSON.stringify(selectedOldItem),
            totalItems: totalItems,
            making_charges: total_making,
            tax_amt:tax_amt,
            tax_per: tax_per,
            bal: parseFloat(this.state.tender_total) - ((parseFloat(this.state.net_total) - parseFloat(this.state.others) - parseFloat(this.state.des_amt))).toFixed(2),
            

            amountOldTotal:amountOldTotal,

            customer_id: customer_id,
            customer_name: customer_name,
            mobile: mobile,
            
            aname: aname,
            acode : agentCode,

            address: address,
            remark: remark,
            reference: reference,

            cash : tender_cash,
            card : tender_card,
            others : tender_other,
            pay_remarks : pay_remarks
        }

        console.log(data)

        if (this.state.selectedItem.length > 0) {
            salesService.saveSales(data).then((response) => {
                if (response['data']['status'] === 1) {
                    // toast.success(response['data']['message']);
                    this.toast.show({severity:'success', summary: 'Success', detail: response['data']['message'], life: 3000});
                    NotificationManager.success('Success message', response['data']['message']);
                    this.clearForm();
                    this.setState({
                        success: true,
                        printModelBox: true,
                    });
                } else {
                    // toast.error(response['data']['message']);
                    this.toast.show({severity:'error', summary: 'Error', detail: response['data']['message'], life: 3000});
                    this.setState({
                        loggedIn: false,
                    });
                }
            }).catch((error) => {
                console.log(error)
            })
        } else {
            alert("Please Select Item")
        }
    }


    submitStackHoldForm = (e) => {
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
            reference,
            selecteddPay
        } = this.state

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            type: 'hold',
            billno: billno,
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
            selecteddPay: selecteddPay
        }

        console.log(data)

        if (this.state.selectedItem.length > 0) {
            salesService.saveSales(data).then((response) => {
                if (response['data']['status'] === 1) {
                    // toast.success(response['data']['message']);
                    this.toast.show({severity:'success', summary: 'Success', detail: response['data']['message'], life: 3000});
                    NotificationManager.success('Success message', response['data']['message']);
                    this.clearForm();
                    this.setState({
                        success: true,
                        printModelBox: true,
                    });
                } else {
                    // toast.error(response['data']['message']);
                    this.toast.show({severity:'error', summary: 'Error', detail: response['data']['message'], life: 3000});
                    this.setState({
                        loggedIn: false,
                    });
                }
            }).catch((error) => {
                console.log(error)
            })
        } else {
            alert("Please Select Item")
        }
    }

    submitStackFormAlter = () => {

    }

    getTop = ()=>{
      const data = document.getElementById('pos-tab');
        if(data){
            let top=(data.getBoundingClientRect().top-16);
            return { position:'absolute', width: '80vw', height: '398px', backgroundColor: 'white', top:top+'px',marginLeft:'44px', overflow:'hidden',overflowX:'hidden'};
        } 
        
    }

    getLastBill = () => {

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            viewBill: this.state.billno - 1
        }

        salesService.getViewBill(data).then((response) => {
            if (response['data']['status'] === 1) {
                // toast.success(response['data']['message']);
                this.toast.show({severity:'success', summary: 'Success', detail: response['data']['message'], life: 3000});

                response['data']['data']['selectedItem'].map(data => {
                    data['lot_no'] = data['sno']
                    data['total'] = data['tot']
                    data['name'] = data['iname']
                    data['qty'] = data['quan']
                    data['weight'] = (parseFloat(data['weight'])).toFixed(3)
                    data['net_weight'] = (parseFloat(data['net_weight'])).toFixed(2)
                    data['making_charges'] = (parseFloat(data['make'])).toFixed(2)
                    data['total'] = (parseFloat(data['total'])).toFixed(2)
                    data['rate'] = (parseFloat(data['rate'])).toFixed(2)
                    data['amount'] = (parseFloat(data['amount'])).toFixed(2)
                    data['price'] = (parseFloat(data['price'])).toFixed(2)
                })

                this.setState({
                    billno: this.state.billno - 1,
                    selectedItem: response['data']['data']['selectedItem'],
                    customer_id: response['data']['data'][0]['cid'],
                    mobile: response['data']['data'][0]['mobile'],
                    customer_name: response['data']['data'][0]['cname'],
                    reference : response['data']['data'][0]['reference'],
                    viewModelBox: false
                })

                // this.clearForm();
                // this.openModelView();
            } else {
                // toast.error(response['data']['message']);
                this.toast.show({severity:'success', summary: 'Success', detail: response['data']['message'], life: 3000});
                this.setState({
                    loggedIn: false,
                });
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }

    getNextBill = () => {

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            viewBill: this.state.billno + 1
        }

        salesService.getViewBill(data).then((response) => {
            if (response['data']['status'] === 1) {
                // toast.success(response['data']['message']);
                this.toast.show({severity:'success', summary: 'Success', detail: response['data']['message'], life: 3000});

                response['data']['data']['selectedItem'].map(data => {
                    data['lot_no'] = data['sno']
                    data['total'] = data['tot']
                    data['making_charge'] = data['make']
                    data['name'] = data['iname']
                    data['qty'] = data['quan']
                    data['weight'] = (parseFloat(data['weight'])).toFixed(3)
                    data['net_weight'] = (parseFloat(data['net_weight'])).toFixed(2)
                    data['making_charges'] = (parseFloat(data['make'])).toFixed(2)
                    data['total'] = (parseFloat(data['total'])).toFixed(2)
                    data['rate'] = (parseFloat(data['rate'])).toFixed(2)
                    data['amount'] = (parseFloat(data['amount'])).toFixed(2)
                    data['price'] = (parseFloat(data['price'])).toFixed(2)
                })

                this.setState({
                    billno: this.state.billno + 1,
                    selectedItem: response['data']['data']['selectedItem'],
                    customer_id: response['data']['data'][0]['cid'],
                    mobile: response['data']['data'][0]['mobile'],
                    customer_name: response['data']['data'][0]['cname'],
                    viewModelBox: false
                })

                // this.clearForm();
                // this.openModelView();
            } else {
                // toast.error(response['data']['message']);
                this.toast.show({severity:'error', summary: 'Error', detail: response['data']['message'], life: 3000});
                this.setState({
                    loggedIn: false,
                });
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }

    getViewBill = () => {

        const {
            viewBill
        } = this.state


        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            viewBill: viewBill
        }

        salesService.getViewBill(data).then((response) => {
            if (response['data']['status'] === 1) {
                // toast.success(response['data']['message']);
                this.toast.show({severity:'success', summary: 'Success', detail: response['data']['message'], life: 3000});

                response['data']['data']['selectedItem'].map(data => {
                    data['weight'] = (parseFloat(data['weight'])).toFixed(3)
                    data['net_weight'] = (parseFloat(data['net_weight'])).toFixed(2)
                    data['making_charges'] = (parseFloat(data['make'])).toFixed(2)
                    data['total'] = (parseFloat(data['total'])).toFixed(2)
                    data['rate'] = (parseFloat(data['rate'])).toFixed(2)
                    data['amount'] = (parseFloat(data['amount'])).toFixed(2)
                    data['price'] = (parseFloat(data['price'])).toFixed(2)
                })

                this.setState({
                    billno: viewBill,
                    selectedItem: response['data']['data']['selectedItem'],
                    customer_id: response['data']['data'][0]['cid'],
                    mobile: response['data']['data'][0]['mobile'],
                    customer_name: response['data']['data'][0]['cname'],
                    viewModelBox: false
                })

                // this.clearForm();
                // this.openModelView();
            } else {
                // toast.error(response['data']['message']);
                this.toast.show({severity:'error', summary: 'Error', detail: response['data']['message'], life: 3000});
                this.setState({
                    loggedIn: false,
                });
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }

    draftForm = (e) => {
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
            reference,
            selecteddPay
        } = this.state

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            billno: billno,
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
            selecteddPay: selecteddPay
        }

        console.log(data)

        localStorage.setItem("draft", JSON.stringify(data))
        this.toast.show({ severity: 'success', summary: 'Confirmed', detail: 'Draft Saved Successfully', life: 3000 });
        this.clearForm();

        this.setState({
            draftModelBox: false
        })

        // confirmDialog({
        //     message: 'Do you want to Draft this record?',
        //     header: 'Confirmation',
        //     icon: 'pi pi-info-circle',
        //     accept: () => {
                
        //     },
        //     reject: this.reject
        // });


        // if(this.state.selectedItem.length > 0)
        // {
        //     localStorage.setItem("draft", JSON.stringify(data))
        //     this.clearForm();
        // } else {
        //     alert("Please Select Item")
        // }
    }

    loadForm = (e) => {
        let data = JSON.parse(localStorage.getItem("draft"))

        if(data)
        {
            this.setState({
                billno: data.billno,
                lot_no: data.lot_no,
                item_no: data.item_no,
                ipAddress: data.ipAddress,
                totalQty: data.ArraytotalQty,
                totalGrossWeight: data.totalGrossWeight,
                totalRate: data.totalRate,
                descount: '10%',
                afterDes: data.afterDes,
                selectedItem: JSON.parse(data.selectedItem),
                totalItems: data.totalItems,
                making_charges: data.making_charges,
                customer_id: data.customer_id,
                mobile: data.mobile,
                customer_name: data.customer_name,
                address: data.address,
                remark: data.remark,
                reference: data.reference,
                selecteddPay: data.selecteddPay
            })
        } else {
            alert("No data available")
        }
       
    }

    itemTemplate = (item) => {
        return (
            <div>
                <div style={{ width: '100%' }} onClick={(e) => this.handleselectedItem(e, item)}> <b>Lot no </b>:{item.lot_no} &nbsp;&nbsp;&nbsp;&nbsp; <b>Name :</b> {item.item_name} &nbsp;&nbsp;&nbsp;&nbsp; <b>Gross Weight :</b>{item.gross_weight} &nbsp;&nbsp;&nbsp;&nbsp; <b>Less Weight :</b>{item.less_weight} &nbsp;&nbsp;&nbsp;&nbsp; <b>Net Weight :</b>{item.net_weight} &nbsp;&nbsp;&nbsp;&nbsp; <b>Stock :</b>{item.quan} &nbsp;&nbsp;&nbsp;&nbsp; <b>Item No :</b> {item.item_no}</div>
            </div>
        );
    }

    handleselectedItem = (event, newValue) => {
        console.log(newValue)
        if (newValue) {
            this.setState({
                stack: newValue.item_name,
                name: newValue.item_name,
                item_code: newValue.item_no,
                rate: newValue.price,
                weight: 0,
                net_weight: newValue.net_weight,
                westage: 0,
                making_charges: newValue.making_charge,
                qty: 1,
                qty_total: newValue.quan,
                price_type: newValue.price_type,
                hsn_code: newValue.hsn_code,
                price: newValue.price
            })
        }
        const form = event.target.form;
        console.log(form)
        // form.elements[3].focus();
        // event.preventDefault();
    }

    handleselectedItemOld = (newValue) => {
        console.log(newValue)
        if (newValue) {
            this.setState({
                stackOld: newValue.value.item_name,
                nameOld: newValue.value.item_name,
                rateOld: newValue.value.price,
                weightOld: newValue.value.gross_weight,
                qtyOld: newValue.value.quan,
                amountOld:  parseFloat(newValue.value.gross_weight) + parseFloat(newValue.value.price)
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

    renderFooter = (name) => {
        return (
            <div>
                <div className="p-grid">
                    <div className="p-col-10"></div>
                    <div className="p-col-2">
                        <Button type="submit" className="inputData buttonSecondary" variant="contained" onClick={this.openModel}>
                            <div className="buttonText"> <i className="pi pi-times"></i> <span className="buttonTextFirstLetter">C</span>lose</div>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    handleselectedType = (newValue) => {
        console.log(newValue)
        if (newValue) {
            this.setState({
                type: newValue.value
            })
        }
    }

    handleselectedPurity = (newValue) => {
        console.log(newValue)
        if (newValue) {
            this.setState({
                purity: newValue.value
            })
        }
    }

    handleselectedPAY = (newValue) => {
        if (newValue) {
            this.setState({
                selecteddPay: newValue.target.value
            })
        }
    }

    searchCountry = (event) => {
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
            _filteredCountries.map((data) => {
                data['label'] = data.item_name
                data['code'] = data.item_name
            })
            this.setState({
                flterData: _filteredCountries
            });
            // console.log(this.state.flterData)
        }, 250);
    }

    clearForm = () => {
        this.setState(
            {
                lot_no:'',
                billno: this.state.newbillno,
                selectedItem: [],
                item_code: '',
                rate: '',
                weight: '',
                net_weight: '',
                westage: '',
                making_charges: '',
                qty: '',
                price: 0,
                stack: '',
                stackOld: '',
                ten_total:0,
                selectedOldItem: [],
                nameOld: '',
                qtyOld: '',
                weightOld: '',
                rateOld: '',
                amountOld: '',
                qtyOldTotal: 0,
                weightOldTotal: 0,
                amountOldTotal: 0,
                
                customer_mobile_data: [],
                customer_id: '',
                mobile: '',
                customer_name: '',
                customer_card: '',
                address: '',
                remark: '',
                reference: '',
                filterStack: {},

                modelBox: false,
                tenderModelBox: false,
                cashReceived: 0,
                balance: 0,
                flterData: [],

                tender_cash: 0,
                tender_card: 0,
                tender_other: 0,
                tender_total: 0

            }
        )
        $('#lot_no').focus();
    }

    removeItem = (rowData) => {
        console.log(rowData)
        let data = []
        for (let item of this.state.selectedItem) {
            if (rowData !== item) {
                data.push(item)
            }
        }
        this.setState({
            selectedItem: data
        })
        this.toast.show({ severity: 'info', summary: 'Confirmed', detail: 'Removed from Selected Item', life: 3000 });
    }

    trashSelectedItem(rowData) {
        return (
            <React.Fragment>
                <Button onClick={() => this.removeItem(rowData)} style={{marginLeft:'-20px'}}>
                    <i className="pi pi-trash"></i>
                </Button>
            </React.Fragment>
        );
    }

    clickCustomerTable = (event) => {
        console.log(event)
        this.setState({
            customerModexBox: false,
            customer_id: event.value.cid,
            mobile: event.value.mobile,
            customer_name: event.value.cname,
            address: event.value.add1
        })
        $('#mobile').focus();
    }

    clickRetrivalTable = (event) => {

        const {
            viewBill
        } = this.state


        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            viewBill: event.value.billno
        }

        salesService.getRetriveBill(data).then((response) => {
            if (response['data']['status'] === 1) {
                // toast.success(response['data']['message']);
                this.toast.show({severity:'success', summary: 'Success', detail: response['data']['message'], life: 3000});

                response['data']['data']['selectedItem'].map(data => {
                    data['weight'] = (parseFloat(data['weight'])).toFixed(3)
                    data['net_weight'] = (parseFloat(data['net_weight'])).toFixed(2)
                    data['making_charges'] = (parseFloat(data['make'])).toFixed(2)
                    data['total'] = (parseFloat(data['total'])).toFixed(2)
                    data['rate'] = (parseFloat(data['rate'])).toFixed(2)
                    data['amount'] = (parseFloat(data['amount'])).toFixed(2)
                    data['price'] = (parseFloat(data['price'])).toFixed(2)
                })

                this.setState({
                    selectedItem: response['data']['data']['selectedItem'],
                    customer_id: response['data']['data'][0]['cid'],
                    mobile: response['data']['data'][0]['mobile'],
                    customer_name: response['data']['data'][0]['cname'],
                    viewModelBox: false,
                    retrivalModexBox: false
                })

                // this.clearForm();
                // this.openModelView();
            } else {
                // toast.error(response['data']['message']);
                this.toast.show({severity:'error', summary: 'Error', detail: response['data']['message'], life: 3000});
                this.setState({
                    loggedIn: false,
                });
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }

    clickAgentTable = (event) => {
        console.log(event)
        this.setState({
            agentModexBox: false,
            reference: event.value.aname,
            agentCode: event.value.acode,
        })
        $('#reference').focus();
    }

    clickItemTable = (event) => {
        console.log(event.value)
        var price = 0;

        if(event.value.item_type  == 'Gold')
        {
            price = localStorage.getItem("Gold_rate");
        }
        console.log(event)

        // const form = event.target.form;
        // const index = Array.prototype.indexOf ? Array.prototype.indexOf.call(form, event.target) : 0;
        // // console.log(index) 
        // form.elements[0].focus();
        // event.preventDefault();

        if(this.state.modelBox)
        {
            this.setState({
                suggestionModexBox: false,
                stackOld :event.value.item_no
            })
            $('#stackOld').focus();
        } else {
            this.setState({
                focus: true,
                suggestionModexBox: false,
                lot_no: event.value.lot_no,
                stack: event.value.item_name,
                item_type: event.value.item_type,
                name: event.value.item_name,
                item_code: event.value.item_no,
                rate: price,
                weight: event.value.net_weight,
                net_weight: event.value.net_weight,
                westage: event.value.wastage,
                making_charges: event.value.making_charge,
                qty: 1,
                qty_total: event.value.quan,
                price_type: event.value.price_type,
                hsn_code: event.value.hsn_code,
                price: event.value.price
            })
            $('#weight').focus();
        }
        
    }

    getCal(){

    }
    render() {  

        console.log('SLEC...........',this.state);


        console.log(this.state.selectedItem)

        // if(this.state.success)
        // {
        //     return <Redirect to='/sales-report'></Redirect>
        // }

        var totalStocks = 0;
        var totalQty = 0;
        var totalWeight = 0;
        var totalRate = 0;
        var totalNetWeight = 0;
        var totalMaking = 0;
        var totalAmt = 0;

        this.state.selectedItem.map((data) => {
            totalStocks++
            totalQty = totalQty + parseFloat(data.qty)
            totalWeight = totalWeight + parseFloat(data.weight)
            totalRate = totalRate + parseFloat(data.total)
            totalMaking = totalMaking + parseFloat(data.making_charges)
            totalAmt = totalAmt + parseFloat(data.amount)
        })


        const gross = parseFloat(this.state.weight);
        const wastage = parseFloat(this.state.westage);
        const waste = (gross * wastage) / 100;
        this.state.net_weight = gross + waste



        this.state.totalQty = totalQty
        this.state.totalGrossWeight = totalWeight.toFixed(3)
        this.state.totalRate = totalRate.toFixed(2)
        this.state.total_making = (parseFloat(totalMaking)).toFixed(2)
        this.state.totalItems = totalStocks
        // this.state.tax_amt = 
        this.state.des_amt = (parseFloat((parseFloat(this.state.des_per) * totalRate) / 100)).toFixed(2)
        this.state.total_sub = (parseFloat(totalAmt)).toFixed(2)
        this.state.afterDes = (parseFloat(totalRate)).toFixed(2)

        var qtyOldTotal = 0;
        var weightOldTotal = 0;
        var amountOldTotal = 0;
        

        if(this.state.selectedOldItem)
        {
            this.state.selectedOldItem.map((data) => {
                qtyOldTotal = qtyOldTotal + parseFloat(data.qtyOld)
                weightOldTotal = weightOldTotal + parseFloat(data.weightOld)
                amountOldTotal = amountOldTotal + parseFloat(data.amountOld)
               
            })
        }
        
        this.state.qtyOldTotal = qtyOldTotal
        this.state.weightOldTotal = weightOldTotal
        this.state.amountOldTotal = amountOldTotal


        const fontIns = { fontSize: '0.6rem', margin: 0 };

        const lebelProps = { fontSize: '0.7rem', margin: -7 };

        if (this.state.gross_weight && this.state.loss_weight) {
            this.state.net_weight = (this.state.gross_weight - this.state.loss_weight)
        }

        // var lot_number = this.state.lot_no
        var item_number = this.state.item_no
        var count = 1

        this.state.selectedItem.map((data) => {
            data['sr_no'] = count
            // data['lot_no'] = lot_number
            data['item_no'] = item_number
            data['weight'] = (parseFloat(data['weight'])).toFixed(3)
            data['net_weight'] = (parseFloat(data['net_weight'])).toFixed(2)
            data['making_charges'] = (parseFloat(data['making_charges'])).toFixed(2)
            data['total'] = (parseFloat(data['total'])).toFixed(2)
            data['rate'] = (parseFloat(data['rate'])).toFixed(2)
            data['amount'] = (parseFloat(data['amount'])).toFixed(2)
            data['price'] = (parseFloat(data['price'])).toFixed(2)
            // lot_number++
            item_number++
            count++
        })

        const lebelStyle = { fontSize: '12px', color: 'black', fontWeight: '700' };

        const lebelStyleTender = { fontSize: '12px', color: 'black', fontWeight: '700', padding:'10px 0px'};

        this.state.tender_total = (this.state.tender_cash || this.state.tender_card || this.state.tender_other)?( parseFloat(this.state.tender_cash) + parseFloat(this.state.tender_card) + parseFloat(this.state.tender_other)).toFixed(2): 0.00

        // this.state.ten_total = this.state.tender_total +  this.state.ten_total

        this.state.net_total = parseFloat(this.state.afterDes) - parseFloat(this.state.amountOldTotal)
        // alert(date)
        return (
            <div className="body">
                <Toast ref={(el) => this.toast = el} />
                <Menu loggedIn={this.state.loggedIn} />
                <form autoComplete="off">

                <div className="continerPonitBox" style={{ padding: '0px' }}>
                    
                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '76%', borderRight: '1px solid silver', padding: '0px 20px', overflow: 'hidden' }}>
                                {/* <form onSubmit={this.submitStock} autoComplete="off"> */}

                                <br></br>
                                <div className="p-grid pos-header" style={{ color: 'white', textShadow: '0px 0px 5px black', marginTop: '-20px', marginLeft: '-20px', width: '105%', border: '1px solid silver' }}>
                                    <div className="p-col-4" >
                                        <h3 style={{ margin: '0px' }}>
                                            Estimate Master
                                        </h3>
                                    </div>
                                    <div className="p-col-8">
                                        <h3 style={{ margin: '0px' }}>{this.state.name}</h3>
                                    </div>
                                </div>
                                {/* <hr style={{border: '1px solid #ebeff5'}}></hr> */}
                                <div className="p-grid header-1" style={{ margin: '10px 0px 0px' }}>
                                    <div className="p-col-3 column-input">
                                        <div className="p-field">
                                            <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Lot No (Search using Name)</label>
                                            {/* <AutoComplete style={{width:'200px'}}  value={this.state.stack} suggestions={this.state.flterData} completeMethod={this.searchCountry} dropdown forceSelection
                                            field="item_name" name="stack" onKeyDown={this.handleEnter} itemTemplate={this.itemTemplate}
                                            className="p-d-block InputPrimeBox" onChange={this.onChangeLotNumber}>

                                            </AutoComplete> */}
                                            <InputText id="lot_no" value={this.state.lot_no} name="lot_no" aria-describedby="username1-help" autoFocus  onChange={this.onChangeLotNumber} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                        </div>
                                    </div>
                                    <div className="p-col-9">
                                        <div className="p-grid">
                                            <div className="p-col-2 column-input">
                                                <div className="p-field">
                                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Rate</label>
                                                    <InputText id="username1" value={this.state.rate} name="rate" aria-describedby="username1-help" onChange={this.onChange} onClick={this.onChangeEmpty} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                                </div>
                                            </div>
                                            <div className="p-col-2 column-input">
                                                <div className="p-field">
                                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Weight </label>
                                                    <InputText id="weight" value={this.state.weight} name="weight" aria-describedby="username1-help"  onChange={this.onChange} onClick={this.onChangeEmpty} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                                </div>
                                            </div>
                                            <div className="p-col-2 column-input">
                                                <div className="p-field">
                                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Wastage %</label>
                                                    <InputText id="username1" value={this.state.westage} name="westage" aria-describedby="username1-help" onChange={this.onChange} onClick={this.onChangeEmpty} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                                </div>
                                            </div>
                                            <div className="p-col-2 column-input">
                                                <div className="p-field">
                                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Net Weight</label>
                                                    <InputText id="username1" value={this.state.net_weight ? this.state.net_weight : 0} name="net_weight" aria-describedby="username1-help" onChange={this.onChange} onClick={this.onChangeEmpty} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                                </div>
                                            </div>
                                            <div className="p-col-2 column-input">
                                                <div className="p-field">
                                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Making Charges</label>
                                                    <InputText id="username1" value={this.state.making_charges} name="making_charges" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} onClick={this.onChangeEmpty} className="p-d-block InputPrimeBox" />
                                                </div>
                                            </div>
                                            <div className="p-col-2 column-input">
                                                <div className="p-field">
                                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Qty</label>
                                                    <InputText id="username1" value={this.state.qty} name="qty" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} onClick={this.onChangeEmpty} className="p-d-block InputPrimeBox" />
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                </div>
                                <div className='table-style' id="pos-tab">
                                    <div style={{ width: '2000px', marginTop: '-5px' }}>
                                        {/* <ScrollBox style={{height: '200px',width:'100%'}} axes="1500px"> */}
                                        <DataTable state={{ overflowY: 'scroll' }} editMode="row" onRowEditInit={this.onRowEditInit} onRowEditCancel={this.onRowEditCancel}
                                            value={this.state.selectedItem} rows={3} first={this.state.first} onPage={(e) => this.setState({ first: e.first })}
                                            emptyMessage="No Item found.">
                                            <Column body={this.trashSelectedItem} headerStyle={{ width: '30px', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                                            <Column style={{ width: '70px' }}   field="sr_no" header="Sno" editor={(props) => this.codeEditor('selectedItem', props,'sr_no')}></Column>
                                            <Column style={{ width: '70px' }}   field="lot_no" header="Lot_No" editor={(props) => this.codeEditor('selectedItem', props,'lot_no')}></Column>
                                            <Column style={{ width: '180px' }}  field="name" header="Name"></Column>
                                            <Column style={{ width: '120px' }}  field="qty" header="Qty/Pcs"></Column>
                                            <Column style={{ width: '100px',textAlign:'right' }}  field="weight" header="Weight"></Column>
                                            <Column style={{ width: '120px',textAlign:'right' }} field="westage" header="Wastage %"></Column>
                                            <Column style={{ width: '120px',textAlign:'right' }} field="net_weight" header="Total Weight"></Column>
                                            <Column style={{ width: '120px',textAlign:'right' }} field="rate" header="Rate"></Column>
                                            <Column style={{ width: '120px',textAlign:'right' }} field="amount" header="Amount"></Column>
                                            <Column style={{ width: '150px',textAlign:'right' }} field="making_charges" header="Making Charges"></Column>
                                            <Column style={{ width: '120px',textAlign:'right' }} field="total" header="Total"></Column>
                                            <Column style={{ width: '100px' }} field="hsn_code" header="HSN"></Column>
                                            <Column style={{ width: '120px' }} field="item_code" header="Item Code"></Column>
                                            <Column style={{ width: '200px' }} field="price_type" header="Price Type"></Column>
                                            <Column rowEditor headerStyle={{ width: '7rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                                        </DataTable>
                                        {/* </ScrollBox> */}
                                    </div>
                                </div>

                                <div className="p-grid" style={{ marginTop: '10px' }}>
                                    <div className="p-col-1 column-input">
                                        <label htmlFor="username1" style={lebelStyle}>Cust_Id</label>
                                        <span className="p-float-label" style={{ marginTop: '5px' }}>
                                            <InputText id="customer_id" value={this.state.customer_id} name="customer_id" aria-describedby="username1-help" onChange={this.onCustomerUser} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                            {/* <Dropdown value={this.state.customer_id} options={this.state.customer_data} name="customer_id" onChange={this.handleselectedUser} style={{ width: '100%', padding: '0px', height: '35px' }} filter editable optionLabel="name" /> */}
                                        </span>
                                        {/* <div className="p-field">
                                <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Customer ID</label>
                                <InputText id="username1" aria-describedby="username1-help" value={this.state.customer_id} name="customer_id" onChange ={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox"/>
                            </div> */}
                                    </div>
                                    <div className="column-input" style={{width:'120px'}}>
                                        <div className="p-field">
                                            <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Mobile</label>
                                            <InputText id="mobile" aria-describedby="username1-help" value={this.state.mobile} name="mobile" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                        </div>
                                    </div>
                                    <div className="p-col-3 column-input">
                                        <div className="p-field">
                                            <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Customer Name</label>
                                            <InputText id="username1" aria-describedby="username1-help" value={this.state.customer_name} name="customer_name" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                        </div>
                                    </div>
                                    <div className="column-input" style={{width:'80px'}}>
                                        <div className="p-field">
                                            <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Agent Code</label>
                                            <InputText id="reference" aria-describedby="username1-help" value={this.state.agentCode} name="reference" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                        </div>
                                    </div>
                                    <div className="p-col-2 column-input">
                                        <div className="p-field">
                                            <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Agent Name</label>
                                            <InputText id="reference" aria-describedby="username1-help" value={this.state.reference} name="reference" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                        </div>
                                    </div>
                                    <div className="column-input" style={{width:'200px'}}>
                                        <div className="p-field">
                                            <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Remarks</label>
                                            <InputText id="username1" aria-describedby="username1-help" value={this.state.remark} name="remark" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-grid">
                                    <div className="p-col-2 submitFormButton">
                                        {(this.state.newbillno === this.state.billno) ?
                                            <Button onClick={this.submitStackForm} className="inputData buttonSecondary" variant="contained" onKeyDown={this.handleEnter}>
                                                <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">S</span>ave</div>
                                            </Button> :
                                            <Button onClick={this.submitStackForm} className="inputData buttonSecondary" variant="contained" onKeyDown={this.handleEnter}>
                                                <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">A</span>lter</div>
                                            </Button>
                                        }
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.openModelTender} onKeyDown={this.handleEnter}>
                                            <div className="buttonText"> <i className="pi pi-book"></i> <span className="buttonTextFirstLetter">T</span>ender</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.openModelDraft} onKeyDown={this.handleEnter}>
                                            <div className="buttonText"> <i className="pi pi-calendar-plus"></i> <span className="buttonTextFirstLetter">D</span>raft</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.loadForm} onKeyDown={this.handleEnter}>
                                            <div className="buttonText"> <i className="pi pi-external-link"></i> <span className="buttonTextFirstLetter">L</span>oad</div>
                                        </Button>
                                    </div>
                                    
                                    <div className="p-col-2 submitFormButton">
                                        <Button onClick={this.submitStackHoldForm} className="inputData buttonSecondary" variant="contained" onKeyDown={this.handleEnter}>
                                            <div className="buttonText"> <i className="pi pi-microsoft"></i> <span className="buttonTextFirstLetter">H</span>old</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.openModelRetrival} onKeyDown={this.handleEnter}>
                                            <div className="buttonText"> <i className="pi pi-plus-circle"></i> <span className="buttonTextFirstLetter">R</span>etrive</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.openModel} onKeyDown={this.handleEnter}>
                                            <div className="buttonText"> <i className="pi pi-shopping-cart"></i> <span className="buttonTextFirstLetter">O</span>ld Item</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.getLastBill} onKeyDown={this.handleEnter}>
                                            <div className="buttonText"> <i className="pi pi-angle-double-left"></i> <span className="buttonTextFirstLetter">L</span>ast Bil</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.getNextBill} onKeyDown={this.handleEnter}>
                                            <div className="buttonText"><span className="buttonTextFirstLetter">N</span>ext Bill  <i className="pi pi-angle-double-right"></i> </div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.openModelView} onKeyDown={this.handleEnter}>
                                            <div className="buttonText"> <i className="pi pi-eye"></i> <span className="buttonTextFirstLetter">V</span>iew</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.clearForm} onKeyDown={this.handleEnter}>
                                            <div className="buttonText"> <i className="pi pi-trash"></i> <span className="buttonTextFirstLetter">C</span>lear</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Link to="/home" className="Link">
                                            <Button className="inputData buttonSecondary" variant="contained" onKeyDown={this.handleEnter}>
                                                <div className="buttonText"> <i className="pi pi-times-circle"></i> <span className="buttonTextFirstLetter">C</span>lose</div>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                            </div>
                            <div style={{ marginTop: '25px', width: '25%', padding: '0px 8px' }}>
                                <div className="p-grid">
                                    <div className="p-col-12 right_total_box">
                                        <div className="p-grid">
                                            <div className="p-col-4 right_total_box_title">
                                                Bill Number
                                            </div>
                                            <div className="p-col-8 right_total_box_amount">
                                                {this.state.billno}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-col-12 right_total_box" style={{height:'40px'}}>
                                        <div className="p-grid">
                                            <div className="p-col-4 right_total_box_title">
                                                Date
                                            </div>
                                            <div className="p-col-8">
                                                <div className="p-grid">
                                                    <InputText className="p-col-6 right_total_box_amount" aria-describedby="username1-help" name="todaydate" value={this.state.todaydate} onKeyDown={this.handleEnter} onChange={this.onChange} />
                                                    <InputText className="p-col-6 right_total_box_amount" aria-describedby="username1-help" name="currentTime" value={this.state.currentTime} onKeyDown={this.handleEnter} onChange={this.onChange} />
                                                </div>
                                            </div>
                                            {/* <div className="p-col-8 right_total_box_amount">
                                                {this.state.todaydate} <span style={{ borderLeft: '2px solid white' }}> &nbsp; {this.state.currentTime} </span>
                                            </div> */}
                                        </div>
                                    </div>
                                    <div className="p-col-12 right_total_box" style={{height:'40px'}}>
                                        <div className="p-grid">
                                            <div className="p-col-4 right_total_box_title">
                                                Total Items
                                            </div>
                                            {/* <div className="p-col-8 right_total_box_amount">
                                                {this.state.totalItems}  <span style={{ borderLeft: '2px solid white' }}> &nbsp; {this.state.totalQty} </span>
                                            </div> */}
                                            <div className="p-col-8">
                                                <div className="p-grid">
                                                    <InputText className="p-col-6 right_total_box_amount" aria-describedby="username1-help" name="des_per" value={this.state.totalItems} onKeyDown={this.handleEnter} onChange={this.onChange} />
                                                    <InputText className="p-col-6 right_total_box_amount" aria-describedby="username1-help" name="des_per" value={this.state.totalQty} onKeyDown={this.handleEnter} onChange={this.onChange} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="p-col-6 right_total_box">
                                <div className="p-grid">
                                    <div className="p-col-12 right_total_box_amount">
                                        
                                        {this.state.totalQty}
                                    </div>
                                </div>
                            </div> */}
                            <div className="p-col-12 right_total_box">
                                        <div className="p-grid">
                                            <div className="p-col-4 right_total_box_title">
                                                Total Weight
                                            </div>
                                            <div className="p-col-8 right_total_box_amount">
                                                {this.state.totalGrossWeight}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-col-12 right_total_box">
                                        <div className="p-grid">
                                            <div className="p-col-4 right_total_box_title">
                                                Sub Total
                                            </div>
                                            <InputText className="p-col-8 right_total_box_amount" aria-describedby="username1-help" name="totalRate" value={this.state.total_sub} onKeyDown={this.handleEnter} onChange={this.onChange} />
                                            {/* <div className="p-col-8 right_total_box_amount">
                                            {this.state.totalRate}
                                        </div> */}
                                        </div>
                                    </div>

                                    
                                    {/* <div className="p-col-12 right_total_box">
                                        <div className="p-grid">
                                            <div className="p-col-4 right_total_box_title">
                                                Dis Amt
                                            </div>
                                            <div className="p-col-8 right_total_box_amount">
                                                {this.state.des_amt}
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="p-col-12 right_total_box">
                                        <div className="p-grid">
                                            <div className="p-col-4 right_total_box_title">
                                                Making
                                            </div>
                                            {/* <div className="p-col-8 right_total_box_amount"> */}
                                            <InputText className="p-col-8 right_total_box_amount" aria-describedby="username1-help" name="total_making" value={this.state.total_making} onKeyDown={this.handleEnter} onChange={this.onChange} />
                                            {/* </div> */}
                                        </div>
                                    </div>
                                    <div className="p-col-12 right_total_box">
                                        <div className="p-grid">
                                            <div className="p-col-4 right_total_box_title">
                                                Old Value
                                            </div>
                                            <div className="p-col-8 right_total_box_amount">
                                                {this.state.amountOldTotal}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-col-12 right_total_box" style={{height:'40px'}}>
                                        <div className="p-grid">
                                            <div className="p-col-4 right_total_box_title">
                                                Dis%
                                            </div>
                                            <div className="p-col-8">
                                                
                                                <div className="p-grid">
                                                    <InputText className="p-col-6 right_total_box_amount" aria-describedby="username1-help" id="des_per" name="des_per" value={this.state.des_per} onKeyDown={this.handleEnter} onChange={this.onChange} />
                                                    <InputText className="p-col-6 right_total_box_amount" aria-describedby="username1-help" id="des_amt" name="des_amt" value={this.state.des_amt} onKeyDown={this.handleEnter} onChange={this.onChange} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    
                                    <div className="p-col-12 right_total_box">
                                        <div className="p-grid">
                                            <div className="p-col-4 right_total_box_title">
                                                Grand Total
                                            </div>
                                            <InputText className="p-col-8 right_total_box_amount" aria-describedby="username1-help" name="totalRate" value={(parseFloat(this.state.total_sub) + parseFloat(this.state.total_making) - parseFloat(this.state.amountOldTotal) - parseFloat(this.state.des_amt)).toFixed(2)} onKeyDown={this.handleEnter} onChange={this.onChange} />
                                            {/* <div className="p-col-8 right_total_box_amount">
                                            0.00
                                    </div> */}
                                        </div>
                                    </div>
                                    <div className="p-col-12 right_total_box" style={{height:'40px'}}>
                                        <div className="p-grid">
                                            <div className="p-col-4 right_total_box_title">
                                                Tax Amt
                                            </div>
                                            <div className="p-col-8">
                                                
                                                <div className="p-grid">
                                                    <InputText className="p-col-6 right_total_box_amount" aria-describedby="username1-help" id="des_per" name="tax_per" value={this.state.tax_per} onKeyDown={this.handleEnter} onChange={this.onChange} />
                                                    <InputText className="p-col-6 right_total_box_amount" aria-describedby="username1-help" name="tax_amt" value={(parseFloat((this.state.tax_per * parseFloat(this.state.totalRate - this.state.des_amt)) / 100)).toFixed(2)} onKeyDown={this.handleEnter} onChange={this.onChange} />
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className="p-col-12 right_total_box">
                                        <div className="p-grid">
                                            <div className="p-col-4 right_total_box_title">
                                                Others
                                            </div>
                                            <InputText className="p-col-8 right_total_box_amount" aria-describedby="username1-help" id="others" name="others" value={this.state.others} onKeyDown={this.handleEnter} onClick={this.onChangeEmpty} onChange={this.onChange} />
                                        </div>
                                    </div>
                                    
                                    <div className="p-col-12 right_total_box">
                                        <div className="p-grid">
                                            <div className="p-col-4" style={{ padding: '15px 10px' }}>
                                                Pay Mode 
                                            </div>
                                            <div className="p-col-8" style={{ color: 'black', cursor: 'pointer',padding:'10px 0px' }}>
                                                {/* <Select style={{ color: 'black', padding: '0px 10px' }} aria-describedby="username1-help" placeholder={<div>Cash</div>} onChange={this.handleselectedPAY} onKeyDown={this.handleEnter} value={this.state.selecteddPay} options={this.state.payMode} /> */}
                                                <select style={{padding:'5px 10px', fontWeight:'700', width:'100%',outline:'none'}} onChange={this.handleselectedPAY} onKeyDown={this.handleEnter} value={this.state.selecteddPay}>
                                                    <option style={{padding:'15px 10px'}} value="Cash">Cash</option>
                                                    <option style={{padding:'15px 10px'}} value="Card">Card</option>
                                                    <option style={{padding:'15px 10px'}} value="Credit">Credit</option>
                                                    <option style={{padding:'15px 10px'}} value="Multipay">Multipay</option>
                                                    <option style={{padding:'15px 10px'}} value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-col-12" style={{ padding: '0px' }}>
                                        <div className="p-grid right_final_total_box">
                                            <div className="p-col-4">
                                                <h3 style={{ padding: '0px', margin: '0px' }}>Net Total</h3>
                                            </div>
                                            <div className="p-col-8" style={{textAlign: 'right', marginTop:'-11px' }}>
                                                <input style={{fontSize:'1.83em',width:'106%',background: 'none',outline:'none', border: 'none',textAlign: 'right'}} className="p-col-8" aria-describedby="username1-help" name="net_total" value={(parseFloat(this.state.net_total) - parseFloat(this.state.others) - parseFloat(this.state.des_amt)).toFixed(2)} onKeyDown={this.handleEnter} onChange={this.onChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-col-12" style={{ padding: '0px' }}>
                                        <div className="p-grid right_final_total_box">
                                            <div className="p-col-4">
                                                <h3 style={{ padding: '0px', margin: '0px' }}> Received </h3>
                                            </div>
                                            <div className="p-col-8" style={{ textAlign: 'right', marginTop:'-11px'  }}>
                                            <input  id="username1"  style={{fontSize:'1.83em',width:'106%',background: 'none',outline:'none', border: 'none',textAlign: 'right'}} className="p-col-8" aria-describedby="username1-help" name="tender_total" value={this.state.tender_total} onChange={this.onChange} onKeyDown={this.handleEnter} />
                                            {/* <InputText style={{background: 'none',fontSize:'2rem',outline:'none', border: 'none',textAlign: 'right',  color: 'white'}} className="p-col-8" aria-describedby="username1-help" name="tax_amt" value={this.state.tender_total ? (this.state.tender_total).toFixed(2) : this.state.tender_total.toFixed(2)} onKeyDown={this.handleEnter} onChange={this.onChange} /> */}
    
                                                {/* : <InputText style={{width:'90%'}} name="cashReceived" value={this.state.cashReceived} onChange ={this.onChange} /> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-col-12" style={{ padding: '0px' }}>
                                        <div className="p-grid right_final_total_box">
                                            <div className="p-col-4">
                                                <h3 style={{ padding: '0px', margin: '0px' }}>Balance </h3>
                                            </div>
                                            <div className="p-col-8" style={{ textAlign: 'right', marginTop:'-11px'  }}>
                                                <input style={{fontSize:'1.83em',width:'106%',background: 'none',outline:'none', border: 'none',textAlign: 'right'}} className="p-col-8" aria-describedby="username1-help" name="net_total" value={(parseFloat(this.state.net_total) - parseFloat(this.state.others) - parseFloat(this.state.des_amt) - parseFloat(this.state.tender_total)).toFixed(2)} onKeyDown={this.handleEnter} onChange={this.onChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
                <Footer />

                {/* Dialog box */}
                <Dialog header="Old Items Entry" visible={this.state.modelBox} modal style={{ width: '80vw', height: 'auto', backgroundColor: 'white', padding: '10px 0px 0px' }} onHide={this.openModel}
                    draggable={true} resizable={false} baseZIndex={1}>
                    <div>
                        <form onSubmit={this.submitOldIem} autoComplete="off">
                            <div className="p-grid" style={{ margin: '0px' }}>
                                <div className="p-col-2 column-input-old">
                                    {/* <span className="p-float-label">
                                        <Dropdown value={this.state.stackOld} options={this.state.stock} name="customer_id" onChange={this.handleselectedItemOld} style={{ width: '100%', padding: '0px', height: '35px' }} filter editable optionLabel="name" />
                                        <label htmlFor="username1" style={lebelStyle}>Item Number</label>
                                    </span> */}
                                    {/* <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Item Number</label>
                                        <InputText id="stackOld" value={this.state.stackOld} name="lot_no" aria-describedby="username1-help" autoFocus  onChange={this.handleselectedItemOld} onKeyDown={this.handleEnterOld} className="p-d-block InputPrimeBox" />
                                    </div> */}
                                    <span className="p-field">
                                        <label htmlFor="username1" style={lebelStyle}>Item Name</label>
                                        <Dropdown id="stackOld" name="stackOld" value={this.state.stackOld} options={this.state.stock} autoFocus onChange={this.handleselectedItemOld} onKeyDown={this.handleEnterOld} style={{ width: '100%', padding: '0px', height: '35px' }} filter editable optionLabel="name" />
                                    </span>
                                </div>
                                <div className="p-col-2 column-input-old">
                                    <span className="p-field">
                                        <label htmlFor="username1" style={lebelStyle}>Type</label>
                                        <Dropdown name="type" value={this.state.type} options={this.state.typeList} onChange={this.handleselectedType} onKeyDown={this.handleEnterOld} style={{ width: '100%', padding: '0px', height: '35px' }} filter editable optionLabel="name" />
                                    </span>
                                </div>
                                <div className="p-col-2 column-input-old">
                                    <span className="p-field">
                                        <label htmlFor="username1" style={lebelStyle}>Purity</label>
                                        <Dropdown name="purity" value={this.state.purity} options={this.state.purityList} onChange={this.handleselectedPurity} onKeyDown={this.handleEnterOld} style={{ width: '100%', padding: '0px', height: '35px' }} filter editable optionLabel="name" />
                                    </span>
                                </div>
                                <div className="p-col-1 column-input-old">
                                    <span className="p-field">
                                        <label htmlFor="username1" style={lebelStyle}>PCS( Qty )</label>
                                        <InputText id="billno" aria-describedby="username1-help" name="qtyOld" value={this.state.qtyOld} onChange={this.onChange} onKeyDown={this.handleEnterOld} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </span>
                                </div>

                                <div className="p-col-1 column-input-old" >
                                    <span className="p-field">
                                        <label htmlFor="username1" style={lebelStyle}>Weight</label>
                                        <InputText id="billno" aria-describedby="username1-help" name="weightOld" value={this.state.weightOld} onChange={this.onChange} onKeyDown={this.handleEnterOld} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </span>
                                </div>
                                <div className="p-col-2 column-input-old">
                                    <span className="p-field">
                                        <label htmlFor="username1" style={lebelStyle}>Rate / grm</label>
                                        <InputText id="billno" aria-describedby="username1-help" name="rateOld" value={this.state.rateOld} onChange={this.onChange} onKeyDown={this.handleEnterOld} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                        
                                    </span>
                                </div>
                                <div className="p-col-2 column-input-old">
                                    <span className="p-field">
                                        <label htmlFor="username1" style={lebelStyle}>Amount</label>
                                        <InputText id="billno" aria-describedby="username1-help" name="amountOld" value={this.state.amountOld} onChange={this.onChange} onKeyDown={this.handleEnterOld} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                        
                                    </span>
                                </div>
                                {/* <div className="p-col-2" style={{ padding: '15px 10px' }}>
                                    <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                        <div className="buttonText">
                                            <i className="pi pi-plus-circle"></i>  <span className="buttonTextFirstLetter" style={{ marginTop: '-5px' }}>A</span>dd
                                        </div>
                                    </Button>
                                </div> */}
                            </div>
                        </form>
                        <div  style={{ height: '250px', border: '2px solid #b0a939', overflowX: 'scroll' }}>
                            <div style={{ width: '1000px', marginTop: '-5px' }}>
                                <DataTable state={{ overflowY: 'scroll' }} style={{width:'1200px'}}
                                    value={this.state.selectedOldItem} rows={3} first={this.state.first} onPage={(e) => this.setState({ first: e.first })}
                                    emptyMessage="No Item Selected.">
                                    <Column style={{ width: '250px' }} field="nameOld" header="Item Name"></Column>
                                    <Column style={{ width: '150px' }} field="type" header="Type"></Column>
                                    <Column style={{ width: '200px' }} field="purity" header="Purity"></Column>
                                    <Column style={{ width: '150px' }} field="qtyOld" header="PCS Qty"></Column>
                                    <Column style={{ width: '150px' }} field="weightOld" header="Weight"></Column>
                                    <Column style={{ width: '150px' }} field="rateOld" header="Rate / grm"></Column>
                                    <Column style={{ width: '150px' }} field="amountOld" header="Amount"></Column>
                                    <Column body={this.actionBodyTemplate} headerStyle={{ width: '8em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                                </DataTable>
                            </div>  
                        </div>
                        <div className="p-grid" style={{ margin: '20px 0px 0px'  }}>
                            <div className="p-col-4 column-input-2">
                                <span className="p-float-label">
                                    <InputText id="billno" aria-describedby="username1-help" name="item_code" value={this.state.qtyOldTotal} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    <label htmlFor="username1" style={lebelStyle}>Qty</label>
                                </span>
                            </div>
                            <div className="p-col-4 column-input-2">
                                <span className="p-float-label">
                                    <InputText id="billno" aria-describedby="username1-help" name="item_code" value={this.state.weightOldTotal} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    <label htmlFor="username1" style={lebelStyle}>Weight</label>
                                </span>
                            </div>
                            <div className="p-col-4 column-input-2">
                                <span className="p-float-label">
                                    <InputText id="billno" aria-describedby="username1-help" name="item_code" value={this.state.amountOldTotal} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    <label htmlFor="username1" style={lebelStyle}>Amount</label>
                                </span>
                            </div>
                        </div>
                        <div className="p-grid" style={{ margin: '0px 0px' }}>
                            <div className="p-col-8"></div>
                            <div className="p-col-2">
                                <Button type="submit" className="inputData buttonSecondary" variant="contained" onClick={this.openModelClose}>
                                    <div className="buttonText"> <i className="pi pi-times"></i> <span className="buttonTextFirstLetter">C</span>lear</div>
                                </Button>
                            </div>
                            <div className="p-col-2">
                                <Button type="submit" className="inputData buttonPrimary" variant="contained" onClick={this.openModel}>
                                    <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">S</span>ave</div>
                                </Button>
                            </div>  
                        </div>
                    </div>
                </Dialog>

                <Dialog header="Tender" visible={this.state.tenderModelBox} modal style={{ width: '40vw', height: 'auto', backgroundColor: 'white' }} onHide={this.openModelTender}
                    draggable={true} resizable={false} baseZIndex={1}>
                    <form>
                        <div className="p-grid" style={{ margin: '20px' }}>
                            <div className="p-col-3 column-input">
                                <label htmlFor="username1" className="p-d-block" style={lebelStyleTender}>Cash</label>
                            </div>
                            <div className="p-col-9 column-input">
                                <div className="p-field">
                                    <InputText id="username1" aria-describedby="username1-help" name="tender_cash" value={this.state.tender_cash} onChange={this.onChangeTender} onKeyDown={this.handleEnterTender} className="p-d-block InputPrimeBox" />
                                </div>
                            </div>
                            <div className="p-col-3 column-input">
                                <label htmlFor="username1" className="p-d-block" style={lebelStyleTender}>Card</label>
                            </div>
                            <div className="p-col-9 column-input">
                                <div className="p-field">
                                    <InputText id="username1" aria-describedby="username1-help" name="tender_card" value={this.state.tender_card} onChange={this.onChangeTender} onKeyDown={this.handleEnterTender} className="p-d-block InputPrimeBox" />
                                </div>
                            </div>
                            <div className="p-col-3 column-input">
                                <label htmlFor="username1" className="p-d-block" style={lebelStyleTender}>Other</label>
                            </div>
                            <div className="p-col-9 column-input">
                                <div className="p-field">
                                    <InputText id="username1" aria-describedby="username1-help" name="tender_other" value={this.state.tender_other} onChange={this.onChangeTender} onKeyDown={this.handleEnterTender} className="p-d-block InputPrimeBox" />
                                </div>
                            </div>
                            <div className="p-col-3 column-input">
                                <label htmlFor="username1" className="p-d-block" style={lebelStyleTender}>Payment Remarks</label>
                            </div>
                            <div className="p-col-9 column-input">
                                <div className="p-field">
                                    <InputText id="username1" aria-describedby="username1-help" name="pay_remarks" value={this.state.pay_remarks} onChange={this.onChangeTender} onKeyDown={this.handleEnterTender} className="p-d-block InputPrimeBox" />
                                </div>
                            </div>
                            <div className="p-col-12"><hr></hr></div>
                            <div className="p-col-3 column-input">
                                <label htmlFor="username1" className="p-d-block" style={lebelStyleTender}>Net Total</label>
                            </div>
                            <div className="p-col-9 column-input">
                                <div className="p-field">
                                    <InputText id="username1" aria-describedby="username1-help" name="ten_total" value={(parseFloat(this.state.net_total) - parseFloat(this.state.others) - parseFloat(this.state.des_amt)).toFixed(2)} onChange={this.onChangeTender} onKeyDown={this.handleEnterTender} className="p-d-block InputPrimeBox" />
                                </div>
                            </div>
                            <div className="p-col-3 column-input">
                                <label htmlFor="username1" className="p-d-block" style={lebelStyleTender}>Received</label>
                            </div>
                            <div className="p-col-9 column-input">
                                <div className="p-field">
                                    <InputText id="username1" aria-describedby="username1-help" name="ten_total" value={this.state.tender_total} onChange={this.onChangeTender} onKeyDown={this.handleEnterTender} className="p-d-block InputPrimeBox" />
                                </div>
                            </div>
                            <div className="p-col-3 column-input">
                                <label htmlFor="username1" className="p-d-block" style={lebelStyleTender}>Required Amt</label>
                            </div>
                            <div className="p-col-9 column-input">
                                <div className="p-field">
                                    <InputText id="username1" aria-describedby="username1-help" name="ten_total" value={(parseFloat(this.state.tender_total) - ((parseFloat(this.state.net_total) - parseFloat(this.state.others) - parseFloat(this.state.des_amt)))).toFixed(2)} onChange={this.onChangeTender} onKeyDown={this.handleEnterTender} className="p-d-block InputPrimeBox" />
                                </div>
                            </div>
                            
                        </div>
                    </form>
                    <div className="p-grid" style={{margin:'0px 20px', marginTop:'-23px'}}>
                        <div className="p-col-6">
                            <Button onClick={this.openModelTender} style={{margin:'5px',marginLeft:'-5px', width: '95% !important'}} className="inputData buttonPrimary" variant="contained">
                                <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">S</span>elect</div>
                            </Button>
                        </div>
                        <div className="p-col-6">
                            <Button onClick={this.closeModelTender} style={{margin:'5px',marginLeft:'-5px', width: '95% !important'}} className="inputData buttonSecondary" variant="contained">
                                <div className="buttonText"> <i className="pi pi-times-circle"></i> <span className="buttonTextFirstLetter">C</span>lose</div>
                            </Button>
                        </div>
                        
                    </div>
                </Dialog>

                <Dialog header="Saved Successfully" visible={this.state.printModelBox} modal style={{ width: '30vw', height: 'auto', backgroundColor: 'white', padding:'20px' }} onHide={this.openModelPrint}
                    draggable={true} resizable={false} baseZIndex={1}>
                    You want to print bill ?
                    <br></br><br></br><br></br>
                    <div className="row">
                        <div className="col-6">
                            <Button type="submit" className="inputData buttonSecondary" variant="contained">
                                <div className="buttonText"> <span className="buttonTextFirstLetter"> <i className="pi pi-times-circle"></i> C</span>lose</div>
                            </Button>
                        </div>
                        <div className="col-1"></div>
                        <div className="col-6">
                            <Link
                                to={{
                                    pathname: "/sales-print",
                                    state: {
                                        user: this.state.customer_name,
                                        billno: this.state.billno,
                                        created_on: this.state.todaydate,
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
                <Dialog visible={this.state.suggestionModexBox} modal={false} position="left" style={this.state.suggestionModexBox?this.getTop():{'color':'red'}} onHide={this.openModelSuggestion}
                    draggable={true} clearable={false} resizable={false} baseZIndex={1}>
                            
                    <div style={{ height: '350px', border: '2px solid #b0a939', overflowX: 'scroll' }}>
                        <div style={{ width: 'auto', marginTop: '-5px' }}>
                            {/* <ScrollBox style={{height: '200px',width:'100%'}} axes="1500px"> */}
                            <DataTable autofocus id="item_table" state={{ overflowY: 'scroll' }} selectionMode="single" selection={this.state.selectedProducts} dataKey="item_no"
                                value={this.state.stock} emptyMessage="No Item found." globalFilter={this.state.lot_no} onSelectionChange={this.clickItemTable} showSelectionElement={()=>true}>
                                <Column style={{ width: '70px' }} field="lot_no" header="Lot_no"></Column>
                                <Column style={{ width: '120px' }} field="item_no" header="Item Code"></Column>
                                <Column style={{ width: '180px' }} field="name" header="Name"></Column>
                                <Column style={{ width: '120px' }} field="quan" header="Qty/Pcs"></Column>
                                <Column style={{ width: '100px' }} field="hsn_code" header="HSN"></Column>
                                <Column style={{ width: '200px' }} field="price_type" header="Price Type"></Column>
                            </DataTable>
                            {/* </ScrollBox> */}
                        </div>
                    </div>
                    <div className="p-grid">
                        <div className="p-col-10"></div>
                        <div className="p-col-2">
                            <Button onClick={this.openModelSuggestion} style={{margin:'5px',marginLeft:'-5px', width: '95% !important'}} className="inputData buttonSecondary" variant="contained">
                                <div className="buttonText"> <i className="pi pi-times-circle"></i> <span className="buttonTextFirstLetter">C</span>lose</div>
                            </Button>
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={this.state.customerModexBox} modal={false} style={{ width: '80vw', height: 'auto',margin: '20px', backgroundColor: 'white', marginTop: '130px', bottom:0 }} onHide={this.openModelCustomer}
                    draggable={true} resizable={false} baseZIndex={1} position="left" >

                    <div style={{ height: '300px', border: '2px solid #b0a939', overflowX: 'scroll'}}>
                        <div style={{ width: 'auto', marginTop: '-5px' }}>
                            {/* <ScrollBox style={{height: '200px',width:'100%'}} axes="1500px"> */}
                            <DataTable state={{ overflowY: 'scroll' }} selectionMode="single" dataKey="cid" globalFilter={ this.state.mobile || this.state.customer_name || this.state.customer_id}
                                value={this.state.customer_data} emptyMessage="No Item found." onSelectionChange={this.clickCustomerTable}>
                                <Column style={{ width: '100px' }} field="cid" header="Customer ID" ></Column>
                                <Column style={{ width: '120px' }} field="cname" header="Customer Name"></Column>
                                <Column style={{ width: '200px' }} field="add1" header="Address"></Column>
                                <Column style={{ width: '100px' }} field="mobile" header="Mobile"></Column>
                                <Column style={{ width: '200px' }} field="email" header="Email"></Column>
                            </DataTable>
                            {/* </ScrollBox> */}
                        </div>
                    </div>
                    <div className="p-grid" style={{margin: '20px'}}>
                        <div className="p-col-10"></div>
                        <div className="p-col-2">
                            <Button onClick={this.openModelCustomer} className="inputData buttonSecondary" variant="contained">
                                <div className="buttonText"> <i className="pi pi-times-circle"></i> <span className="buttonTextFirstLetter">C</span>lose</div>
                            </Button>
                        </div>
                    </div>
                </Dialog>

                


                <Dialog visible={this.state.agentModexBox} modal={false} style={{ width: '80vw', height: 'auto', backgroundColor: 'white', marginTop: '130px',padding: '20px' }} onHide={this.openModelAgent}
                    draggable={true} resizable={false} baseZIndex={1} position="left" >

                    <div style={{ height: '300px', border: '2px solid #b0a939', overflowX: 'scroll' }}>
                        <div style={{ width: 'auto', marginTop: '-5px' }}>
                            {/* <ScrollBox style={{height: '200px',width:'100%'}} axes="1500px"> */}
                            <DataTable state={{ overflowY: 'scroll' }} selectionMode="single" dataKey="cid" globalFilter={this.state.reference}
                                value={this.state.agentList} emptyMessage="No Item found." onSelectionChange={this.clickAgentTable}>
                                <Column style={{ width: '100px' }} field="acode" header="Agent Code" ></Column>
                                <Column style={{ width: '120px' }} field="aname" header="Agent Name"></Column>
                                <Column style={{ width: '200px' }} field="add1" header="Address"></Column>
                                <Column style={{ width: '100px' }} field="mobile" header="Mobile"></Column>
                                <Column style={{ width: '200px' }} field="email" header="Email"></Column>
                            </DataTable>
                            {/* </ScrollBox> */}
                        </div>
                    </div>  
                    <br></br>
                    <div className="p-grid">
                        <div className="p-col-10"></div>
                        <div className="p-col-2">
                            <Button onClick={this.openModelAgent} className="inputData buttonSecondary" variant="contained">
                                <div className="buttonText"> <i className="pi pi-times-circle"></i> <span className="buttonTextFirstLetter">C</span>lose</div>
                            </Button>
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={this.state.retrivalModexBox} modal={false} style={{ width: '90vw', height: 'auto', backgroundColor: 'white', marginTop: '100px' }} onHide={this.openModelRetrival}
                    draggable={true} closable={false} resizable={false} baseZIndex={1} position="left" >

                    <div style={{ height: '400px', border: '2px solid #b0a939', overflowX: 'scroll', margin:'30px 10px 10px' }}>
                        <div style={{ width: 'auto', marginTop: '-5px' }}>
                            {/* <ScrollBox style={{height: '200px',width:'100%'}} axes="1500px"> */}
                            <DataTable state={{ overflowY: 'scroll' }} selectionMode="single" dataKey="cid" globalFilter={ this.state.mobile || this.state.customer_name || this.state.customer_id}
                                value={this.state.retrivalList} emptyMessage="No Item found." onSelectionChange={this.clickRetrivalTable}>
                                <Column style={{ width: '100px' }} field="billno" header="Bill Number" ></Column>
                                <Column style={{ width: '120px' }} field="sub_total" header="Bill Amount"></Column>
                                <Column style={{ width: '200px' }} field="quans" header="Total Items"></Column>
                                <Column style={{ width: '100px' }} field="cashier" header="Cashier"></Column>
                                <Column style={{ width: '200px' }} field="system_ip" header="System Ip"></Column>
                            </DataTable>
                            {/* </ScrollBox> */}
                        </div>
                    </div>
                    <div className="p-grid">
                        <div className="p-col-10"></div>
                        <div className="p-col-2">
                            <Button onClick={this.openModelRetrival}   className="inputData buttonSecondary" variant="contained">
                                <div className="buttonText"> <i className="pi pi-times-circle"></i> <span className="buttonTextFirstLetter">C</span>lose</div>
                            </Button>
                        </div>
                    </div>
                </Dialog>

                <Dialog header="View Bill" visible={this.state.viewModelBox} modal style={{ width: '30vw', height: 'auto', backgroundColor: 'white', padding:'20px'}} onHide={this.openModelView}
                    draggable={true} resizable={false} baseZIndex={1}>
                    <div className="p-field">
                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Bill Number</label>
                        <InputText id="username1" value={this.state.viewBill} name="viewBill" aria-describedby="username1-help" onChange={this.onChangeView} className="p-d-block InputPrimeBox" />
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <Link to="/sales-bill" className="Link">
                                <Button type="submit" onClick={this.openModelView} className="inputData buttonSecondary" variant="contained">
                                    <div className="buttonText"> <span className="buttonTextFirstLetter"> <i className="pi pi-times-circle"></i> C</span>lose</div>
                                </Button>
                            </Link>
                        </div>
                        <div className="col-1"></div>
                        <div className="col-6">
                            {/* <Link to="/sales-bill" className="Link"> */}
                            <Button type="submit" className="inputData buttonSecondary" variant="contained" onClick={this.getViewBill}>
                                <div className="buttonText"> <span className="buttonTextFirstLetter"> <i className="pi pi-eye"></i> V</span>iew</div>
                            </Button>
                            {/* </Link> */}
                        </div>
                    </div>
                </Dialog>

                <Dialog header="View Bill" visible={this.state.draftModelBox} modal style={{ width: '30vw', height: 'auto', backgroundColor: 'white', padding:'20px'}} onHide={this.openModelDraft}
                    draggable={true} resizable={false} baseZIndex={1}>
                    <div className="p-field">
                        <h3>Draft</h3>
                        <label htmlFor="username1" className="p-d-block"  style={lebelStyle,{fontWeight:'400'}}>Do you want to Draft this record?</label>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <Link to="/sales-bill" className="Link">
                                <Button type="submit" onClick={this.openModelDraft} className="inputData buttonSecondary" variant="contained">
                                    <div className="buttonText"> <span className="buttonTextFirstLetter"> <i className="pi pi-times-circle"></i> C</span>lose</div>
                                </Button>
                            </Link>
                        </div>
                        <div className="col-1"></div>
                        <div className="col-6">
                            {/* <Link to="/sales-bill" className="Link"> */}
                            <Button type="submit" className="inputData buttonPrimary" variant="contained" onClick={this.draftForm}>
                                <div className="buttonText"> <span className="buttonTextFirstLetter"> <i className="pi pi-eye"></i> D</span>raft</div>
                            </Button>
                            {/* </Link> */}
                        </div>
                    </div>
                </Dialog>
                </form>
            </div>
        )
    }
}