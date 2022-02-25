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

import Menu from '../common/menu'
import Footer from '../common/footer'

import 'primeflex/primeflex.css';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

import { Calendar } from 'primereact/calendar';

import moment from "moment";

//service 
import StockService from '../../service/stock/stockService'
import ItemService from '../../service/item/itemService'
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
//service 
import SalesService from '../../service/sales/salesService'
import { isEnterKey, useThemeProps } from '@material-ui/data-grid';
//service 
import SchemaService from '../../service/schema/schemaService'
import CustomerService from '../../service/customer/customerService'

//object of services
const schemaService = new SchemaService();
const customerService = new CustomerService();
//object of services
const salesService = new SalesService();
//object of services
const itemService = new ItemService();
const stockService = new StockService();


export default function DataTableFilterDemo(props) {
    console.log(props)
    const toast = useRef(null);

    const [displayBasic, setDisplayBasic] = useState(false);

    const [viewBill, setViewBill] = useState(null);

    const [stock, setStock] = useState(null);
    const [selectedRepresentative, setSelectedRepresentative] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);

    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
    });

    const [date1, setValue1] = useState(null);
    const [date2, setValue2] = useState(null);
    const dt = useRef(null);

    const [selectedItemNo, setSelectedItemNo] = useState(null);
    const [selectedItemList, setSelectedItemList] = useState(null);

    const clickRow = (rowData) => {
        // console.log(rowData)
        // alert(rowData.billno)
        setSelectedItemNo(rowData.billno)
        setSelectedItemList(rowData)
    }

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
        if(stock)
        {
            import('xlsx').then(xlsx => {
                const worksheet = xlsx.utils.json_to_sheet(stock);
                const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
                const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
                saveAsExcelFile(excelBuffer, 'stock');
            });
        } else {
            toast.current.show({severity:'error', summary: 'Message', detail:'Select dates!', life: 3000});
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

        // stockService.getStock(data).then((response) =>{
        //     console.log(response)
        //     if(response['data']['status'] ===1)
        //     {
        //       setStock(response['data']['data']);
        //     }  else {
        //         setStock( [{ branch: 'No data Found'}]);
        //   }
        // }).catch((error) => {
        //     console.log(error)
        // })
        // salesService.getSales(data).then((response) => {
        //     console.log(response)
        //     if (response['data']['status'] === 1) {
        //         setStock(response['data']['data']);
        //     }
        // }).catch((error) => {
        //     console.log(error)
        // })

    };
    const rowClass = (data) => {
        return {
            'row-accessories': data.cashier === 'Total'
        }
    }

    const getDateItem = () => {
        // setValue1(moment().format("YYYY/MM/DD"))
        // setValue2(moment().format("YYYY/MM/DD"))

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            from: moment(date1).format("YYYY-MM-DD")?moment(date1).format("YYYY-MM-DD"):moment().format("YYYY-MM-DD"),
            to: moment(date2).format("YYYY-MM-DD")?moment(date2).format("YYYY-MM-DD"):moment().format("YYYY-MM-DD"),
            type: 'order-reports',
        }

        schemaService.getSchemaReports(data).then((response) => {
            console.log(response)
            if (response['data']['status'] === 1) {
                setStock(response['data']['data']);
                toast.current.show({severity:'success', summary: 'Message', detail:'Generated data!', life: 3000});
            } else {
                setStock(null);
                toast.current.show({severity:'error', summary: 'Message', detail:'No result found!', life: 3000});
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


    if (stock)
        stock.map((data) => {
            data['sr_no'] = count;
            count++
        })

    const lebelStyle = { fontSize: '12px', color: 'black' };

    const dialogFuncMap = {
        'displayBasic': setDisplayBasic
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }

    const onClick = (name) => {
        dialogFuncMap[`${name}`](true);
    }

    const enterKey = (event) =>{
        console.log(event.charCode)

    }

    return (
        <>
            <Menu loggedIn = { props.loggedIn } />
            <div className="continerPonitBox">
                <Toast ref={toast} />
                <div className="datatable-filter-demo">
                    <div className="card" style={{ width: '100%', padding: '10px 10px' }}>
                        <h3 style={{ margin: '0px 0px 15px' }}>Orders Report</h3>
                        <div className="p-grid-data">
                            <div style={{ padding: '10px 10px'  ,width:'100px', textAlign: "left" }}>
                                <div className="p-field">
                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Date From </label>
                                </div>
                            </div>
                            <div className="column-input" style={{ width: '170px' }}>
                                <div className="p-field">
                                    <Calendar id="icon" value={date1} onChange={(e) => setValue1(e.value)} showIcon />
                                    {/* <InputText type="date" id="username1" name="date1" aria-describedby="username1-help" onChange={(e) => setValue1(e.target.value)} className="p-d-block InputPrimeBox" value={date1}/> */}
                                </div>
                            </div>
                            <div style={{ padding: '10px 16px', textAlign: "right" }}>
                                <div className="p-field">
                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>To </label>
                                </div>
                            </div>
                            <div className="column-input" style={{ width: '170px' }}>
                                <div className="p-field">
                                    <Calendar id="icon" value={date2} minDate={date1} onChange={(e) => setValue2(e.value)} showIcon />
                                    {/* <InputText type="date" id="username1" min={date1} name="date2" aria-describedby="username1-help" onChange={(e) => setValue2(e.target.value)} className="p-d-block InputPrimeBox"  value={date2}/> */}
                                </div>
                            </div>
                            <div className="p-col-2 column-input" >
                                <div className="p-field">
                                    <Button className="inputData buttonSecondary" variant="contained" onClick={getDateItem}>
                                        <div className="buttonText"> <i className="pi pi-list"></i> <span className="buttonTextFirstLetter">G</span>enerate</div>
                                    </Button>
                                </div>
                            </div>
                            <div className="p-col-3">

                            </div>
                            <div className="p-col-2 column-input" style={{marginLeft:'74px'}}>
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
                            <div style={{ width: '3000px', marginTop: '-5px' }}>
                                <DataTable ref={dt} value={stock}  rowClassName={rowClass} selectionMode="single"
                                    className="p-datatable-striped" onSelectionChange={e => clickRow(e.value)} 
                                    globalFilter={globalFilter} emptyMessage="No Search Result.">
                                    <Column field="billno"      style={{ width: '150px' }} header="Bill No" />
                                    <Column field="dat"      style={{ width: '150px' }}   header="Est.Date" />
                                    <Column field="ddate"     style={{ width: '150px',textAlign:'left' }} header="Delivery Date" />
                                    <Column field="cid"      style={{ width: '100px',textAlign:'left' }}   header="Cust Id" />
                                    <Column field="cname"       style={{ width: '150px',textAlign:'left' }} header="Name" />
                                    <Column field="mobile"     style={{ width: '150px',textAlign:'left' }} header="Mobile" />
                                    <Column field="otype"     style={{ width: '200px',textAlign:'left' }} header="Order Type" />
                                    <Column field="particulars"   style={{ width: '200px' ,textAlign:'left' }} header="Particulars" />
                                    <Column field="tot"   style={{ width: '200px' ,textAlign:'left' }} header="Total" />
                                    <Column field="others"   style={{ width: '200px' ,textAlign:'left' }} header="Others" />
                                    <Column field="discount"   style={{ width: '200px' ,textAlign:'left' }} header="Discount" />
                                    <Column field="paid"   style={{ width: '200px' ,textAlign:'left' }} header="Paid" />
                                    <Column field="net"   style={{ width: '200px' ,textAlign:'left' }} header="Net Amount" />
                                    <Column field="pby"   style={{ width: '200px' ,textAlign:'left' }} header="Pay Mode" />
                                    <Column field="remarks"          header="Remarks" />
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-grid" style={{ padding: '10px 15px' }}>
                    <div className="p-col-7 submitFormButton"></div>
                    <div className="p-col-1 submitFormButton">
                        
                    </div>
                    <div className="p-col-1 submitFormButton">
                        
                    </div>
                    <div className="p-col-1 submitFormButton">
                        <Button className="inputData buttonSecondary reportButton" onClick={exportExcel} variant="contained" >
                            <div className="buttonText"> <i className="pi pi-file-excel"></i> <span className="buttonTextFirstLetter">E</span>xcel</div>
                        </Button>
                    </div>
                    <div className="p-col-1 submitFormButton">
                        {/* <Link to="/sales-report" className="Link"> */}
                            <Button className="inputData buttonSecondary reportButton" onClick={clearForm} variant="contained">
                                <div className="buttonText"> <i className="pi pi-refresh"></i> <span className="buttonTextFirstLetter">C</span>lear</div>
                            </Button>
                        {/* </Link> */}
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

            <Dialog header="Header" visible={displayBasic} style={{ width: '30vw' }}  onHide={() => onHide('displayBasic')}>
                    <div className="p-field">
                        <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Bill Number</label>
                        <InputText id="username1" value={viewBill} name="viewBill" aria-describedby="username1-help" onChange={(e) => setViewBill(e.target.value)} onKeyPress={(e) => enterKey(e)} className="p-d-block InputPrimeBox" />
                    </div>
                    <div className="p-grid" style={{ width: '102%'}}>
                        <div className="p-col-4"></div>
                        <div className="p-col-4">
                            <Link to="/sales-report" className="Link" onHide={() => onHide('displayBasic')}>
                                <Button type="submit" className="inputData buttonSecondary reportButton" variant="contained">
                                    <div className="buttonText"> <span className="buttonTextFirstLetter"> <i className="pi pi-times-circle"></i> C</span>lose</div>
                                </Button>
                            </Link>
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

            <Footer />
        </>
    );
}
