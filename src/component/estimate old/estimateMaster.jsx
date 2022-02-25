import React, { Component,useEffect } from 'react'
import '../../assets/css/style.css';
import { Button } from '@material-ui/core';
import { Link } from "react-router-dom";
import Select from 'react-select'

//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import { ToastContainer, toast } from 'react-toastify';
import { Toast } from 'primereact/toast';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import Ip from 'ip'
import moment from "moment";
import PrintIcon from '@material-ui/icons/Print';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

//prime
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { autoComplete } from 'primereact/autocomplete';
import 'primeflex/primeflex.css';

//service
import SalesService from '../../service/sales/salesService'
import CustomerService from '../../service/customer/customerService'

//json
import { apiUrl } from '../../config/inint';
import { CompareArrowsOutlined, FilterTiltShiftSharp } from '@material-ui/icons';

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

            viewBill : '',

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
            newbillno:0,
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

            selecteddPay: null,

            modelBox: false,
            tenderModelBox: false,
            printModelBox: false,
            suggestionModexBox: false,
            customerModexBox: false,
            viewModelBox : false,

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

            //redirected bill
            billRedirect :  props.location.state?props.location.state['page']:'',
            billViewRedirect : props.location.state?props.location.state['billno']:'',
        }

        this.getLastStock()
        this.getStock()
        this.getCustomer()

        this.accept = this.accept.bind(this);
        this.reject = this.reject.bind(this);

        this.onChange = this.onChange.bind(this)
        this.onChangeView = this.onChangeView.bind(this)
        this.onChangeLotNumber = this.onChangeLotNumber.bind(this)
        this.onChangeTender = this.onChangeTender.bind(this)
        this.onCustomerUser = this.onCustomerUser.bind(this)
        this.handleEnter = this.handleEnter.bind(this)
        this.handleCustomerEnter = this.handleCustomerEnter.bind(this)
        this.handleselectedPAY = this.handleselectedPAY.bind(this)
        this.openModel = this.openModel.bind(this)
        this.openModelTender = this.openModelTender.bind(this)
        this.openModelPrint = this.openModelPrint.bind(this)
        this.openModelSuggestion = this.openModelSuggestion.bind(this)
        this.openModelCustomer = this.openModelCustomer.bind(this)
        this.openModelView = this.openModelView.bind(this)
        // this.searchCountry = this.searchCountry.bind(this)
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this)
        this.trashSelectedItem = this.trashSelectedItem.bind(this)

        this.clickCustomerTable = this.clickCustomerTable.bind(this)
        this.clickItemTable     = this.clickItemTable.bind(this)

        this.getViewBill        = this.getViewBill.bind(this)

        this.removeItem         = this.removeItem.bind(this)
        this.draftForm          = this.draftForm.bind(this)
        this.loadForm           = this.loadForm.bind(this)
        this.submitStock        = this.submitStock.bind(this)
        this.submitOldIem       = this.submitOldIem.bind(this)

        
    }

    componentDidMount() {

        // alert(this.state.billRedirect)
        // alert(this.state.billViewRedirect)
        if(this.state.billRedirect == 'redirect')
        {
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
    }

    onChangeView(e){
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
                    stack: data.item_name,
                    name: data.item_name,
                    item_code: data.item_no,
                    rate: data.price,
                    weight: 0,
                    net_weight: data.net_weight,
                    westage: data.wastage,
                    making_charges: data.making_charge,
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
            this.setState({
                stack: 0,
                name: '',
                item_code: 0,
                rate: 0,
                weight: 0,
                net_weight: 0,
                westage: 0,
                making_charges: 0,
                qty: 1,
                qty_total: 0,
                price_type: 0,
                hsn_code: 0,
                price: 0
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
                    customer_id     : data.cid,
                    mobile          : data.mobile,
                    customer_name   : data.cname,
                    address         : data.add1
                })

            }

        }

        console.log(count)
        if (count == 0) {
            this.setState({
                customer_id     : null,
                mobile          : null,
                customer_name   : null,
                address         : null
            })
        }
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onChangeTender(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    openModel(e) {
        this.setState({
            modelBox: !this.state.modelBox
        })
    }

    openModelSuggestion(e) {
        this.setState({
            suggestionModexBox: !this.state.suggestionModexBox
        })
    }

    openModelCustomer(e) {
        this.setState({
            customerModexBox: !this.state.customerModexBox
        })
    }

    openModelView(e) {
        this.setState({
            viewModelBox: !this.state.viewModelBox
        })

    }

    openModelTender(e) {
        this.setState({
            tenderModelBox: !this.state.tenderModelBox
        })
    }


    openModelPrint(e) {
        this.setState({
            printModelBox: !this.state.printModelBox
        })
    }


    handleEnter = (event) => {
        console.log(event.keyCode)
        if (event.keyCode === 13) {
            const form = event.target.form;
            const index = Array.prototype.indexOf.call(form, event.target);
            console.log(index)
            // if((index == 0) && (this.state.stack))
            // {
            //     form.elements[3].focus();
            //     event.preventDefault();
            // } else 
            if (index < 5) {
                form.elements[index + 1].focus();
                event.preventDefault();
            } else {
                form.elements[0].focus();
                event.preventDefault();
                this.submitStock(event)
            }
        }
        if (event.keyCode === 40) {
            this.setState({
                suggestionModexBox: true
            })
        }
    }

    handleCustomerEnter = (event) => {
        console.log(event.keyCode)
        if (event.keyCode === 13) {
            const form = event.target.form;
            const index = Array.prototype.indexOf.call(form, event.target);
            console.log(index)
            if (index < 5) {
                form.elements[index + 1].focus();
                event.preventDefault();
            } else {
                form.elements[0].focus();
                event.preventDefault();
                this.submitStock(event)
            }
        }
        if (event.keyCode === 40) {
            this.setState({
                customerModexBox: true
            })
        }
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
                this.submitStock(event)
            }
        }
    }

    accept() {
        this.toast.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    }

    reject() {
        this.toast.show({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
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
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
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
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    };

    submitStock(e) {
        e.preventDefault()
        if (this.state.qty <= this.state.qty_total) {
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
                    price_type
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
                    total: amount_data ? (parseFloat(amount_data) + parseFloat(making_charges)) : amount_data,
                    qty: qty ? qty : 0,
                    hsn_code: hsn_code ? hsn_code : 0,
                    price_type: price_type ? price_type : '',
                }

                console.log(data)

                this.state.selectedItem.push(data)
                this.setState({
                    selectedItem: this.state.selectedItem,
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
                alert("Please select Lot Number or Item")
            }
        } else {
            alert("Stock in hand " + this.state.qty_total)
        }
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
                amountOld
            } = this.state

            let data = {
                nameOld: nameOld ? nameOld : 0,
                type: type ? type.name : '',
                purity: purity ? purity.name : '',
                qtyOld: qtyOld ? qtyOld : 0,
                weightOld: weightOld ? weightOld : 0,
                rateOld: rateOld ? rateOld : 0,
                amountOld: amountOld ? amountOld : 0,
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

        if (this.state.selectedItem.length > 0) {
            salesService.saveSales(data).then((response) => {
                if (response['data']['status'] === 1) {
                    toast.success(response['data']['message']);
                    NotificationManager.success('Success message', response['data']['message']);
                    this.clearForm();
                    this.setState({
                        success: true,
                        printModelBox: true,
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
        } else {
            alert("Please Select Item")
        }
    }

    getViewBill = () =>{
        
        const {
            viewBill
        } = this.state

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            viewBill : viewBill 
        }

        salesService.getViewBill(data).then((response) => {
            if (response['data']['status'] === 1) {
                toast.success(response['data']['message']);
                
                response['data']['data']['selectedItem'].map( data =>{
                    data['weight']          = (parseFloat(data['weight'])).toFixed(3)
                    data['net_weight']      = (parseFloat(data['net_weight'])).toFixed(2)
                    data['making_charges']  = (parseFloat(data['making_charges'])).toFixed(2)
                    data['total']           = (parseFloat(data['total'])).toFixed(2)
                    data['rate']            = (parseFloat(data['rate'])).toFixed(2)
                    data['amount']          = (parseFloat(data['amount'])).toFixed(2)
                    data['price']           = (parseFloat(data['price'])).toFixed(2)
                })

                this.setState({
                    billno: viewBill,
                    selectedItem:   response['data']['data']['selectedItem'],
                    customer_id:    response['data']['data'][0]['cid'],
                    mobile:         response['data']['data'][0]['mobile'],
                    customer_name:  response['data']['data'][0]['cname'],
                })

                // this.clearForm();
                this.openModelView();
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

        confirmDialog({
            message: 'Do you want to Draft this record?',
            header: 'Confirmation',
            icon: 'pi pi-info-circle',
            accept: () => {
                localStorage.setItem("draft", JSON.stringify(data))
                this.toast.show({ severity: 'success', summary: 'Confirmed', detail: 'Draft Saved Successfully', life: 3000 });
                this.clearForm();
            },
            reject: this.reject
        });


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
    }

    itemTemplate = (item) => {
        return (
            <div>
                <div style={{ width: '100%' }} onClick={(e) => this.handleselectedItem(e, item)}>{item.item_name}</div>
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
                westage: newValue.wastage,
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
                weightOld: 0,
                qtyOld: newValue.value.quan,
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
        console.log(newValue)
        if (newValue) {
            this.setState({
                selecteddPay: newValue
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
                billno : this.state.newbillno,
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

                selectedOldItem: [],
                nameOld: '',
                qtyOld: '',
                weightOld: '',
                rateOld: '',
                amountOld: '',
                qtyOldTotal: 0,
                weightOldTotal: 0,
                amountOldTotal: 0,

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
    }

    removeItem = (rowData) =>{
        let data = []
        for(let item of this.state.selectedItem)
        {
            if(rowData.item_code != item.item_code)
            {
                data.push(item)
            }
        }
        this.setState({
            selectedItem : data
        })
        this.toast.show({ severity: 'info', summary: 'Confirmed', detail: 'Removed from Selected Item', life: 3000 });
    }

    trashSelectedItem(rowData){
        return(
            <React.Fragment>
                <Button  onClick={() => this.removeItem(rowData)} >
                    <i className="pi pi-trash"></i>
                </Button>
            </React.Fragment>
        );
    }

    clickCustomerTable = (event) =>{
        console.log(event)
        this.setState({
            customerModexBox    : false,
            customer_id         : event.value.cid,
            mobile              : event.value.mobile,
            customer_name       : event.value.cname,
            address             : event.value.add1
        })
    }

    clickItemTable = (event) =>{
        console.log(event)
        this.setState({
            suggestionModexBox    : false,
            lot_no                  : event.value.lot_no,
            stack                   : event.value.item_name,
            name                    : event.value.item_name,
            item_code               : event.value.item_no,
            rate                    : event.value.price,
            weight                  : 0,
            net_weight              : event.value.net_weight,
            westage                 : event.value.wastage,
            making_charges          : event.value.making_charge,
            qty                     : 1,
            qty_total               : event.value.quan,
            price_type              : event.value.price_type,
            hsn_code                : event.value.hsn_code,
            price                   : event.value.price
        })
    }

    render() {

       


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

        this.state.selectedItem.map((data) => {
            totalStocks++
            totalQty = totalQty + parseFloat(data.qty)
            totalWeight = totalWeight + parseFloat(data.weight)
            totalRate = totalRate + parseFloat(data.total)
        })

        const gross = parseFloat(this.state.weight);
        const wastage = parseFloat(this.state.westage);
        const waste = (gross * wastage) / 100;
        this.state.net_weight = gross + waste



        this.state.totalQty = totalQty
        this.state.totalGrossWeight = totalWeight
        this.state.totalRate = totalRate
        this.state.totalItems = totalStocks
        this.state.afterDes = totalRate - (totalRate / 10)

        var qtyOldTotal = 0;
        var weightOldTotal = 0;
        var amountOldTotal = 0;

        this.state.selectedOldItem.map((data) => {
            qtyOldTotal = qtyOldTotal + parseFloat(data.qtyOld)
            weightOldTotal = weightOldTotal + parseFloat(data.weightOld)
            amountOldTotal = amountOldTotal + parseFloat(data.amountOld)
        })

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
            data['weight']          = (parseFloat(data['weight'])).toFixed(3)
            data['net_weight']      = (parseFloat(data['net_weight'])).toFixed(2)
            data['making_charges']  = (parseFloat(data['making_charges'])).toFixed(2)
            data['total']           = (parseFloat(data['total'])).toFixed(2)
            data['rate']            = (parseFloat(data['rate'])).toFixed(2)
            data['amount']          = (parseFloat(data['amount'])).toFixed(2)
            data['price']           = (parseFloat(data['price'])).toFixed(2)
            // lot_number++
            item_number++
            count++
        })

        const lebelStyle = { fontSize: '12px', color: 'black' };

        this.state.tender_total = parseFloat(this.state.tender_cash) + parseFloat(this.state.tender_card) + parseFloat(this.state.tender_other)

        // alert(date)
        return (
            <div className="body">
                <ToastContainer />
                <Toast ref={(el) => this.toast = el} />
                <NotificationContainer />
                <Menu loggedIn={this.state.loggedIn} />

                <div className="continerPonitBox" style={{ padding: '0px' }}>
                    <div style={{ display: 'flex' }}>
                        <div style={{ width: '76%', borderRight: '1px solid silver', padding: '0px 20px', overflow: 'hidden' }}>
                            <form onSubmit={this.submitStock} autoComplete="off">
                                <br></br>
                                <div className="p-grid" style={{ backgroundColor: "#2488E6", color: 'white', textShadow: '0px 0px 5px black', padding: '10px 20px 10px', marginTop: '-20px', marginLeft: '-20px', width: '105%', border: '1px solid silver' }}>
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
                                <div className="p-grid" style={{ margin: '10px 0px 0px' }}>
                                    <div className="p-col-3 column-input">
                                        <div className="p-field">
                                            <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Lot No</label>
                                            {/* <autoComplete value={this.state.stack} suggestions={this.state.flterData} completeMethod={this.searchCountry} dropdown forceSelection
                                         field="item_name" name="stack" onKeyUp={this.handleEnter} itemTemplate={this.itemTemplate}
                                         className="p-d-block InputPrimeBox"/> */}
                                            <InputText id="username1" value={this.state.lot_no} name="lot_no" aria-describedby="username1-help" onChange={this.onChangeLotNumber} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                        </div>
                                    </div>
                                    <div className="p-col-9">
                                        <div className="p-grid">
                                            <div className="p-col-2 column-input">
                                                <div className="p-field">
                                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Rate</label>
                                                    <InputText id="username1" value={this.state.rate} name="rate" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                                </div>
                                            </div>
                                            <div className="p-col-2 column-input">
                                                <div className="p-field">
                                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Weight</label>
                                                    <InputText id="username1" value={this.state.weight} name="weight" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                                </div>
                                            </div>
                                            <div className="p-col-2 column-input">
                                                <div className="p-field">
                                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Wastage %</label>
                                                    <InputText id="username1" value={this.state.westage} name="westage" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                                </div>
                                            </div>
                                            <div className="p-col-2 column-input">
                                                <div className="p-field">
                                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Net Weight</label>
                                                    <InputText id="username1" value={this.state.net_weight} name="net_weight" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                                </div>
                                            </div>
                                            <div className="p-col-2 column-input">
                                                <div className="p-field">
                                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Making Charges</label>
                                                    <InputText id="username1" value={this.state.making_charges} name="making_charges" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                                </div>
                                            </div>
                                            <div className="p-col-2 column-input">
                                                <div className="p-field">
                                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Qty</label>
                                                    <InputText id="username1" value={this.state.qty} name="qty" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                </div>
                                <div style={{ height: '180px', border: '2px solid #227bce', overflowX: 'scroll' }}>
                                    <div style={{ width: '2000px', marginTop: '-5px' }}>
                                        {/* <ScrollBox style={{height: '200px',width:'100%'}} axes="1500px"> */}
                                        <DataTable state={{ overflowY: 'scroll' }}
                                            value={this.state.selectedItem} rows={3} first={this.state.first} onPage={(e) => this.setState({ first: e.first })}
                                            emptyMessage="No Item found.">
                                            <Column style={{ width: '70px' }} field="sr_no" header="Sr_no"></Column>
                                            <Column style={{ width: '70px' }} field="lot_no" header="Lot_no"></Column>
                                            <Column style={{ width: '180px' }} field="name" header="Name"></Column>
                                            <Column style={{ width: '120px' }} field="qty" header="Qty/Pcs"></Column>
                                            <Column style={{ width: '100px' }} field="weight" header="Weight"></Column>
                                            <Column style={{ width: '120px' }} field="westage" header="Westage %"></Column>
                                            <Column style={{ width: '120px' }} field="net_weight" header="Net Weight"></Column>
                                            <Column style={{ width: '120px' }} field="rate" header="Rate"></Column>
                                            <Column style={{ width: '120px' }} field="amount" header="Amount"></Column>
                                            <Column style={{ width: '150px' }} field="making_charges" header="Making Charges"></Column>
                                            <Column style={{ width: '120px' }} field="total" header="Total"></Column>
                                            <Column style={{ width: '100px' }} field="hsn_code" header="HSN"></Column>
                                            <Column style={{ width: '120px' }} field="item_code" header="Item Code"></Column>
                                            <Column style={{ width: '200px' }} field="price_type" header="Price Type"></Column>
                                            <Column body={this.trashSelectedItem} headerStyle={{ width: '8em', textAlign: 'center' }}  bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                                        </DataTable>
                                        {/* </ScrollBox> */}
                                    </div>
                                </div>

                                <div className="p-grid" style={{ marginTop: '10px' }}>
                                    <div className="p-col-3 column-input">
                                        <label htmlFor="username1" style={lebelStyle}>Customer ID</label>
                                        <span className="p-float-label" style={{ marginTop: '5px' }}>
                                            <InputText id="username1" value={this.state.customer_id} name="customer_id" aria-describedby="username1-help" onChange={this.onCustomerUser} onKeyDown={this.handleCustomerEnter} className="p-d-block InputPrimeBox" />
                                            {/* <Dropdown value={this.state.customer_id} options={this.state.customer_data} name="customer_id" onChange={this.handleselectedUser} style={{ width: '100%', padding: '0px', height: '35px' }} filter editable optionLabel="name" /> */}
                                        </span>
                                        {/* <div className="p-field">
                                <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Customer ID</label>
                                <InputText id="username1" aria-describedby="username1-help" value={this.state.customer_id} name="customer_id" onChange ={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox"/>
                            </div> */}
                                    </div>
                                    <div className="p-col-3 column-input">
                                        <div className="p-field">
                                            <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Customer Mobile</label>
                                            <InputText id="username1" aria-describedby="username1-help" value={this.state.mobile} name="mobile" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                        </div>
                                    </div>
                                    <div className="p-col-3 column-input">
                                        <div className="p-field">
                                            <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Customer Name</label>
                                            <InputText id="username1" aria-describedby="username1-help" value={this.state.customer_name} name="customer_name" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                        </div>
                                    </div>
                                    <div className="p-col-3 column-input">
                                        <div className="p-field">
                                            <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Card Number</label>
                                            <InputText id="username1" aria-describedby="username1-help" value={this.state.customer_card} name="customer_card" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <form autoComplete="off">
                                <div className="p-grid">
                                    <div className="p-col-2 submitFormButton">
                                        <Button onClick={this.submitStackForm} className="inputData buttonSecondary" variant="contained">
                                            <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">S</span>ave</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.openModelTender}>
                                            <div className="buttonText"> <i className="pi pi-book"></i> <span className="buttonTextFirstLetter">T</span>ender</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.draftForm} >
                                            <div className="buttonText"> <i className="pi pi-calendar-plus"></i> <span className="buttonTextFirstLetter">D</span>raft</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.loadForm}>
                                            <div className="buttonText"> <i className="pi pi-external-link"></i> <span className="buttonTextFirstLetter">L</span>oad</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained" >
                                            <div className="buttonText"> <i className="pi pi-plus-circle"></i> <span className="buttonTextFirstLetter">A</span>pply</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained" >
                                            <div className="buttonText"> <i className="pi pi-microsoft"></i> <span className="buttonTextFirstLetter">H</span>old</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.openModel}>
                                            <div className="buttonText"> <i className="pi pi-shopping-cart"></i> <span className="buttonTextFirstLetter">O</span>ld Item</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained">
                                            <div className="buttonText"> <i className="pi pi-angle-double-left"></i> <span className="buttonTextFirstLetter">L</span>ast Bil</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained">
                                            <div className="buttonText"><span className="buttonTextFirstLetter">N</span>ext Bill  <i className="pi pi-angle-double-right"></i> </div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained"  onClick={this.openModelView}>
                                            <div className="buttonText"> <i className="pi pi-eye"></i> <span className="buttonTextFirstLetter">V</span>iew</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.clearForm}>
                                            <div className="buttonText"> <i className="pi pi-trash"></i> <span className="buttonTextFirstLetter">C</span>lear</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <Link to="/home" className="Link">
                                            <Button className="inputData buttonSecondary" variant="contained">
                                                <div className="buttonText"> <i className="pi pi-times-circle"></i> <span className="buttonTextFirstLetter">C</span>lose</div>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </form>
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
                                <div className="p-col-12 right_total_box">
                                    <div className="p-grid">
                                        <div className="p-col-4 right_total_box_title">
                                            Date
                                    </div>
                                        <div className="p-col-8 right_total_box_amount">
                                            {this.state.todaydate} <span style={{ borderLeft: '2px solid white' }}> &nbsp; {this.state.currentTime} </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-col-12 right_total_box">
                                    <div className="p-grid">
                                        <div className="p-col-4 right_total_box_title">
                                            Total Items
                                    </div>
                                        <div className="p-col-8 right_total_box_amount">
                                            {this.state.totalItems}  <span style={{ borderLeft: '2px solid white' }}> &nbsp; {this.state.totalQty} </span>
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
                                            Dis%
                                    </div>
                                        <div className="p-col-8 right_total_box_amount">
                                            0
                                    </div>
                                    </div>
                                </div>
                                <div className="p-col-12 right_total_box">
                                    <div className="p-grid">
                                        <div className="p-col-4 right_total_box_title">
                                            Dis Amt
                                    </div>
                                        <div className="p-col-8 right_total_box_amount">
                                            {this.state.afterDes}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-col-12 right_total_box">
                                    <div className="p-grid">
                                        <div className="p-col-4 right_total_box_title">
                                            Making
                                    </div>
                                        <div className="p-col-8 right_total_box_amount">
                                            0.00
                                    </div>
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
                                        <div className="p-col-8 right_total_box_amount">
                                            {this.state.totalRate}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-col-12 right_total_box">
                                    <div className="p-grid">
                                        <div className="p-col-4 right_total_box_title">
                                            Grand Total
                                    </div>
                                        <div className="p-col-8 right_total_box_amount">
                                            0.00
                                    </div>
                                    </div>
                                </div>
                                <div className="p-col-12 right_total_box">
                                    <div className="p-grid">
                                        <div className="p-col-4 right_total_box_title">
                                            Tax Amt
                                    </div>
                                        <div className="p-col-8 right_total_box_amount">
                                            0.00
                                    </div>
                                    </div>
                                </div>
                                <div className="p-col-12 right_total_box">
                                    <div className="p-grid">
                                        <div className="p-col-4" style={{ padding: '15px 10px' }}>
                                            Pay Mode
                                    </div>
                                        <div className="p-col-8" style={{ color: 'black', cursor: 'pointer' }}>
                                            <Select style={{ color: 'black', padding: '10px' }} placeholder={<div>Cash</div>} onChange={this.handleselectedPAY} value={this.state.selecteddPay} options={this.state.payMode} />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-col-12" style={{ padding: '0px' }}>
                                    <div className="p-grid right_final_total_box">
                                        <div className="p-col-7">
                                            <h3 style={{ padding: '0px', margin: '0px' }}>Net Total</h3>
                                        </div>
                                        <div className="p-col-5" style={{ padding: '5px 2px 0px', textAlign: 'right' }}>
                                            {this.state.afterDes - this.state.amountOldTotal}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-col-12" style={{ padding: '0px' }}>
                                    <div className="p-grid right_final_total_box">
                                        <div className="p-col-7">
                                            <h3 style={{ padding: '0px', margin: '0px' }}> Tender </h3>
                                        </div>
                                        <div className="p-col-5" style={{ padding: '5px 2px 0px', textAlign: 'right' }}>
                                            {this.state.tender_total ? (this.state.tender_total - this.state.afterDes - this.state.amountOldTotal) : this.state.tender_total}
                                            {/* : <InputText style={{width:'90%'}} name="cashReceived" value={this.state.cashReceived} onChange ={this.onChange} /> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-col-12" style={{ padding: '0px' }}>
                                    <div className="p-grid right_final_total_box">
                                        <div className="p-col-7">
                                            <h3 style={{ padding: '0px', margin: '0px' }}>Balance </h3>
                                        </div>
                                        <div className="p-col-5" style={{ padding: '5px 2px 0px', textAlign: 'right' }}>
                                            {this.state.cashReceived ? (this.state.cashReceived - this.state.afterDes - this.state.amountOldTotal) : (this.state.afterDes - this.state.amountOldTotal)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <Footer />

                {/* Dialog box */}
                <Dialog header="Old Items Entry" visible={this.state.modelBox} modal style={{ width: '80vw', height: '80vh', backgroundColor: 'white' }} onHide={this.openModel} footer={this.renderFooter('displayBasic')}
                    draggable={true} resizable={false} baseZIndex={1}>
                    <div>
                        <form onSubmit={this.submitOldIem} autoComplete="off">
                            <div className="p-grid" style={{ marginTop: '0px' }}>
                                <div className="p-col-2 column-input-2">
                                    <span className="p-float-label">
                                        <Dropdown value={this.state.stackOld} options={this.state.stock} name="customer_id" onChange={this.handleselectedItemOld} style={{ width: '100%', padding: '0px', height: '35px' }} filter editable optionLabel="name" />
                                        <label htmlFor="username1" style={lebelStyle}>Item Number</label>
                                    </span>
                                </div>
                                <div className="p-col-2 column-input-2">
                                    <span className="p-float-label">
                                        <Dropdown name="type" value={this.state.type} options={this.state.typeList} onChange={this.handleselectedType} style={{ width: '100%', padding: '0px', height: '35px' }} filter editable optionLabel="name" />
                                        <label htmlFor="username1" style={lebelStyle}>Type</label>
                                    </span>
                                </div>
                                <div className="p-col-2 column-input-2">
                                    <span className="p-float-label">
                                        <Dropdown name="purity" value={this.state.purity} options={this.state.purityList} onChange={this.handleselectedPurity} style={{ width: '100%', padding: '0px', height: '35px' }} filter editable optionLabel="name" />
                                        <label htmlFor="username1" style={lebelStyle}>Purity</label>
                                    </span>
                                </div>
                                <div className="p-col-1 column-input-2">
                                    <span className="p-float-label">
                                        <InputText id="billno" aria-describedby="username1-help" name="qtyOld" value={this.state.qtyOld} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                        <label htmlFor="username1" style={lebelStyle}>PCS( Qty )</label>
                                    </span>

                                </div>

                                <div className="p-col-1 column-input-2">
                                    <span className="p-float-label">
                                        <InputText id="billno" aria-describedby="username1-help" name="weightOld" value={this.state.weightOld} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                        <label htmlFor="username1" style={lebelStyle}>Weight</label>
                                    </span>
                                </div>
                                <div className="p-col-1 column-input-2">
                                    <span className="p-float-label">
                                        <InputText id="billno" aria-describedby="username1-help" name="rateOld" value={this.state.rateOld} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                        <label htmlFor="username1" style={lebelStyle}>Rate / grm</label>
                                    </span>
                                </div>
                                <div className="p-col-1 column-input-2">
                                    <span className="p-float-label">
                                        <InputText id="billno" aria-describedby="username1-help" name="amountOld" value={this.state.amountOld} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                        <label htmlFor="username1" style={lebelStyle}>Amount</label>
                                    </span>
                                </div>
                                <div className="p-col-2" style={{ padding: '15px 10px' }}>
                                    <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                        <div className="buttonText">
                                            <i className="pi pi-plus-circle"></i>  <span className="buttonTextFirstLetter" style={{ marginTop: '-5px' }}>A</span>dd
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </form>
                        <div style={{ height: '180px', border: '2px solid #227bce', overflowX: 'scroll' }}>
                            <div style={{ width: '1000px', marginTop: '-5px' }}>
                                <DataTable state={{ overflowY: 'scroll' }}
                                    value={this.state.selectedOldItem} rows={3} first={this.state.first} onPage={(e) => this.setState({ first: e.first })}
                                    emptyMessage="No Item found.">
                                    <Column style={{ width: '200px' }} field="nameOld" header="nameOld"></Column>
                                    <Column style={{ width: '120px' }} field="type" header="Type"></Column>
                                    <Column style={{ width: '200px' }} field="purity" header="Purity"></Column>
                                    <Column style={{ width: '120px' }} field="qtyOld" header="PCS Qty"></Column>
                                    <Column style={{ width: '120px' }} field="weightOld" header="Weight"></Column>
                                    <Column style={{ width: '150px' }} field="rateOld" header="Rate / grm"></Column>
                                    <Column style={{ width: '120px' }} field="amountOld" header="Amount"></Column>
                                    <Column body={this.actionBodyTemplate} headerStyle={{ width: '8em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                                </DataTable>
                            </div>
                        </div>
                        <div className="p-grid" style={{ marginTop: '0px' }}>
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
                    </div>
                </Dialog>

                <Dialog header="Tender" visible={this.state.tenderModelBox} modal style={{ width: '40vw', height: '60vh', backgroundColor: 'white' }} onHide={this.openModelTender}
                    draggable={true} resizable={false} baseZIndex={1}>
                    <form>
                        <div className="p-grid" style={{ marginTop: '10px' }}>
                            <div className="p-col-2 column-input">
                                <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Cash</label>
                            </div>
                            <div className="p-col-10 column-input">
                                <div className="p-field">
                                    <InputText id="username1" aria-describedby="username1-help" name="tender_cash" value={this.state.tender_cash} onChange={this.onChangeTender} onKeyDown={this.handleEnterTender} className="p-d-block InputPrimeBox" />
                                </div>
                            </div>
                            <div className="p-col-2 column-input">
                                <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Card</label>
                            </div>
                            <div className="p-col-10 column-input">
                                <div className="p-field">
                                    <InputText id="username1" aria-describedby="username1-help" name="tender_card" value={this.state.tender_card} onChange={this.onChangeTender} onKeyDown={this.handleEnterTender} className="p-d-block InputPrimeBox" />
                                </div>
                            </div>
                            <div className="p-col-2 column-input">
                                <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Other</label>
                            </div>
                            <div className="p-col-10 column-input">
                                <div className="p-field">
                                    <InputText id="username1" aria-describedby="username1-help" name="tender_other" value={this.state.tender_other} onChange={this.onChangeTender} onKeyDown={this.handleEnterTender} className="p-d-block InputPrimeBox" />
                                </div>
                            </div>
                            <div className="p-col-12"><hr></hr></div>
                            <div className="p-col-2 column-input">
                                <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Total</label>
                            </div>
                            <div className="p-col-10 column-input">
                                <div className="p-field">
                                    <InputText id="username1" aria-describedby="username1-help" name="tender_total" value={this.state.tender_total} onChange={this.onChangeTender} onKeyDown={this.handleEnterTender} className="p-d-block InputPrimeBox" />
                                </div>
                            </div>
                        </div>
                    </form>
                </Dialog>

                <Dialog header="Saved Successfully" visible={this.state.printModelBox} modal style={{ width: '30vw', height: 'auto', backgroundColor: 'white' }} onHide={this.openModelPrint}
                    draggable={true} resizable={false} baseZIndex={1}>
                    You want to print bill ?
                    <br></br><br></br><br></br>
                    <div className="row">
                        <div className="col-6">
                            <Link to="/sales-bill" className="Link">
                                <Button type="submit" className="inputData buttonSecondary" variant="contained">
                                    <div className="buttonText"> <span className="buttonTextFirstLetter"> <i className="pi pi-times-circle"></i> C</span>lose</div>
                                </Button>
                            </Link>
                        </div>
                        <div className="col-1"></div>
                        <div className="col-6">
                            <Link
                                to={{
                                    pathname: "/sales-view",
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
                <Dialog visible={this.state.suggestionModexBox} modal={false} style={{ width: '80vw', height: 'auto', backgroundColor: 'white', marginTop: '130px' }} onHide={this.openModelSuggestion}
                    draggable={true} resizable={false} baseZIndex={1} position="left">

                    <div style={{ height: '180px', border: '2px solid #227bce', overflowX: 'scroll' }}>
                        <div style={{ width: 'auto', marginTop: '-5px' }}>
                            {/* <ScrollBox style={{height: '200px',width:'100%'}} axes="1500px"> */}
                            <DataTable state={{ overflowY: 'scroll' }} selectionMode="single" dataKey="item_no"
                                value={this.state.stock} emptyMessage="No Item found." onSelectionChange={this.clickItemTable}                                >
                                <Column style={{ width: '70px' }} field="lot_no" header="Lot_no"></Column>
                                <Column style={{ width: '120px' }} field="item_no" header="Item Code"></Column>
                                <Column style={{ width: '180px' }} field="name" header="Name"></Column>
                                <Column style={{ width: '120px' }} field="quan" header="Qty/Pcs"></Column>
                                <Column style={{ width: '100px' }} field="hsn_code" header="HSN"></Column>
                                <Column style={{ width: '200px' }} field="price_type" header="Price Type"></Column>
                                <Column body={this.actionBodyTemplate} headerStyle={{ width: '8em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                            </DataTable>
                            {/* </ScrollBox> */}
                        </div>
                    </div>
                </Dialog>

                <Dialog visible={this.state.customerModexBox} modal={false} style={{ width: '80vw', height: 'auto', backgroundColor: 'white', marginTop: '130px' }} onHide={this.openModelCustomer}
                    draggable={true} resizable={false} baseZIndex={1} position="left" >

                    <div style={{ height: '180px', border: '2px solid #227bce', overflowX: 'scroll' }}>
                        <div style={{ width: 'auto', marginTop: '-5px' }}>
                            {/* <ScrollBox style={{height: '200px',width:'100%'}} axes="1500px"> */}
                            <DataTable state={{ overflowY: 'scroll' }}  selectionMode="single" dataKey="cid"
                                value={this.state.customer_data} emptyMessage="No Item found." onSelectionChange={this.clickCustomerTable}>
                                <Column style={{ width: '100px' }} field="cid" header="Customer ID" ></Column>
                                <Column style={{ width: '120px' }} field="cname" header="Customer Name"></Column>
                                <Column style={{ width: '200px' }} field="add1" header="Address"></Column>
                                <Column style={{ width: '100px' }} field="mobile" header="Mobile"></Column>
                                <Column style={{ width: '200px' }} field="email" header="Email"></Column>
                                <Column body={this.actionBodyTemplate} headerStyle={{ width: '8em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                            </DataTable>
                            {/* </ScrollBox> */}
                        </div>
                    </div>
                </Dialog>

                <Dialog  header="View Bill" visible={this.state.viewModelBox} modal style={{ width: '30vw', height: 'auto', backgroundColor: 'white' }} onHide={this.openModelView}
                    draggable={true} resizable={false} baseZIndex={1}>
                        <div className="p-field">
                            <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Bill Number</label>
                            <InputText id="username1" value={this.state.viewBill} name="viewBill" aria-describedby="username1-help" onChange={this.onChangeView} className="p-d-block InputPrimeBox" />
                        </div>
                    <div className="row">
                        <div className="col-6">
                            <Link to="/sales-bill" className="Link">
                                <Button type="submit" className="inputData buttonSecondary" variant="contained">
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
            </div>
        )
    }
}