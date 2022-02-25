import React, { Component, useEffect, useRef } from 'react'
import '../../assets/css/style.css';
import { Button, Input } from '@material-ui/core';
import { Link } from "react-router-dom";

//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
// import { ToastContainer, toast } from 'react-toastify';
import { Toast } from 'primereact/toast';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';

import { Dropdown } from 'primereact/dropdown';

import 'react-toastify/dist/ReactToastify.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import moment from "moment";
import $ from 'jquery';
//prime
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import 'primeflex/primeflex.css';

//service
import SalesService from '../../service/sales/salesService'
import StockService from '../../service/stock/stockService'
import ItemService from '../../service/item/itemService'
import PurchaseService from '../../service/purchase/purchaseService'
import SupplierService from '../../service/supplier/supplierService'
//json
import Init from '../../config/Inint.json'

//object of services
const salesService = new SalesService();
const itemService = new ItemService();
const stockService = new StockService();
const purchaseService = new PurchaseService();
const supplierService = new SupplierService();

export default class stockComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: localStorage.getItem('username'),
            userlevel: localStorage.getItem('userlevel'),
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

            viewBill: '',
            nextBill: '',

            stock: [],
            flterData: [],
            payModeList: Init.PaymentMod,
            payMod: "Credit",

            billno: 0,
            todaydate: moment().format("YYYY-MM-DD"),
            due_date: '',

            //item data
            selectedItem: [],
            item_code: '',
            rate: 0,
            weight: '',
            net_weight: '',
            net_amt: '',
            westage: '',
            making_charges: '',
            qty: 0,
            price: 0,
            stack: '',
            amount: 0,

            //bill details
            grn_number: '',
            grn_date: moment().format("DD-MM-YYYY"),
            billno: '',
            suppliername: '',
            tax_no: '0',
            dueDateSupplier: 0,

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


            modelBox: false,
            suggestionModexBox: false,
            viewModelBox: false,
            deleteModelBox: false,
            permissionModelBox: false,


            sub_total: 0,
            dis_per: 0,
            dis_amt: 0,
            gst_per: 0,
            gst_amt: 0,
            tcs_per: 0,
            tcs_amt: 0,
            grant_total: 0,
            add_amount: 0,
            round: 0,
            total_weight: 0,

            supplierList: []
        }

        this.getLastStock()
        this.getStock()
        this.getSupplier()
        this.getTax()


        this.onChange = this.onChange.bind(this)
        this.onChangeSupplier = this.onChangeSupplier.bind(this)
        this.openModel = this.openModel.bind(this)
        this.actionBodyTemplate = this.actionBodyTemplate.bind(this)
        this.submitStock = this.submitStock.bind(this)
        this.clickItemTable = this.clickItemTable.bind(this)
        this.handleEnter = this.handleEnter.bind(this)
        this.openModelDelete = this.openModelDelete.bind(this)
        this.openModelPermission = this.openModelPermission.bind(this)


        this.getTax = this.getTax.bind(this)

        this.openModelView = this.openModelView.bind(this)

        this.getViewBill = this.getViewBill.bind(this)
        this.getLastBill = this.getLastBill.bind(this)
        this.getNextBill = this.getNextBill.bind(this)

        this.trashSelectedItem = this.trashSelectedItem.bind(this)
        this.removeItem = this.removeItem.bind(this)
        this.openModelSuggestion = this.openModelSuggestion.bind(this)
    }

    componentDidMount() {
        $('#item_code').focus();
    }


    onChange(e) {
        console.log(e.target.value)
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onChangeSupplier(e) {

        let count = 0;
        for (let data of this.state.supplierList) {
            console.log(count)
            if (data.cname === e.target.value) {
                count++
                this.setState({
                    suppliername: data.cname,
                    tax_no: data.tax_no,
                    dueDateSupplier: data.duedays
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
                item_code: '',
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

    openModel(e) {
        this.setState({
            modelBox: !this.state.modelBox
        })
    }

    openModelSuggestion(e) {
        this.setState({
            suggestionModexBox: !this.state.suggestionModexBox
        })
        $('#item_code').focus();
    }

    openModelDelete(e) {
        this.setState({
            deleteModelBox: !this.state.deleteModelBox
        })
    }
    openModelPermission(e) {
        this.setState({
            permissionModelBox: !this.state.permissionModelBox
        })
    }

    handleEnter = (event) => {
        // console.log(event.keyCode)
        const form = event.target.form;
        const index = Array.prototype.indexOf ? Array.prototype.indexOf.call(form, event.target) : 0;

        if (event.keyCode === 16) {
            form.elements[index - 1].focus();
            event.preventDefault();
        }
        if (event.keyCode === 9) {
            // const form = event.target.form;
            // const index = Array.prototype.indexOf.call(form, event.target);
            // console.log(index)
            // form.elements[index].focus();
            // event.preventDefault();
            // if((index == 8) && (this.state.stack))
            // {
            //     form.elements[10].focus();
            //     event.preventDefault();
            // } else 
            // alert(index)
            // const form = event.target.form;
            // const index = Array.prototype.indexOf.call(form, event.target);

            if (this.state.selectedItem.length > 0) {
                if (this.state.item_code) {
                    if (index <= 3) {
                        form.elements[index].focus();
                        event.preventDefault();
                    } else {
                        form.elements[0].focus();
                        event.preventDefault();
                        this.submitStock(event)
                    }
                } else {
                    // alert(index)
                    if (index == 1) {
                        $('#dis_per').focus();
                    } else {
                        form.elements[index].focus();
                        event.preventDefault();
                    }
                    // if(index > (3 + this.state.selectedItem.length))
                    // {
                    //     form.elements[index].focus();
                    //     event.preventDefault();
                    // }
                }

            } else {
                if (index <= 3) {
                    form.elements[index].focus();
                    event.preventDefault();
                } else {
                    form.elements[0].focus();
                    event.preventDefault();
                    this.submitStock(event)
                }
            }
        }
        if (event.keyCode === 40) {
            if (index < 3) {
                this.setState({
                    suggestionModexBox: true
                })
            }
        }
    }



    getLastStock() {

        let data = { login_user: localStorage.getItem("username"), branch: localStorage.getItem("Branch") }

        purchaseService.getLastPurchase(data).then((response) => {
            if (response['data']['status'] === 1) {
                this.setState({
                    ipAddress: response['data']['data']['ip'],
                    billno: response['data']['data']['grn'],
                    nextBill: response['data']['data']['grn'],
                    grn_number: response['data']['data']['grn'],
                    item_no: response['data']['data']['purchase_no']
                })
            }
        }).catch((error) => {
            console.log(error)
            this.toast.show({ severity: 'error', summary: 'Oops', detail: 'Check Connection', life: 3000 });
            // toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }

    getStock = () => {

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            checkBox: true,
            type: 'item-report'
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
            this.toast.show({ severity: 'error', summary: 'Oops', detail: 'Check Connection', life: 3000 });
            // toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    };


    getSupplier = () => {

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            type: 'supplier-list-report'
        }

        supplierService.getSupplier(data).then((response) => {
            console.log(response)
            if (response['data']['status'] === 1) {
                response['data']['data'].map((data) => {
                    return (
                        data['code'] = data.entry_no,
                        data['name'] = data.lot_no + " " + data.item_name
                    )
                })
                this.setState({
                    supplierList: response['data']['data']
                })
            } else {

            }
        }).catch((error) => {
            console.log(error)
            this.toast.show({ severity: 'error', summary: 'Oops', detail: 'Check Connection', life: 3000 });
            // toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    };


    submitStock(e) {
        e.preventDefault()

        if ((this.state.qty != 0) && (this.state.item_no != 0)) {

            var status = true;

            const {
                lot_no,
                name,
                item_no,
                item_code,
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
                item_code: item_code,
                rate: rate ? parseFloat(rate) : 0,
                amount: (parseFloat(rate) * parseFloat(weight)).toFixed(2),
                weight: weight ? weight : 0,
                net_weight: net_weight ? net_weight : 0,
                westage: westage ? westage : 0,
                making_charges: making_charges ? parseFloat(making_charges) : 0,
                qty: qty ? qty : 0,
                hsn_code: hsn_code ? hsn_code : 0
            }
            console.log(data)

            this.state.selectedItem.push(data)
            this.setState({
                selectedItem: this.state.selectedItem,
                isClearable: true,
                item_code: '',
                name: '',
                rate: '',
                weight: '',
                net_weight: 0,
                westage: 0,
                making_charges: 0,
                qty: 1,
            })
            console.log(this.state.selectedItem)
            $('#item_code').focus();
        } else {
            alert("Please select items")
        }
    }

    openModelView(e) {
        this.setState({
            viewModelBox: !this.state.viewModelBox
        })
    }

    deleteStackForm = (e) => {
        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            billno: this.state.billno
        }

        if (this.state.userlevel == "Administrator") {
            purchaseService.deletePurchase(data).then((response) => {
                if (response['data']['status'] === 1) {
                    this.toast.show({ severity: 'success', summary: 'Success', detail: response['data']['message'], life: 3000 });
                    this.clearForm();
                } else {
                    this.toast.show({ severity: 'error', summary: 'Error', detail: response['data']['message'], life: 3000 });
                    this.setState({
                        loggedIn: false,
                    });
                    this.clearForm()
                }
            }).catch((error) => {
                //   console.log(error)
                this.toast.show({ severity: 'error', summary: 'Error', detail: 'Check Connection', life: 3000 });
            })

        } else {
            this.setState({
                permissionModelBox: true
            });
        }
    }

    getTax() {
        let data = { login_user: localStorage.getItem("username"), branch: localStorage.getItem("Branch") }

        salesService.getTax(data).then((response) => {
            if (response['data']['status'] === 1) {
                this.setState({
                    gst_per: response['data']['data'][0]['taxp'],
                })
            }
        }).catch((error) => {
            //   console.log(error)
            this.toast.show({ severity: 'error', summary: 'Error', detail: 'Check Connection', life: 3000 });
        })
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
            tcs_per,
            tcs_amt,
            grant_total,
            add_amount,
            round,
            total_weight,
            grn_number,
            grn_date,
            suppliername,
            due_date,
            dueDateSupplier,
            todaydate,
            payMod,
            net_amt,
            tax_no
        } = this.state

        var items = 0
        var quan = 0
        var tweight = 0

        this.state.selectedItem.map(data => {
            items++
            quan = quan + parseFloat(data['qty'])
            tweight = tweight + parseFloat(data['weight'])
        })


        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),

            type: (this.state.billno === this.state.nextBill) ? 'new' : 'alter',

            grn_number: grn_number,
            suppliername: suppliername,
            billno: billno,
            due_date: moment(todaydate).add(dueDateSupplier, 'days').format("YYYY-MM-DD"),
            todaydate: todaydate,
            lot_no: lot_no,
            item_no: item_no,
            ipAddress: ipAddress,
            totalGrossWeight: totalGrossWeight,
            totalRate: totalRate,
            descount: '10%',
            afterDes: afterDes ? afterDes : '.',
            selectedItem: selectedItem ? JSON.stringify(selectedItem) : '.',
            totalItems: totalItems ? totalItems : '.',
            making_charges: making_charges ? making_charges : '.',
            customer_id: customer_id ? customer_id : '.',
            mobile: mobile ? mobile : '.',
            customer_name: customer_name ? customer_name : '.',
            address: address ? address : '.',
            remark: remark ? remark : '.',
            reference: reference ? reference : '.',
            sub_total: sub_total ? sub_total : '.',
            dis_per: dis_per ? dis_per : '.',
            dis_amt: dis_amt ? dis_amt : '.',
            gst_per: gst_per ? gst_per : '.',
            gst_amt: gst_amt ? gst_amt : '.',
            tcs_per: tcs_per ? tcs_per : '.',
            tcs_amt: tcs_amt ? tcs_amt : '.',
            net_amt: net_amt ? net_amt : '.',
            grant_total: grant_total ? grant_total : '.',
            add_amount: add_amount ? add_amount : '.',
            round: round ? round : '.',
            total_weight: total_weight ? total_weight : '.',
            items: items ? items : '.',
            quan: quan ? quan : '.',
            tweight: tweight ? tweight : '.',
            tax_no: tax_no ? tax_no : '.',
            payMod: payMod ? payMod : '.'
        }

        if (this.state.selectedItem.length > 0) {

            if ((this.state.userlevel == "Administrator") || (data.type == 'new')) {

                purchaseService.savePurchase(data).then((response) => {
                    if (response['data']['status'] === 1) {
                        this.toast.show({ severity: 'success', summary: 'Success Message', detail: response['data']['message'], life: 3000 });

                        this.clearForm();
                    } else {
                        this.toast.show({ severity: 'error', summary: 'Oops', detail: response['data']['message'], life: 3000 });

                        this.setState({
                            loggedIn: false,
                        });
                    }
                }).catch((error) => {
                    console.log(error)
                    this.toast.show({ severity: 'error', summary: 'Oops', detail: 'Check Connection', life: 3000 });
                })

            } else {
                this.setState({
                    permissionModelBox: true
                });
            }
        } else {
            this.toast.show({ severity: 'error', summary: 'Oops', detail: 'Sorry, Select Item Before Save', life: 3000 });
        }
    }

    getLastBill = () => {

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            viewBill: this.state.billno - 1,
        }

        purchaseService.getViewBill(data).then((response) => {
            if (response['data']['status'] === 1) {

                this.toast.show({ severity: 'success', summary: 'Success', detail: response['data']['message'], life: 3000 });

                let data = response['data']['data']['purchase'];
                let items = response['data']['data']['items'];

                items.map(data => {
                    data['name'] = data['iname']
                    data['item_code'] = data['ino']
                    data['rate'] = data['price']
                    data['qty'] = data['quan']
                    data['hsn_code'] = data['hsn']
                })


                this.setState({
                    viewModelBox: false,
                    grn_number: data['grn'],
                    suppliername: data['cname'],
                    billno: data['billno'],
                    due_date: data['ddate'],
                    todaydate: data['dat'],
                    selectedItem: data['grn'],
                    selectedItem: items,
                    // totalItems: items,
                    sub_total: (parseFloat(data['sub'])).toFixed(2),
                    dis_per: data['disp'],
                    dis_amt: (parseFloat(data['disamt'])).toFixed(2),
                    gst_per: data['taxp'],
                    gst_amt: (parseFloat(data['taxamt'])).toFixed(2),
                    tcs_per: data['tcsp'],
                    tcs_amt: (parseFloat(data['tcsamt'])).toFixed(2),
                    net_amt: data['net'],
                    grant_total: (parseFloat(data['gt'])).toFixed(2),
                    add_amount: (parseFloat(data['addamt'])).toFixed(2),
                    round: (parseFloat(data['round_amt'])).toFixed(2),
                    total_weight: (parseFloat(data['weights'])).toFixed(2),
                    items: data['items'],
                    quan: data['quans'],
                    tweight: (parseFloat(data['weights'])).toFixed(2),
                    payMod: data['pby'],

                })

            } else {

                if (this.state.billno > 0) {
                    this.setState({
                        billno: this.state.billno - 1,
                        loggedIn: false,
                    });
                    this.getLastBill()
                } else {
                    this.setState({
                        billno: this.state.nextBill,
                        loggedIn: false,
                    });
                    this.clearForm()
                    this.toast.show({ severity: 'error', summary: '!', detail: response['data']['message'], life: 3000 });
                }
            }
        }).catch((error) => {
            //   console.log(error)
            this.toast.show({ severity: 'error', summary: 'Error', detail: 'Check Connection', life: 3000 });
        })
    }

    getNextBill = () => {

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            viewBill: this.state.billno + 1,
        }

        purchaseService.getViewBill(data).then((response) => {
            if (response['data']['status'] === 1) {
                // toast.success(response['data']['message']);
                this.toast.show({ severity: 'success', summary: 'Success', detail: response['data']['message'], life: 3000 });

                let data = response['data']['data']['purchase'];
                let items = response['data']['data']['items'];

                console.log(data['cname'])
                console.log(items)
                items.map(data => {
                    data['name'] = data['iname']
                    data['item_code'] = data['ino']
                    data['rate'] = data['price']
                    data['qty'] = data['quan']
                    data['hsn_code'] = data['hsn']
                })


                this.setState({
                    viewModelBox: false,
                    grn_number: data['grn'],
                    suppliername: data['cname'],
                    billno: data['billno'],
                    due_date: data['ddate'],
                    todaydate: data['dat'],
                    selectedItem: data['grn'],
                    selectedItem: items,
                    // totalItems: items,
                    sub_total: (parseFloat(data['sub'])).toFixed(2),
                    dis_per: data['disp'],
                    dis_amt: (parseFloat(data['disamt'])).toFixed(2),
                    gst_per: data['taxp'],
                    gst_amt: (parseFloat(data['taxamt'])).toFixed(2),
                    tcs_per: data['tcsp'],
                    tcs_amt: (parseFloat(data['tcsamt'])).toFixed(2),
                    net_amt: data['net'],
                    grant_total: (parseFloat(data['gt'])).toFixed(2),
                    add_amount: (parseFloat(data['addamt'])).toFixed(2),
                    round: (parseFloat(data['round_amt'])).toFixed(2),
                    total_weight: (parseFloat(data['weights'])).toFixed(2),
                    items: data['items'],
                    quan: data['quans'],
                    tweight: (parseFloat(data['weights'])).toFixed(2),
                    payMod: data['pby'],

                })
                // this.clearForm();
                // this.openModelView();
            } else {
                // toast.error(response['data']['message']);
                if (this.state.billno <= this.state.nextBill) {
                    this.setState({
                        billno: this.state.billno + 1,
                        loggedIn: false,
                    });
                    // this.clearFormNext()
                    this.getNextBill()
                } else {
                    this.clearForm()
                    this.toast.show({ severity: 'error', summary: '!', detail: response['data']['message'], life: 3000 });
                }
            }
        }).catch((error) => {
            //   console.log(error)
            this.toast.show({ severity: 'error', summary: 'Error', detail: 'Check Connection', life: 3000 });
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

        purchaseService.getViewBill(data).then((response) => {
            if (response['data']['status'] === 1) {
                // toast.success(response['data']['message']);
                this.toast.show({ severity: 'success', summary: 'Success', detail: response['data']['message'], life: 3000 });


                let data = response['data']['data']['purchase'];
                let items = response['data']['data']['items'];

                console.log(data['cname'])
                console.log(items)
                items.map(data => {
                    data['name'] = data['iname']
                    data['item_code'] = data['ino']
                    data['rate'] = data['price']
                    data['qty'] = data['quan']
                    data['hsn_code'] = data['hsn']
                })


                this.setState({
                    viewModelBox: false,
                    grn_number: data['grn'],
                    suppliername: data['cname'],
                    billno: data['billno'],
                    due_date: data['ddate'],
                    todaydate: data['dat'],
                    selectedItem: data['grn'],
                    selectedItem: items,
                    // totalItems: items,
                    sub_total: (parseFloat(data['sub'])).toFixed(2),
                    dis_per: data['disp'],
                    dis_amt: (parseFloat(data['disamt'])).toFixed(2),
                    gst_per: data['taxp'],
                    gst_amt: (parseFloat(data['taxamt'])).toFixed(2),
                    tcs_per: data['tcsp'],
                    tcs_amt: (parseFloat(data['tcsamt'])).toFixed(2),
                    net_amt: data['net'],
                    grant_total: (parseFloat(data['gt'])).toFixed(2),
                    add_amount: (parseFloat(data['addamt'])).toFixed(2),
                    round: (parseFloat(data['round_amt'])).toFixed(2),
                    total_weight: (parseFloat(data['weights'])).toFixed(2),
                    items: data['items'],
                    quan: data['quans'],
                    tweight: (parseFloat(data['weights'])).toFixed(2),
                    payMod: data['pby'],

                })

                // this.clearForm();
                // this.openModelView();
            } else {
                // toast.error(response['data']['message']);
                this.toast.show({ severity: 'error', summary: '!', detail: response['data']['message'], life: 3000 });
                this.setState({
                    loggedIn: false,
                });
                this.clearForm()
            }
        }).catch((error) => {
            //   console.log(error)
            //  this.toast.show({severity:'error', summary: 'Error', detail: 'Check Connection', life: 3000});
        })
    }

    handleselectedItem = (event, newValue) => {
        console.log(newValue)
        if (newValue) {
            this.setState({
                stack: newValue.item_name,
                name: newValue.item_name,
                item_code: newValue.item_no,
                net_weight: newValue.net_weight,
                westage: newValue.wastage,
                making_charges: newValue.making_charge,
                price_type: newValue.price_type,
                hsn_code: newValue.hsn_code
            })
        }
    }

    handleselectedMode = (newValue) => {
        console.log(newValue)
        if (newValue) {
            this.setState({
                // payMod: newValue.value
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

    searchCountry = (event) => {
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
            _filteredCountries.map(data => {
                data['label'] = data.item_name
                data['code'] = data.item_name
            })
            this.setState({
                flterData: _filteredCountries
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
                <div style={{ width: '100%' }} onClick={(e) => this.handleselectedItem(e, item)}>{item.item_no} - {item.item_name}</div>
            </div>
        );
    }

    clearForm = () => {
        this.getLastStock();
        this.setState({
            grn_number: this.state.nextBill,
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
            flterData: [],
            payModeList: Init.PaymentMod,

            suppliername: '',
            billno: this.state.nextBill,
            // billno: ((this.state.billno > 0) && (this.state.billno < this.state.nextBill))?this.state.billno:this.state.nextBill,

            todaydate: moment().format("YYYY-MM-DD"),
            dueDateSupplier: 0,

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
            amount: 0,

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
            // payMod: 'Cash',

            modelBox: false,

            sub_total: 0,
            dis_per: 0,
            dis_amt: 0,
            gst_per: 0,
            gst_amt: 0,
            grant_total: 0,
            add_amount: 0,
            round: 0,
            total_weight: 0,
        })
    }

    removeItem = (rowData) => {
        //   console.log(rowData)
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
                <Button onClick={() => this.removeItem(rowData)} style={{ marginLeft: '-20px' }}>
                    <i className="pi pi-trash"></i>
                </Button>
            </React.Fragment>
        );
    }

    clickItemTable = (event) => {
        console.log(event)
        this.setState({
            suggestionModexBox: false,
            stack: event.value.iname,
            name: event.value.iname,
            item_code: event.value.ino,
            rate: 0,
            weight: 0,
            net_weight: event.value.net_weight,
            westage: event.value.wastage,
            making_charges: event.value.making_charge,
            qty: 1,
            qty_total: event.value.quan,
            price_type: event.value.price_type,
            hsn_code: event.value.hsn_code,
            price: event.value.price
        })
        $('#item_code').focus();
    }


    render() {

        const fontLebel = { fontSize: '12px', color: 'black', paddingBottom: '5px' };
        const lebelStyle = { fontSize: '12px', color: 'black', fontWeight: '700' };


        console.log(this.state.customer_data)

        // if (this.state.success) {
        //     return <Redirect to='/purchase-register'></Redirect>
        // }

        var sub_total = 0;
        var total_weight = 0;
        var total = 0;

        this.state.selectedItem.map((data) => {
            sub_total = sub_total + parseFloat(data.amount)
            total_weight = total_weight + Number(data.weight)
        })

        this.state.sub_total = parseFloat(sub_total).toFixed(2)
        this.state.total_weight = (parseFloat(total_weight)).toFixed(3)

        this.state.dis_amt = (parseFloat(this.state.dis_per) > 0) ? ((parseFloat(this.state.sub_total) * parseFloat(this.state.dis_per)) / 100).toFixed(2) : 0.00;

        this.state.grant_total = (parseFloat(parseFloat(this.state.sub_total) - parseFloat(this.state.dis_amt))).toFixed(2)

        this.state.gst_amt = (parseFloat(this.state.gst_per) > 0) ? ((parseFloat(this.state.grant_total) * parseFloat(this.state.gst_per)) / 100).toFixed(2) : 0.00;



        this.state.tcs_amt = (this.state.tcs_per > 0) ? ((parseFloat(this.state.grant_total) * parseFloat(this.state.tcs_per)) / 100).toFixed(2) : 0.00;

        // total =  this.state.net_amt - this.state.dis_amt
        // total =  total - this.state.gst_amt
        // total =  total - this.state.tcs_amt

        // this.state.net_amt = total

        this.state.net_amt = (parseFloat(parseFloat(this.state.grant_total) + parseFloat(this.state.gst_amt) + parseFloat(this.state.tcs_amt) + parseFloat(this.state.add_amount))).toFixed(2)

        const myArr = this.state.net_amt ? this.state.net_amt.split(".") : ("0.100").split(".");


        this.state.round = this.state.net_amt ? (parseFloat("0." + myArr[1])).toFixed(2) : 0

        if (this.state.gross_weight && this.state.loss_weight) {
            this.state.net_weight = (parseFloat(parseFloat(this.state.gross_weight) - parseFloat(this.state.loss_weight))).toFixed(3)
        }

        var lot_number = this.state.lot_no
        var item_number = this.state.item_no

        this.state.selectedItem.map((data) => {
            data['lot_no'] = lot_number
            data['item_no'] = item_number
            lot_number++
            item_number++
        })

        this.state.due_date = moment(this.state.todaydate).add(this.state.dueDateSupplier, 'days').format("DD/MM/YYYY")



        // alert(date)
        return (
            <div className="body">
                <Toast ref={(el) => this.toast = el} />
                {/* <ToastContainer />
                <NotificationContainer /> */}
                <Menu loggedIn={this.state.loggedIn} />

                <div className="continerPonitBox purchase-reg" >
                    <div className="p-grid">
                        <div className="p-col-3" style={{ backgroundColor: '#f6f5f2', height: '100vh', padding: '0px 0px', paddingTop: '8px' }}>
                            <div className="pos-header" style={{ color: '4f3f3f', textShadow: 'none', width: '100%', padding: '10px 30px' }}>
                                <h3 style={{ margin: '0px' }}>
                                    Purchase Register
                                </h3>
                            </div>
                            <div className="p-grid" style={{ padding: '10px 20px 20px 30px' }}>

                                <div className="p-col-12 submitFormButton pur-row">
                                    <div style={fontLebel}>GRN Number</div>
                                    <InputText id="billno" aria-describedby="username1-help" name="grn_number" value={this.state.grn_number} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" disabled />
                                </div>
                                <div className="p-col-12 submitFormButton pur-row">
                                    <div style={fontLebel}>GRN Date</div>
                                    {/* <Calendar id="basic" placeholder="dd/mm/yyyy" dateFormat="dd/mm/yy" style={{width:'100%'}} value={this.state.grn_date} onChange={(e) => this.setState({ grn_date: e.value })} showIcon/> */}
                                    <InputText id="billno" aria-describedby="username1-help" name="grn_date" value={moment().format("DD/MM/YYYY")} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" disabled />
                                </div>
                                <div className="p-col-12 submitFormButton pur-row">
                                    <div style={fontLebel}>Bill Number</div>
                                    <InputText id="billno" aria-describedby="username1-help" name="billno" value={this.state.billno} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                </div>

                                <div className="p-col-12 submitFormButton pur-row">
                                    <div style={fontLebel}>Supplier</div>
                                    {/* <InputText id="billno" aria-describedby="username1-help" name="suppliername" value={this.state.suppliername} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" /> */}
                                    <input list="browsers" placeholder="Enter Supplier Name" style={{ width: '100%', border: '1px solid silver', borderRadius: '3px', padding: '10px 10px' }} name="suppliername" id="browser" value={this.state.suppliername} onChange={this.onChangeSupplier} />
                                    <datalist id="browsers" >
                                        {
                                            this.state.supplierList.map((item, index) => {
                                                return <option key={index} value={item.cname} />;
                                            })
                                        }
                                    </datalist>

                                </div>

                                <div className="p-col-12 submitFormButton pur-row">
                                    <div style={fontLebel}>Bill Date </div>
                                    <div style={{ width: '100%', display: 'flex' }}>
                                        <input id="billdate" style={{ width: '85%', padding: '10px 5px', border: '1px solid silver', color: '#495057' }} aria-describedby="username1-help" name="todaydate" value={moment(this.state.todaydate).format("DD/MM/YYYY")} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                        <Calendar id="basic" style={{ width: '15%', height: '35px', color: 'white' }} value={this.state.todaydate} onChange={(e) => this.setState({ todaydate: e.value })} showIcon dateFormat="dd/mm/yy" />
                                    </div>
                                </div>
                                <div className="p-col-12 submitFormButton pur-row">
                                    <div style={fontLebel}>Due Date</div>
                                    {/* <Calendar type="date" id="basic" style={{width:'50%'}} value={this.state.due_date} onChange={(e) => this.setState({ due_date: e.value })} showIcon dateFormat="dd/mm/yy"/> */}
                                    <InputText id="billno" aria-describedby="username1-help" name="due_date" value={this.state.due_date} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />

                                </div>
                                <div className="p-col-12 submitFormButton pur-row">
                                    <div style={fontLebel}>Payment Mode </div>
                                    {/* <input list="browser11" placeholder="Select Paymode" style={{width:'100%',border:'1px solid silver',borderRadius:'3px',padding:'10px 10px'}} name="payMod" id="browser" value={this.state.payMod}  onChange={this.onChange} />
                                        <datalist id="browser11" >
                                            {  
                                                this.state.payModeList.map((item,index)=>{
                                                    return  <option key={index} value={item.name} />;
                                                })
                                            }
                                        </datalist> */}
                                    <Dropdown style={{ width: '100%' }} value={this.state.payMod} options={this.state.payModeList} onChange={(e) => this.setState({ payMod: e.target.value })} optionLabel="name" />
                                    {/* <Dropdown value={this.state.payMod} options={this.state.payModeList}  onChange={(e) => this.setState({ payMod : e.target.value})} style={{ width: '100%' }} optionLabel="name" /> */}
                                </div>
                            </div></div>
                        <div className="p-col-9" style={{ paddingLeft: '20px' }}>
                            <form onSubmit={this.submitStock} autoComplete="off">
                                <br></br>
                                {/* <div className="p-grid" style={{ marginTop: '-10px' }}>
                                    <div className="p-col-4">
                                        <h3 style={{margin:'0px'}}>
                                            Purchase Register
                                        </h3>
                                    </div>
                                    
                                </div>
                                <hr style={{border: '1px solid #ebeff5'}}></hr> */}
                                <div className="p-grid">
                                    <div className="p-col-3">
                                        <div style={fontLebel}>Item Code</div>
                                        <InputText id="item_code" aria-describedby="username1-help" onKeyUp={this.handleEnter} style={{ width: '100%' }} name="item_code" value={this.state.item_code} onChange={this.onChangeItem} className="p-inputtext-sm p-d-block p-mb-2" />
                                        <p style={{ fontSize: '10px', margin: '0px', padding: '0px' }}>Press down key for suggestions</p>
                                        {/* <autoComplete value={this.state.item_code} suggestions={this.state.flterData} completeMethod={this.searchCountry} dropdown forceSelection
                                         field="item_no" name="stack" onKeyDown={this.handleEnter} itemTemplate={this.itemTemplate}
                                         className="p-d-block InputPrimeBox"/> */}
                                        {/* <Dropdown value={this.state.stack} options={this.state.Stock} name="customer_id" onChange={this.handleselectedItem} style={{ width: '100%', padding: '0px', height: '35px' }} filter editable optionLabel="name" /> */}
                                    </div>
                                    <div className="p-col-1">
                                        <div style={fontLebel}>Qty</div>
                                        <InputText id="qty" aria-describedby="username1-help" onKeyUp={this.handleEnter} style={{ width: '100%' }} name="qty" value={this.state.qty} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2" />
                                    </div>
                                    <div className="p-col-3">
                                        <div style={fontLebel}>Pur.price</div>
                                        <InputText id="price" aria-describedby="username1-help" onKeyUp={this.handleEnter} style={{ width: '100%' }} name="rate" value={this.state.rate} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-3">
                                        <div style={fontLebel}>Weight</div>
                                        <InputText id="weight" aria-describedby="username1-help" onKeyUp={this.handleEnter} style={{ width: '100%' }} name="weight" value={this.state.weight} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-2">
                                        <div style={fontLebel}>Amount</div>
                                        <InputText id="weight" aria-describedby="username1-help" onKeyUp={this.handleEnter} style={{ width: '100%' }} name="weight" value={this.state.rate * this.state.weight} onChange={this.onChange} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    {/* <div className="p-col-2" style={{padding:'15px 10px'}}>
                                    <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                        <div className="buttonText"> 
                                            <i className="pi pi-plus-circle"></i>  <span className="buttonTextFirstLetter" style={{marginTop:'-5px'}}>A</span>dd
                                        </div>
                                    </Button>
                                </div> */}
                                </div>
                                <div style={{ height: '190px', border: '1px solid #b0a939', marginBottom: '15px', overflowX: 'scroll' }}>
                                    <div style={{ width: '1500px', marginTop: '-5px' }}>
                                        <DataTable state={{ overflowY: 'scroll' }} emptyMessage="."
                                            value={this.state.selectedItem} rows={3} first={this.state.first} onPage={(e) => this.setState({ first: e.first })}
                                        >
                                            <Column body={this.trashSelectedItem} headerStyle={{ width: '30px', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                                            <Column style={{ width: '100px' }} field="item_code" header="Item Code"></Column>
                                            <Column style={{ width: '180px' }} field="name" header="Item Name"></Column>
                                            <Column style={{ width: '120px' }} field="rate" header="Rate"></Column>
                                            <Column style={{ width: '120px' }} field="qty" header="Qty/Pcs"></Column>
                                            <Column style={{ width: '100px' }} field="weight" header="Weight"></Column>
                                            <Column style={{ width: '120px' }} field="amount" header="Amount"></Column>
                                            <Column style={{ width: '150px' }} field="hsn_code" header="HSN Code"></Column>
                                        </DataTable>
                                    </div>
                                </div>
                                <div className="p-grid" style={{ padding: '0px 6px' }}>
                                    <div className="p-col-2 submitFormButton">
                                        <div style={fontLebel}>Total Weight</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="total_weight" value={this.state.total_weight} onChange={this.onChange} onKeyUp={this.handleEnter} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <div style={fontLebel}>Sub Total</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="sub_total" value={this.state.sub_total} onChange={this.onChange} onKeyUp={this.handleEnter} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <div style={fontLebel}>Dis %</div>
                                        <InputText id="dis_per" aria-describedby="username1-help" name="dis_per" value={this.state.dis_per} onChange={this.onChange} onKeyUp={this.handleEnter} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <div style={fontLebel}>Dis Amount</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="dis_amt" value={this.state.dis_amt} onChange={this.onChange} onKeyUp={this.handleEnter} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <div style={fontLebel}>Grant Total</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="grant_total" value={this.state.grant_total} onChange={this.onChange} onKeyUp={this.handleEnter} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <div style={fontLebel}>TAX %</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="gst_per" value={this.state.gst_per} onChange={this.onChange} onKeyUp={this.handleEnter} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <div style={fontLebel}>TAX Amount</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="gst_amt" value={this.state.gst_amt} onChange={this.onChange} onKeyUp={this.handleEnter} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>

                                    <div className="p-col-2 submitFormButton">
                                        <div style={fontLebel}>TCS %</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="tcs_per" value={this.state.tcs_per} onChange={this.onChange} onKeyUp={this.handleEnter} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <div style={fontLebel}>TCS Amount</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="tcs_amt" value={this.state.tcs_amt} onChange={this.onChange} onKeyUp={this.handleEnter} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>


                                    <div className="p-col-2 submitFormButton">
                                        <div style={fontLebel}>Add Amount</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="add_amount" value={this.state.add_amount} onChange={this.onChange} onKeyUp={this.handleEnter} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <div style={fontLebel}>Round</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="round" value={this.state.round} onChange={this.onChange} onKeyUp={this.handleEnter} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>
                                    <div className="p-col-2 submitFormButton">
                                        <div style={fontLebel}>Net Total</div>
                                        <InputText id="billno" aria-describedby="username1-help" name="net_amt" value={this.state.net_amt} onChange={this.onChange} onKeyUp={this.handleEnter} className="p-inputtext-sm p-d-block p-mb-2 InputPrimeBox" />
                                    </div>

                                </div>
                            </form>
                            <form onSubmit={this.submitStackForm} autoComplete="off">
                                <div className="p-grid">
                                    <div className="p-col-2">
                                        {(this.state.billno == this.state.nextBill) ?
                                            <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                                <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">S</span>ave</div>
                                            </Button> :
                                            <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                                <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">A</span>lter</div>
                                            </Button>}

                                    </div>

                                    <div className="p-col-2">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.openModelView}>
                                            <div className="buttonText"> <i className="pi pi-eye"></i> <span className="buttonTextFirstLetter">V</span>iew</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.getLastBill}>
                                            <div className="buttonText"> <i className="pi pi-angle-double-left"></i> <span className="buttonTextFirstLetter">L</span>ast Entry</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2">

                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.getNextBill}>
                                            <div className="buttonText"><span className="buttonTextFirstLetter">N</span>ext Entry<i className="pi pi-angle-double-right"></i></div>
                                        </Button>
                                    </div>

                                    <div className="p-col-2">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.clearForm}>
                                            <div className="buttonText"> <i className="pi pi-refresh"></i> <span className="buttonTextFirstLetter">C</span>lear</div>
                                        </Button>
                                    </div>
                                    <div className="p-col-2">
                                        {(this.state.billno == this.state.nextBill) ?
                                            <Link to="/home" className="Link">
                                                <Button className="inputData buttonPrimary" variant="contained">
                                                    <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">C</span>lose</div>
                                                </Button>
                                            </Link> :
                                            <Button onClick={this.openModelDelete} className="inputData buttonPrimary" variant="contained">
                                                <div className="buttonText"> <i className="pi pi-trash"></i> <span className="buttonTextFirstLetter">D</span>elete</div>
                                            </Button>}
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>

                </div>
                <Footer />

                <Dialog visible={this.state.suggestionModexBox} modal={false} style={{ width: '80vw', height: 'auto', backgroundColor: 'white', marginTop: '-100px' }} onHide={this.openModelSuggestion}
                    draggable={true} resizable={false} baseZIndex={1} position="right">

                    <div style={{ height: '180px', border: '2px solid #227bce', overflowX: 'scroll' }}>
                        <div style={{ width: 'auto', marginTop: '-5px' }}>
                            {/* <ScrollBox style={{height: '200px',width:'100%'}} axes="1500px"> */}
                            <DataTable state={{ overflowY: 'scroll' }} selectionMode="single" dataKey="item_no"
                                value={this.state.stock} onSelectionChange={this.clickItemTable}   >
                                <Column style={{ width: '120px' }} field="ino" header="Item Code"></Column>
                                <Column style={{ width: '180px' }} field="iname" header="Name"></Column>
                                <Column style={{ width: '120px' }} field="category" header="Category"></Column>
                                <Column style={{ width: '100px' }} field="hsn_code" header="HSN"></Column>
                                <Column style={{ width: '200px' }} field="purity" header="Purity"></Column>
                                <Column style={{ width: '200px' }} field="price_type" header="Price Type"></Column>
                                <Column body={this.actionBodyTemplate} headerStyle={{ width: '8em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                            </DataTable>
                            {/* </ScrollBox> */}
                        </div>
                    </div>
                </Dialog>

                <Dialog header="View Bill" visible={this.state.viewModelBox} modal style={{ width: '30vw', height: 'auto', backgroundColor: 'white', padding: '20px' }} onHide={this.openModelView}
                    draggable={true} resizable={false} baseZIndex={1}>
                    <div className="p-field">
                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>GRN Number</label>
                        <InputText id="username1" value={this.state.viewBill} name="viewBill" aria-describedby="username1-help" onChange={this.onChange} className="p-d-block InputPrimeBox" />
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <Button type="submit" onClick={this.openModelView} className="inputData buttonSecondary" variant="contained">
                                <div className="buttonText"> <span className="buttonTextFirstLetter"> <i className="pi pi-times-circle"></i> C</span>lose</div>
                            </Button>
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
                <Dialog header="View Bill" visible={this.state.deleteModelBox} modal style={{ width: '30vw', height: 'auto', backgroundColor: 'white', padding: '20px' }} onHide={this.openModelDelete}
                    draggable={true} resizable={false} baseZIndex={1}>
                    <div className="p-field">
                        <h3>Delete</h3>
                        <label htmlFor="username1" className="p-d-block" style={lebelStyle, { fontWeight: '400' }}>Do you want to Delete this record?</label>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <Link to="/sales-bill" className="Link">
                                <Button type="submit" onClick={this.openModelDelete} className="inputData buttonSecondary" variant="contained">
                                    <div className="buttonText"> <span className="buttonTextFirstLetter"> <i className="pi pi-times-circle"></i> C</span>lose</div>
                                </Button>
                            </Link>
                        </div>
                        <div className="col-1"></div>
                        <div className="col-6">
                            {/* <Link to="/sales-bill" className="Link"> */}
                            <Button type="submit" className="inputData buttonPrimary" variant="contained" onClick={this.deleteStackForm}>
                                <div className="buttonText"> <span className="buttonTextFirstLetter"> <i className="pi pi-eye"></i> D</span>elete</div>
                            </Button>
                            {/* </Link> */}
                        </div>
                    </div>
                </Dialog>
                <Dialog header="View Bill" visible={this.state.permissionModelBox} modal style={{ width: '30vw', height: 'auto', backgroundColor: 'white', padding: '20px' }} onHide={this.openModelPermission}
                    draggable={true} resizable={false} baseZIndex={1}>
                    <div className="p-field">
                        <h3>Access Denied!</h3>
                        <label htmlFor="username1" className="p-d-block" style={lebelStyle, { fontWeight: '400' }}>You don't have permission to change this setting</label>
                    </div>
                    <div className="row">
                        <div className="col-6">

                        </div>
                        <div className="col-1"></div>
                        <div className="col-6">
                            <Button type="submit" onClick={this.openModelPermission} className="inputData buttonSecondary" variant="contained">
                                <div className="buttonText"> <span className="buttonTextFirstLetter"> <i className="pi pi-times-circle"></i> C</span>lose</div>
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}