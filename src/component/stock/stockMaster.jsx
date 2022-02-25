import React, { Component } from 'react'

//libraries
import { Loading  } from "react-loading-ui";
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import {  NotificationManager } from 'react-notifications';
import $ from 'jquery';

//internal css
import '../../assets/css/style.css';

//internal pages
import Menu from '../common/menu'
import Footer from '../common/footer'

//prime react
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import 'primeflex/primeflex.css';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

//service 
import StockService from '../../service/stock/stockService'
import ItemService from '../../service/item/itemService'

//object of services
const itemService = new ItemService();
const stockService = new StockService();

export default class stockComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: {},
            success: false,
            branchname: '',
            selectedStock: [],
            selectedCategory: '',
            selectedStockType: '',
            lot_no: 0,
            entry : 0,
            entry_temp : 0,
            item_no: 0,
            item_name:'',
            item_type:'',
            price_type:'',
            ItemNumber: '',
            wastage: '',
            makingCharges: '',
            tableData: [],
            gross_weight: '',
            loss_weight: '',
            net_weight: '',
            qty: '',
            Stock_no: '',
            isClearable: false,

            deleteModelBox: false,

            first: 0,
            action: '',
            StockTotal: 0,
            qty_total: 0,
            totalQty: 0,
            totalGrossWeight: 0,
            totalLessWeight: 0,
            totalNetWeight: 0,
            totalItems: 0,
            purity:0,

            suggestionModexBox: false,
            warnModelBox: false
        }

        this.getLastStock()
        this.getStock()
        this.onChange               = this.onChange.bind(this)
        this.actionBodyTemplate     = this.actionBodyTemplate.bind(this)
        this.submitStock            = this.submitStock.bind(this)
        this.handleEnter            = this.handleEnter.bind(this)
        this.openModelDelete        = this.openModelDelete.bind(this)
        this.openModelSuggestion    = this.openModelSuggestion.bind(this)
        this.openModelWarn          = this.openModelWarn.bind(this)
        this.trashSelectedItem      = this.trashSelectedItem.bind(this)
        this.removeItem             = this.removeItem.bind(this)
        this.getLastStockData       = this.getLastStockData.bind(this)
        this.getNextStockData       = this.getNextStockData.bind(this)

        this.deleteStackForm        = this.deleteStackForm.bind(this)
        this.submitStackForm        = this.submitStackForm.bind(this)
    }

    onChange(e) {
        var net_weight = 0
        if (this.state.gross_weight && this.state.loss_weight)
            net_weight = this.state.gross_weight - this.state.loss_weight
        this.setState({
            [e.target.name]: (e.target.name != 'net_weight') ? e.target.value : 0,
            net_weight: (e.target.name == 'net_weight') ? e.target.value : net_weight
        })
    }

    handleEnter = (event) => {
        console.log(event.keyCode)
        const form = event.target.form;
        const index = Array.prototype.indexOf ? Array.prototype.indexOf.call(form, event.target) : 0;

        if (event.keyCode === 16) {
            form.elements[index - 1].focus();
            event.preventDefault();
        }

        if ((event.keyCode === 13)  || (event.keyCode === 9)){
            const form = event.target.form;
            const index = Array.prototype.indexOf.call(form, event.target);
            console.log(index)
            if (index < 7) {
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

    openModelDelete(e) {
        e.preventDefault()

        this.setState({
            deleteModelBox: !this.state.deleteModelBox
        })
    }


    getLastStock() {

        let data = { login_user: localStorage.getItem("username"), branch: localStorage.getItem("Branch") }

        stockService.getLastStock(data).then((response) => {
            if (response['data']['status'] === 1) {
                this.setState({
                    lot_no: response['data']['data']['lot_no'],
                    item_no: response['data']['data']['item_no'],
                    entry : response['data']['data']['entry_no'],
                    entry_temp : response['data']['data']['entry_no']
                })
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }

    getStock = () => {

        let data = {
            login_user : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            checkBox: false,
            type :'item-report'
        }

        itemService.getItem(data).then((response) => {
            console.log(response)
            if (response['data']['status'] === 1) {
                response['data']['data'].map((data) => {
                    return (
                        data['value'] = data.entry_no,
                        data['label'] = data.item_name
                    )
                })
                this.setState({
                    Stock: response['data']['data']
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

        const {
            lot_no,
            Stock_no,
            item_name,
            gross_weight,
            loss_weight,
            net_weight,
            qty,
            makingCharges,
            wastage,
            price_type,
            item_type,
            item_number,
            purity,
            price,
        } = this.state

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            lot_no: lot_no + 1,
            item_no: item_number,
            Stock_no: Stock_no,
            name: item_name,
            gross_weight: gross_weight ? gross_weight : 0,
            loss_weight: loss_weight ? loss_weight : 0,
            net_weight: net_weight ? net_weight : 0,
            qty: qty ? qty : 0,
            purity:purity?purity:0,
            price_type:price_type?price_type:'',
            wastage: wastage ? wastage : 0,
            item_type:item_type?item_type:'',
            making_charges: makingCharges ? makingCharges : 0,
            price: price?price:0
        }

        this.state.selectedStock.push(data)
        this.setState({
            selectedStock: this.state.selectedStock,
            isClearable: true,
            item_number: '',
            item_name: '',
            gross_weight: '',
            loss_weight: '',
            net_weight: '',
            qty: '',
            wastage: '',
            making_charges: '',
            lot_no: lot_no + 1
        })
        // console.log(this.state.selectedStock)
    }

    submitStackForm = (e) => {
        e.preventDefault()

        Loading();

        const {
            totalQty,
            totalGrossWeight,
            totalLessWeight,
            totalNetWeight,
            totalStocks,
            selectedStock,
            totalItems,
            lot_no,
            item_no,
            entry,
            entry_temp
        } = this.state

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            type: (entry === entry_temp)?'save':'alter',
            lot_no: lot_no,
            entry_no: entry_temp,
            item_no: item_no,
            totalQty: totalQty,
            totalGrossWeight: totalGrossWeight,
            totalLessWeight: totalLessWeight,
            totalNetWeight: totalNetWeight,
            totalStocks: totalStocks,
            selectedStock: JSON.stringify(selectedStock),
            totalItems: totalItems
        }

        // console.log(data)

        stockService.saveStock(data).then((response) => {
            Loading();
            if (response['data']['status'] === 1) {
                this.toast.show({severity:'success', summary: 'Saved Successfully!', detail:response['data']['message'], life: 3000});
                NotificationManager.success('Success message', response['data']['message']);
                this.clearForm();
                $('#item_number').focus();
                this.setState({
                    entry_temp : (entry === entry_temp)?Number(entry) + 1:Number(entry)
                });
            } else {
                this.setState({
                    loggedIn: false,
                });
            }
        }).catch((error) => {
            Loading();
            this.toast.show({severity:'error', summary: 'Error', detail:'Try Again..', life: 3000});
            this.clearForm();
            $('#item_number').focus();
        })
    }

    deleteStackForm = (e) => {
        e.preventDefault()

        Loading();
        const {
            entry,
            entry_temp
        } = this.state

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            entry: Number(entry_temp),
        }

        stockService.deleteStock(data).then((response) => {
            Loading();
            if (response['data']['status'] === 1) {
                this.toast.show({severity:'success', summary: 'Saved Successfully!', detail:response['data']['message'], life: 3000});
                this.clearForm();
                $('#item_number').focus();
                this.setState({
                    entry_temp : (entry === entry_temp)?Number(entry) + 1:Number(entry),
                    deleteModelBox: false
                });
            } else {
                this.setState({
                    loggedIn: false,
                });
            }
        }).catch((error) => {
            Loading();
            // this.toast.show({severity:'error', summary: 'Error', detail:'Try Again..', life: 3000});
            // this.clearForm();
            // $('#item_number').focus();
        })

    }

    getLastStockData = (e) => {
        e.preventDefault()

        Loading();
        const {
            entry,
            entry_temp
        } = this.state

        if((entry_temp- 1)> 0)
        {

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            entry: Number(entry_temp) - 1,
        }

        stockService.getStockByEntry(data).then((response) => {
            Loading();
            if (response['data']['status'] === 1) {

                this.toast.show({severity:'success', summary: 'Saved Successfully!', detail:response['data']['message'], life: 3000});
                response['data']['data'].map((data) =>{
                    data['item_no'] = data['item_no']
                    data['name'] = data['item_name']
                    data['loss_weight'] = data['less_weight']
                    data['making_charges'] = data['making']
                    data['qty'] = data['quan']
                })
                // this.state.selectedStock.push(response['data']['data']['stock'])
                this.setState({
                    selectedStock: response['data']['data'],
                    entry_temp : Number(entry_temp) - 1
                });
                $('#item_number').focus();
            } else {
                Loading();
                this.setState({
                    loggedIn: false,
                    selectedStock: [],
                    entry_temp : Number(entry_temp) - 1
                });
                this.getLastStockData();
            }
        }).catch((error) => {
            Loading();
            // this.toast.show({severity:'error', summary: 'Error', detail:'Try Again..', life: 3000});
            // this.clearForm();
            // $('#item_number').focus();
        })

        } else {
            alert('Record not available')
            this.setState({
                selectedStock: [],
                entry_temp : Number(entry)
            });
            Loading();
        }
    }

    getNextStockData = (e) => {
        e.preventDefault()

        Loading();
        const {
            entry,
            entry_temp
        } = this.state

        if((entry_temp + 1)< entry)
        {

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            entry: Number(entry_temp) + 1,
        }

        stockService.getStockByEntry(data).then((response) => {
            Loading();
            if (response['data']['status'] === 1) {
                this.toast.show({severity:'success', summary: 'Saved Successfully!', detail:response['data']['message'], life: 3000});
                response['data']['data'].map((data) =>{
                    data['item_no'] = data['item_no']
                    data['name'] = data['item_name']
                    data['loss_weight'] = data['less_weight']
                    data['making_charges'] = data['making']
                    data['qty'] = data['quan']
                })
                // this.state.selectedStock.push(response['data']['data']['stock'])
                this.setState({
                    selectedStock: response['data']['data'],
                    entry_temp : Number(entry_temp) + 1
                });
                $('#item_number').focus();
            } else {
                this.setState({
                    loggedIn: false,
                    entry_temp : Number(entry_temp) + 1
                });
                this.getNextStockData();
            }
        }).catch((error) => {
            Loading();
            // this.toast.show({severity:'error', summary: 'Error', detail:'Try Again..', life: 3000});
            // this.clearForm();
            // $('#item_number').focus();
        })
    } else {
        alert('Record not available')
        this.setState({
            selectedStock: [],
            entry_temp : Number(entry)
        });
        Loading();
    }
    }


    handleSelectedStock = (newValue) => {
        console.log(newValue)
        if (newValue) {
            this.setState({
                name: newValue.item_name,
                makingCharges: newValue.making_charge,
                wastage: newValue.wastage,
            })
        }
    }

    actionBodyTemplate = () => {
        return (
            <Button type="button" icon="pi pi-cog" className="p-button-secondary"></Button>
        );
    }

    openModelSuggestion(e) {
        this.setState({
            suggestionModexBox: !this.state.suggestionModexBox
        })
        $('#item_number').focus();
    }

    openModelWarn(e){
        this.setState({
            warnModelBox: !this.state.warnModelBox
        })
    }

    removeItem = (rowData) => {
        //   alert(rowData.item_no)
          console.log(this.state.selectedStock)
           let data = []
           for (let item of this.state.selectedStock) {
               console.log(item)
               if ((rowData.item_no != item.item_no)  && (rowData.name != item.name)){
                   data.push(item)
               }
           }
           this.setState({
                selectedStock: data
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

    clickItemTable = (event) =>{
        this.setState({
            suggestionModexBox    : false,
            lot_no                  : this.state.lot_no,
            stack                   : event.value.iname,
            item_name               : event.value.iname,
            item_number             : event.value.ino,
            rate                    : event.value.price,
            weight                  : 0,
            net_weight              : event.value.net_weight,
            wastage                 : event.value.wastage,
            makingCharges          : event.value.making_charge,
            qty                     : 1,
            qty_total               : event.value.quan,
            price_type              : event.value.price_type,
            item_type              : event.value.item_type,
            hsn_code                : event.value.hsn_code,
            price                   : event.value.price,
            purity              : event.value.purity,
        })
        // this.toast.show({severity:'success', summary: 'Saved Successfully!', detail:'', life: 3000});
        $('#gross_weight').focus();
    }

    clearForm = () => {
            this.setState({
                branchname: '',
                item_name               : '',
                item_number             : '',
                selectedStock: [],
                selectedCategory: '',
                selectedStockType: '',
                ItemNumber: '',
                wastage: '',
                makingCharges: '',
                tableData: [],
                gross_weight: '',
                loss_weight: '',
                net_weight: '',
                qty: '',
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
                // warnModelBox: !this.state.warnModelBox
            })
        $('#item_number').focus();
    }


    render() {

        // if (this.state.success) {
        //     return <Redirect to='/stock-list'></Redirect>
        // }

        var totalStocks = 0;
        var totalQty = 0;
        var totalGrossWeight = 0;
        var totalLessWeight = 0;
        var totalNetWeight = 0;

        this.state.selectedStock.map((data) => {
            totalStocks++
            totalQty = totalQty + Number(data.qty)
            totalGrossWeight = totalGrossWeight + Number(data.gross_weight)
            totalLessWeight = totalLessWeight + Number(data.loss_weight)
            totalNetWeight = totalNetWeight + Number(data.net_weight)
        })
        
        this.state.totalQty = totalQty
        this.state.totalGrossWeight = totalGrossWeight
        this.state.totalLessWeight = totalLessWeight
        this.state.totalNetWeight = totalNetWeight
        this.state.totalItems = totalStocks


        this.state.net_weight = (this.state.gross_weight - this.state.loss_weight)


        var lot_number = this.state.lot_no
        // var item_number = this.state.item_no

        this.state.selectedStock.map((data) => {
            data['lot_no'] = lot_number
            // data['item_no'] = item_number
            lot_number++
            // item_number++
        })

        const lebelStyle = { fontSize: '12px', color: 'black' };

        return (
            <div className="body">
                <Toast ref={(el) => this.toast = el} />
                <Menu loggedIn={this.state.loggedIn} />
                <div className="continerPonitBox  " style={{overflow: 'hidden'}}>
                    <div className="p-grid pos-header" style={{color: 'white', textShadow: '0px 0px 5px black', padding: '10px 20px 10px', marginTop: '-10px', marginLeft: '-20px', marginBottom: '10px', width: '105%', border: '1px solid silver' }}>
                        <div className="p-col-4" >
                            <h3 style={{ margin: '0px' }}>
                                Stock Master
                                    </h3>
                        </div>
                        <div className="p-col-8">
                        </div>
                    </div>
                    <form style={{padding:'0px 10px'}} autoComplete="off">
                        <div className="p-grid">
                            <div className="p-col-1">
                                <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Entry Number</label>
                                        <div style={{border:'1px solid silver',padding: '10px',borderRadius:'5px'}}>
                                            {this.state.entry_temp}
                                        </div>
                                        {/* <InputText id="username1" id="item_number" value={this.state.item_number} name="ItemNumber" autoFocus aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />  */}
                                </div>
                            </div>
                            <div className="p-col-1">
                                <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Item Code</label>
                                        <InputText id="username1" id="item_number" value={this.state.item_number} name="ItemNumber" autoFocus aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" /> 
                                </div>
                            </div>
                            <div className="p-col-3">
                                <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Item Name</label>
                                        <InputText id="username1" value={this.state.item_name} name="item_name" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" /> 
                                        <p style={{fontSize:'10px',margin: '0px',padding: '0px'}}>Press down key for suggestions</p>
                                </div>
                            </div>
                            <div className="p-col-1">
                                <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Weight</label>
                                        <InputText id="username1" id="gross_weight" value={this.state.gross_weight} name="gross_weight" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />   
                                </div>
                            </div>
                            <div className="p-col-1">
                                <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Less Weight</label>
                                        <InputText id="username1" value={this.state.loss_weight} name="loss_weight" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />   
                                </div>
                            </div>
                            <div className="p-col-1">
                                <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Gross Weight</label>
                                        <InputText id="username1" value={this.state.net_weight} name="net_weight" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />   
                                </div>
                            </div>
                            <div className="p-col-1">
                                <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Wastage %</label>
                                        <InputText id="username1" value={this.state.wastage} name="wastage" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />   
                                </div>
                            </div>
                            
                            <div className="p-col-2">
                                <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Making Charges</label>
                                        <InputText id="username1" value={this.state.makingCharges} name="makingCharges" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />   
                                </div>
                            </div>
                            <div className="p-col-1">
                                <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Qty / Pcs</label>
                                        <InputText id="username1" value={this.state.qty} name="qty" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />   
                                </div>
                            </div>
                        </div>
                        <div className='table-style'>
                            <div style={{ width: '1500px', marginTop: '-5px' }}>
                                <DataTable value={this.state.selectedStock}  onPage={(e) => this.setState({ first: e.first })}
                                   >
                                    <Column body={this.trashSelectedItem} headerStyle={{ width: '30px', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} />
                                    <Column style={{ width: '70px' }} field="lot_no" header="Lot No"></Column>
                                    <Column style={{ width: '120px' }} field="item_no" header="Item Code"></Column>
                                    <Column style={{ width: '200px' }} field="name" header="Name"></Column>
                                    <Column style={{ width: '130px' }} field="gross_weight" header="Weight"></Column>
                                    <Column style={{ width: '120px' }} field="loss_weight" header="Less Weight"></Column>
                                    <Column style={{ width: '120px' }} field="net_weight" header="Gross Weight"></Column>
                                    <Column style={{ width: '120px' }} field="wastage" header="Wastage"></Column>
                                    <Column style={{ width: '150px' }} field="making_charges" header="Making Charges"></Column>
                                    <Column style={{ width: '120px' }} field="qty" header="Qty/Pcs"></Column>
                                    {/* <Column body={this.actionBodyTemplate} headerStyle={{ width: '8em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} /> */}
                                </DataTable>
                            </div>
                        </div>
                        <div className="p-grid" style={{ margin: '0px 0px' }}>
                            <div className="p-col-2">
                                <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Total Items</label>
                                        <InputText id="username1" value={totalStocks} name="StockTotal" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />   
                                </div>
                            </div>
                            <div className="p-col-2">
                                <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Total Qty</label>
                                        <InputText id="username1" value={totalQty} name="StockTotal" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />   
                                </div>
                            </div>
                            <div className="p-col-2">
                                <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Weight</label>
                                        <InputText id="username1" value={totalGrossWeight} name="StockTotal" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />   
                                </div>
                            </div>
                            <div className="p-col-3">
                                <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Less Weight</label>
                                        <InputText id="username1" value={totalLessWeight} name="StockTotal" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />   
                                </div>
                            </div>
                            <div className="p-col-3">
                                <div className="p-field">
                                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Gross Weight</label>
                                        <InputText id="username1" value={totalNetWeight} name="StockTotal" aria-describedby="username1-help" onChange={this.onChange} onKeyDown={this.handleEnter} className="p-d-block InputPrimeBox" />   
                                </div>
                            </div>
                        </div>
                    </form>
                    <form style={{padding:'0px 20px'}} autoComplete="off">
                        <div className="p-grid">
                            {/* <div className='p-col-4'></div> */}
                            <div className="p-col-2">
                                {(this.state.entry === this.state.entry_temp) ?
                                    <Button onClick={this.submitStackForm} className="inputData buttonSecondary reportButton" variant="contained" onKeyDown={this.handleEnter}>
                                        <div className="buttonText" style={{textAlign:'center',width:'100%'}}> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">S</span>ave</div>
                                    </Button> :
                                    <Button onClick={this.submitStackForm} className="inputData buttonSecondary reportButton" variant="contained" onKeyDown={this.handleEnter}>
                                        <div className="buttonText" style={{textAlign:'center',width:'100%'}}> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">A</span>lter</div>
                                    </Button>
                                }
                            </div>
                            <div className="p-col-2">
                                <Button className="inputData buttonSecondary reportButton" variant="contained"  onClick={this.getLastStockData}>
                                    <div className="buttonText" style={{textAlign:'center',width:'100%'}}> <i className="pi pi-angle-double-left"></i> <span className="buttonTextFirstLetter">L</span>ast <span className="buttonTextFirstLetter">E</span>ntry</div>
                                </Button>
                            </div>
                            <div className="p-col-2">
                                <Button className="inputData buttonSecondary reportButton" variant="contained"  onClick={this.getNextStockData}>
                                    <div className="buttonText" style={{textAlign:'center',width:'100%'}}> <i className="pi pi-angle-double-right"></i> <span className="buttonTextFirstLetter">N</span>ext <span className="buttonTextFirstLetter">E</span>ntry</div>
                                </Button>
                            </div>
                            <div className="p-col-2">
                                {(this.state.entry === this.state.entry_temp) ?
                                    <Link to="/home" className="Link">
                                        <Button className="inputData buttonSecondary reportButton" variant="contained" onKeyDown={this.handleEnter}>
                                            <div className="buttonText" style={{textAlign:'center',width:'100%'}}> <i className="pi pi-times-circle"></i> <span className="buttonTextFirstLetter">C</span>lose</div>
                                        </Button>
                                    </Link> :
                                    <Button onClick={this.openModelDelete} className="inputData buttonSecondary reportButton" variant="contained" onKeyDown={this.handleEnter}>
                                        <div className="buttonText" style={{textAlign:'center',width:'100%'}}> <i className="pi pi-trash"></i> <span className="buttonTextFirstLetter">D</span>elete</div>
                                    </Button>
                                }
                            </div>
                            <div className="p-col-2">
                                <Button className="inputData buttonSecondary reportButton" variant="contained"  onClick={(this.state.selectedStock.length < 0)?this.openModelWarn:this.clearForm}>
                                    <div className="buttonText" style={{textAlign:'center',width:'100%'}}> <i className="pi pi-refresh"></i> <span className="buttonTextFirstLetter">C</span>lear</div>
                                </Button>
                            </div>
                            <div className="p-col-2">
                                <Link to="/home" className="Link">
                                    <Button className="inputData buttonSecondary reportButton"   variant="contained">
                                        <div className="buttonText" style={{textAlign:'center',width:'100%'}}> <i className="pi pi-home"></i> <span className="buttonTextFirstLetter">H</span>ome</div>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
                <Footer />

                <Dialog visible={this.state.suggestionModexBox} modal={false} style={{ width: '80vw', height: '400px', backgroundColor: 'white', marginTop: '200px', marginLeft: '60px' }} onHide={this.openModelSuggestion}
                    draggable={true} resizable={false} baseZIndex={1} position="left">

                    <div style={{ height: '400px', border: '2px solid #227bce', overflowX: 'scroll' }}>
                        <div style={{ width: 'auto', marginTop: '-5px' }}>
                            {/* <ScrollBox style={{height: '200px',width:'100%'}} axes="1500px"> */}
                            <DataTable state={{ overflowY: 'scroll' }} selectionMode="single" globalFilter={this.state.item_name|| this.state.item_number}
                                value={this.state.Stock}  onSelectionChange={this.clickItemTable}                                >
                                <Column style={{ width: '120px' }} field="ino" header="Item Code"></Column>
                                <Column style={{ width: '180px' }} field="iname" header="Item Name"></Column>
                                <Column style={{ width: '120px' }} field="purity" header="Purity"></Column>
                                <Column style={{ width: '100px' }} field="hsn_code" header="HSN"></Column>
                                <Column style={{ width: '200px' }} field="price_type" header="Price Type"></Column>
                                {/* <Column body={this.actionBodyTemplate} headerStyle={{ width: '8em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} /> */}
                            </DataTable>
                            {/* </ScrollBox> */}
                        </div>
                    </div>
                </Dialog>

                <Dialog header="View Bill" visible={this.state.warnModelBox} modal style={{ width: '30vw', height: 'auto', backgroundColor: 'white', padding:'20px'}} onHide={this.openModelWarn}
                    draggable={true} resizable={false} baseZIndex={1}>
                    <div className="p-field">
                        <h3>Clear</h3>
                        <label htmlFor="username1" className="p-d-block"  style={lebelStyle,{fontWeight:'400'}}>Do you want to Clear this Record?</label>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            {/* <Link className="Link"> */}
                                <Button type="submit" style={{width:'100%'}} onClick={this.openModelWarn} className="inputData buttonSecondary" variant="contained">
                                    <div className="buttonText" style={{margin:'0px auto'}}> <span className="buttonTextFirstLetter"> <i className="pi pi-times-circle"></i> C</span>lose</div>
                                </Button>
                            {/* </Link> */}
                        </div>
                        <div className="col-1"></div>
                        <div className="col-6">
                            {/* <Link to="/sales-bill" className="Link"> */}
                            <Button type="submit" style={{width:'100%'}}  className="inputData buttonPrimary" variant="contained" onClick={this.clearForm}>
                                <div className="buttonText" style={{margin:'0px auto'}}> <span className="buttonTextFirstLetter"> <i className="pi pi-eye"></i> C</span>lear</div>
                            </Button>
                            {/* </Link> */}
                        </div>
                    </div>
                </Dialog>
                <Dialog header="View Bill" visible={this.state.deleteModelBox} modal style={{ width: '30vw', height: 'auto', backgroundColor: 'white', padding:'20px'}} onHide={this.openModelDelete}
                    draggable={true} resizable={false} baseZIndex={1}>
                    <div className="p-field">
                        <h3>Delete</h3>
                        <label htmlFor="username1" className="p-d-block"  style={lebelStyle,{fontWeight:'400'}}>Do you want to Delete this record?</label>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <Link to="/stock-master" className="Link">
                                <Button type="submit" onClick={this.openModelDelete} className="inputData buttonSecondary reportButton" variant="contained">
                                    <div className="buttonText" style={{textAlign:'center',width:'80%'}}> <span className="buttonTextFirstLetter"> <i className="pi pi-times-circle"></i> C</span>lose</div>
                                </Button>
                            </Link>
                        </div>
                        <div className="col-6">
                            {/* <Link to="/sales-bill" className="Link"> */}
                            <Button type="submit" className="inputData buttonSecondary reportButton" variant="contained" onClick={this.deleteStackForm}>
                                <div className="buttonText" style={{textAlign:'center',width:'80%'}}> <span className="buttonTextFirstLetter"> <i className="pi pi-trash"></i> D</span>elete</div>
                            </Button>
                            {/* </Link> */}
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}