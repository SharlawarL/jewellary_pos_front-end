import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { InputText } from 'primereact/inputtext';
// import { CustomerService } from '../service/CustomerService';
import { Link } from "react-router-dom";
import '../../assets/css/style.css';
import jsPDF from 'jspdf';
import { Dialog } from 'primereact/dialog';

import Menu from '../common/menu'
import Footer from '../common/footer'

import 'primeflex/primeflex.css';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';

import moment from "moment";

//service 
import StockService from '../../service/stock/stockService'
import ItemService from '../../service/item/itemService'
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
//service 
import SalesService from '../../service/sales/salesService'
import { useThemeProps } from '@material-ui/data-grid';
import CustomerService from '../../service/customer/customerService'

//object of services
const salesService = new SalesService();
const customerService = new CustomerService();

export default function DataTableFilterDemo(props) {
    console.log(props)
    const toast = useRef(null);
    const [stock, setStock] = useState(null);

    const [viewBill, setViewBill] = useState(null);


    const [customer_data, setCustemerData] = useState(null);
    const [selectedRepresentative, setSelectedRepresentative] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);

    const [displayBasic, setDisplayBasic] = useState(false);
    const [displayBasic2, setDisplayBasic2] = useState(false);

    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
    });

    const [date1, setValue1] = useState(null);
    const [date2, setValue2] = useState(null);
    const [customer, setCustomer] = useState();
    const [id, setId] = useState();
    const dt = useRef(null);

    const cols = [
        { field: 'item_name', header: 'Item name' },
        { field: 'gross_weight', header: 'Gross weight' },
        { field: 'less_weight', header: 'Lss Weight' },
        { field: 'net_weight', header: 'Net Weight' }
    ];

    const exportColumns = cols.map(col => ({ title: col.header, dataKey: col.field }));

    const statuses = [
        'unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'
    ];

    const filterDate = (value, filter) => {
        if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
            return true;
        }

        if (value === undefined || value === null) {
            return false;
        }

        return value === formatDate(filter);
    }

    const rowClass = (data) => {
        return {
            'row-accessories': data.cashier === 'Total'
        }
    }

    const dialogFuncMap = {
        'displayBasic': setDisplayBasic,
        'displayBasic2': setDisplayBasic2
    }

    const formatDate = (date) => {
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (month < 10) {
            month = '0' + month;
        }

        if (day < 10) {
            day = '0' + day;
        }

        return date.getFullYear() + '-' + month + '-' + day;
    }

    const handleCustomerEnter = (event) => {
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
            setDisplayBasic(true)
        }
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }

    const onClick = (name) => {
        dialogFuncMap[`${name}`](true);
    }

    const onRepresentativesChange = (e) => {
        dt.current.filter(e.value, 'representative.name', 'in');
        setSelectedRepresentative(e.value);
    }

    const onDateChange = (e) => {
        dt.current.filter(e.value, 'date', 'custom');
        setSelectedDate(e.value);
    }

    const onStatusChange = (e) => {
        dt.current.filter(e.value, 'status', 'equals');
        setSelectedStatus(e.value);
    }

    const exportCSV = (selectionOnly) => {
        dt.current.exportCSV({ selectionOnly });
    }

    const exportPdf = () => {
        import('jspdf').then(jsPDF => {
            import('jspdf-autotable').then(() => {
                const doc = new jsPDF.default(0, 0);
                doc.autoTable(exportColumns, stock);
                doc.save('stock.pdf');
            })
        })
    }

    const exportExcel = () => {
        if (stock) {
            import('xlsx').then(xlsx => {
                const worksheet = xlsx.utils.json_to_sheet(stock);
                const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
                const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
                saveAsExcelFile(excelBuffer, 'stock');
            });
        } else {
            toast.current.show({ severity: 'error', summary: 'Message', detail: 'Select dates!', life: 3000 });
        }
    }

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then(FileSaver => {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data = new Blob([buffer], {
                type: EXCEL_TYPE
            });
            FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        });
    }


    const representativesItemTemplate = (option) => {
        return (
            <div className="p-multiselect-representative-option">
                <img alt={option.name} src={`showcase/demo/images/avatar/${option.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width={32} style={{ verticalAlign: 'middle' }} />
                <span className="image-text">{option.name}</span>
            </div>
        );
    }

    const statusItemTemplate = (option) => {
        return <span className={`customer-badge status-${option}`}>{option}</span>;
    }

    // ****** BEGINNING OF CHANGE ******
    useEffect(() => {
        getItem();
    }, []);

    const getItem = () => {
        let data = { login_user: localStorage.getItem("username") }

        customerService.getCustomer(data).then((response) => {
            console.log(response)
            if (response['data']['status'] === 1) {
                setCustemerData(response['data']['data']);
            }
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    };

    const getDateItem = () => {
        console.log(moment(date1).format("YYYY/MM/DD"))
        console.log(moment(date2).format("YYYY/MM/DD"))

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            from: moment(date1).format("YYYY-MM-DD"),
            to: moment(date2).format("YYYY-MM-DD"),
            type: 'report-customer',
            customer: customer,
            id: id
        }

        salesService.getSalesReport(data).then((response) => {
            console.log(response)
            if (response['data']['status'] === 1) {
                
                
                var total_items = 0
                var total_qty      = 0
                var total_weight      = 0
                var total_subtotal    = 0
                var total_making   = 0
                var total_old      = 0
                var total_disamt      = 0
                var total_gross      = 0
                var total_tax      = 0
                var total_net     = 0

                response['data']['data'].map((data)=>{
                    data['sub_total']    = (Number(data['sub_total'])).toFixed(2)
                    data['old_amt']    = (Number(data['old_amt'])).toFixed(2)
                    data['dis_amt']  = (Number(data['dis_amt'])).toFixed(2)
                    data['gross_amt']  = (Number(data['gross_amt'])).toFixed(2)
                    data['tax_amt']  = (Number(data['tax_amt'])).toFixed(2)
                    data['sub_total']  = (Number(data['sub_total'])).toFixed(2)
                    total_items     = parseFloat(total_items)     + parseFloat(data['items'])
                    total_qty       = parseFloat(total_qty)   + parseFloat(data['quans'])
                    total_weight    = parseFloat(total_weight)    + parseFloat(data['tweight'])
                    total_subtotal  = parseFloat(total_subtotal)    + parseFloat(data['sub_total'])
                    total_making    = parseFloat(total_making)  + parseFloat(data['make'])
                    total_old       = parseFloat(total_old)   + parseFloat(data['old_amt'])
                    total_disamt    = parseFloat(total_disamt)     + parseFloat(data['dis_amt'])
                    total_gross     = parseFloat(total_gross)     + parseFloat(data['gross_amt'])
                    total_tax       = parseFloat(total_tax)     + parseFloat(data['tax_amt'])
                    total_net       = parseFloat(total_net)     + parseFloat(data['sub_total'])
                })

                let temp = { cashier : '.', 
                                items: '', 
                                quans: '', 
                                tweight: '',  
                                sub_total : '', 
                                make : '', 
                                old_amt : '', 
                                dis_amt : '', 
                                gross_amt : '', 
                                tax_amt : '', 
                                sub_total : '', 
                            }

                response['data']['data'].push(temp)

                let tdata = { cashier : 'Total', 
                                items: Number(total_items), 
                                quans: Number(total_qty), 
                                tweight: (Number(total_weight)).toFixed(2), 
                                sub_total : (Number(total_subtotal)).toFixed(2), 
                                make : (Number(total_making)).toFixed(2),
                                old_amt : (Number(total_old)).toFixed(2),
                                dis_amt : (Number(total_disamt)).toFixed(2),
                                gross_amt : (Number(total_gross)).toFixed(2),
                                tax_amt : (Number(total_tax)).toFixed(2),
                                sub_total : (Number(total_net)).toFixed(2)
                            }

                response['data']['data'].push(tdata)

                setStock(response['data']['data']);

                toast.current.show({ severity: 'success', summary: 'Message', detail: 'Generated data!', life: 3000 });
            } else {
                toast.current.show({ severity: 'error', summary: 'Message', detail: 'No result found!', life: 3000 });
            }
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }


    const statusBodyTemplate = (rowData) => {
        return <span >
            <Link
                to={{
                    pathname: "/sales-view",
                    state: {
                        user: rowData.cname,
                        billno: rowData.billno,
                        created_on: rowData.dat,
                    }
                }}

                className="linkPrimary"> <VisibilityOutlinedIcon /></Link>
        </span>;
    }

    const clearForm = () => {
        setValue1('')
        setValue2('')
        setStock(null)
    }

    var count = 1;

    var total_item = 0
    var total_weight = 0
    var total_sub = 0
    var total_making = 0
    var total_old = 0
    var total_dis = 0
    var total_gross = 0
    var total_tax = 0
    var total_net = 0

    if (stock)
        stock.map((data) => {
            data['sr_no'] = count;
            count++
        })

    const lebelStyle = { fontSize: '12px', color: 'black' };

    const clickedRow = (event) => {
        setCustomer(event.value.cname)
        setId(event.value.cid)
        onHide('displayBasic')
    }

    const enterKey = (event) =>{
        console.log(event.charCode)

    }


    return (
        <>
            <Menu loggedIn={props.loggedIn} />
            <div className="continerPonitBox">
                <Toast ref={toast} />
                <div className="datatable-filter-demo">
                    <div className="card" style={{ width: '100%', padding: '10px 10px' }}>
                        <h3 style={{ margin: '0px 0px 15px' }}>Customer Sales Report</h3>
                        <div className="p-grid-data">
                            <div style={{ padding: '10px 10px', width:'100px', textAlign: "left" }}>
                                <div className="p-field">
                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Date From </label>
                                </div>
                            </div>
                            <div className="column-input" style={{ width: '170px' }}>
                                <div className="p-field">
                                    <Calendar id="icon" value={date1} onChange={(e) => setValue1(e.value)} showIcon />
                                    {/* <InputText type="date" id="username1" name="date1" aria-describedby="username1-help" onChange={(e) => setValue1(e.target.value)} className="p-d-block InputPrimeBox" value={date1} /> */}
                                </div>
                            </div>
                            <div style={{ padding: '10px 10px', textAlign: "right" }}>
                                <div className="p-field">
                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>To </label>
                                </div>
                            </div>
                            <div className="column-input" style={{ width: '170px' }}>
                                <div className="p-field">
                                    <Calendar id="icon" value={date2} minDate={date1} onChange={(e) => setValue2(e.value)} showIcon />
                                    {/* <InputText type="date" id="username1" min={date1} name="date2" aria-describedby="username1-help" onChange={(e) => setValue2(e.target.value)} className="p-d-block InputPrimeBox" value={date2} /> */}
                                </div>
                            </div>
                            <div style={{ padding: '10px 10px', textAlign: "right" }}>
                                <div className="p-field">
                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Customer </label>
                                </div>
                            </div>
                            <div className="column-input" style={{ width: '230px' }}>
                                <div className="p-field">
                                    <InputText id="username1" min={date1} name="customer" aria-describedby="username1-help" onChange={(e) => setCustomer(e.target.value)} onKeyDown={handleCustomerEnter} placeholder="Enter name" className="p-d-block InputPrimeBox" value={customer} />
                                </div>
                            </div>
                            <div className="column-input" style={{ width: '110px' }}>
                                <div className="p-field">
                                    <InputText id="username1" min={date1} name="customer" aria-describedby="username1-help" onChange={(e) => setId(e.target.value)} placeholder="Enter ID" className="p-d-block InputPrimeBox" value={id} />
                                </div>
                            </div>
                            <div className="p-col-2 column-input">
                                <div className="p-field">
                                    <Button className="inputData buttonSecondary" variant="contained" onClick={getDateItem}>
                                        <div className="buttonText"> <i className="pi pi-list"></i> <span className="buttonTextFirstLetter">G</span>enerate</div>
                                    </Button>
                                </div>
                            </div>
                            <div className="p-col-2 column-input">
                                <span className="p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search" />
                                </span>
                                {/* <Button type="button" icon="pi pi-file-o" onClick={() => exportCSV(false)} className="p-mr-2" data-pr-tooltip="Export CSV" tooltipOptions={{ position: 'bottom' }} />
                                    <Button type="button" icon="pi pi-file-excel" onClick={exportExcel} className="p-button-success p-mr-2" data-pr-tooltip="Export XLS" tooltipOptions={{ position: 'bottom' }} />
                                    <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning p-mr-2" data-pr-tooltip="Export PDF" tooltipOptions={{ position: 'bottom' }} /> */}
                            </div>
                        </div>
                        <Tooltip target=".export-buttons>button" position="bottom" />
                        <div style={{ height: '50vh', border: '1px solid #227bce', overflowX: 'scroll' }}>
                            <div style={{ width: '3500px', marginTop: '-5px' }}>
                                <DataTable ref={dt} value={stock} rowClassName={rowClass}
                                    className="p-datatable-striped"
                                    globalFilter={globalFilter} emptyMessage="No Search Result.">
                                    <Column field="billno"      style={{ width: '120px' }} header="Bill Number" />
                                    <Column field="bdate" header="Date" />
                                    <Column field="cashier"     header="Cashier" />
                                    <Column field="items"       style={{ width: '150px',textAlign:'right' }} header="Total Items" />
                                    <Column field="quans"       style={{ width: '150px',textAlign:'right' }} header="Total Qty" />
                                    <Column field="tweight"     style={{ width: '150px',textAlign:'right' }} header="Total Weight" />
                                    <Column field="sub_total"   style={{ width: '150px',textAlign:'right' }} header="Sub Total" />
                                    <Column field="make"        style={{ width: '200px',textAlign:'right' }} header="Making Charges" />
                                    <Column field="old_amt"     style={{ width: '150px',textAlign:'right' }} header="Old Value" />
                                    <Column field="dis_per"     style={{ width: '150px',textAlign:'right' }} header="Dis %" />
                                    <Column field="dis_amt"     style={{ width: '150px',textAlign:'right' }} header="Dis Amount" />
                                    <Column field="gross_amt"   style={{ width: '200px',textAlign:'right' }} header="Gross Amount" />
                                    <Column field="tax_amt"     style={{ width: '200px',textAlign:'right' }} header="Tax Amount" />
                                    <Column field="sub_total"   style={{ width: '200px' ,textAlign:'right' }} header="Net Amount" />
                                    <Column field="pby"         style={{ width: '200px' ,textAlign:'right' }} header="Pay mode" />
                                    <Column field="cid"         header="Customer ID" />
                                    <Column field="cname"       style={{ width: '400px' }} header="Customer Name" />
                                    <Column field="mobile"      header="Mobile" />
                                    <Column field="remarks"     style={{ width: '400px' }} header="Remarks" />
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-grid" style={{ padding: '10px 15px' }}>
                    <div className="p-col-8 submitFormButton"></div>
                    <div className="p-col-1 submitFormButton">
                        <Button className="inputData buttonSecondary reportButton" variant="contained" onClick={() => onClick('displayBasic2')}>
                            <div className="buttonText"> <i className="pi pi-eye"></i> <span className="buttonTextFirstLetter">V</span>iew</div>
                        </Button>
                    </div>
                    <div className="p-col-1 submitFormButton">
                        <Button className="inputData buttonSecondary reportButton" onClick={exportExcel} variant="contained" >
                            <div className="buttonText"> <i className="pi pi-file-excel"></i> <span className="buttonTextFirstLetter">E</span>xcel</div>
                        </Button>
                    </div>
                    <div className="p-col-1 submitFormButton">
                        <Link to="/sales-customer-report" className="Link">
                            <Button className="inputData buttonSecondary reportButton" onClick={clearForm} variant="contained">
                                <div className="buttonText"> <i className="pi pi-refresh"></i> <span className="buttonTextFirstLetter">C</span>lear</div>
                            </Button>
                        </Link>
                    </div>
                    <div className="p-col-1 submitFormButton">
                        <Link to="/home" className="Link">
                            <Button className="inputData buttonSecondary reportButton" variant="contained">
                                <div className="buttonText"> <i className="pi pi-home"></i> <span className="buttonTextFirstLetter">H</span>ome</div>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />

            <Dialog visible={displayBasic} style={{ width: '80vw', height: 'auto', backgroundColor: 'white', marginTop: '130px' }} onHide={() => onHide('displayBasic')}
                draggable={true} resizable={false} baseZIndex={1}>
                <div style={{ height: '180px', border: '2px solid #227bce', overflowX: 'scroll' }}>
                    <div style={{ width: 'auto', marginTop: '-5px' }}>
                        <DataTable value={customer_data} selectionMode="single" dataKey="cid" onSelectionChange={clickedRow}>
                            <Column field="cid" style={{ width: '140px' }} header="Customer ID"></Column>
                            <Column field="cname" header="Customer Name"></Column>
                            <Column field="add1" header="Address"></Column>
                            <Column field="mobile" header="Mobile"></Column>
                            <Column field="email" header="Email"></Column>
                        </DataTable>
                    </div>
                </div>
                <p><b>Note </b>: Click row to select user.</p>
            </Dialog>


            <Dialog header="Header" visible={displayBasic2} style={{ width: '30vw', padding:'20px', backgroundColor:'white' }}  onHide={() => onHide('displayBasic2')}>
                    <div className="p-field">
                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Bill Number</label>
                        <InputText id="username1" value={viewBill} name="viewBill" aria-describedby="username1-help" onChange={(e) => setViewBill(e.target.value)} onKeyPress={(e) => enterKey(e)} className="p-d-block InputPrimeBox" />
                    </div>
                    <div className="p-grid" style={{ width: '102%'}}>
                        <div className="p-col-4"></div>
                        <div className="p-col-4">
                            {/* <Link  className="Link"> */}
                                <Button type="submit" className="inputData buttonSecondary reportButton" variant="contained"  onClick={() => setDisplayBasic2(!displayBasic2)}>
                                    <div className="buttonText"> <span className="buttonTextFirstLetter"> <i className="pi pi-times-circle"></i> C</span>lose</div>
                                </Button>
                            {/* </Link> */}
                        </div>
                        <div className="p-col-4">
                            <Link  to={{
                                    pathname: "/sales-bill",
                                    state: {
                                        page: 'redirect',
                                        billno: viewBill,
                                    }
                                }}
                                className="Link">
                                <Button type="submit" className="inputData buttonSecondary reportButton" variant="contained">
                                    <div className="buttonText"> <span className="buttonTextFirstLetter"> <i className="pi pi-eye"></i> V</span>iew</div>
                                </Button>
                            </Link>
                        </div>
                    </div>
            </Dialog>
        </>
    );
}
