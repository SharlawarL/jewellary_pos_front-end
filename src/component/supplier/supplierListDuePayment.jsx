import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { InputText } from 'primereact/inputtext';
import { Link } from "react-router-dom";
import '../../assets/css/style.css';

import { Calendar } from 'primereact/calendar';

import Menu from '../common/menu'
import Footer from '../common/footer'

import 'primeflex/primeflex.css';
import { Toast } from 'primereact/toast';

import moment from "moment";

//service
import SupplierService from '../../service/supplier/supplierService'
const supplierService = new SupplierService();

export default function DataTableFilterDemo(props) {
    console.log(props)
    const toast = useRef(null);

    const [stock, setStock] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);

    const [date1, setValue1] = useState(null);
    const [date2, setValue2] = useState(null);
    const dt = useRef(null);

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


    
    // ****** BEGINNING OF CHANGE ******
    useEffect(() => {
        // getItem();
    }, []);

    const getDateItem = () => {

        let data = {
            login_user : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            from: moment(date1).format("YYYY-MM-DD")?moment(date1).format("YYYY-MM-DD"):moment().format("YYYY-MM-DD"),
            to: moment(date2).format("YYYY-MM-DD")?moment(date2).format("YYYY-MM-DD"):moment().format("YYYY-MM-DD"),
            type :'supplier-payment-report'
        }

        supplierService.getSupplier(data).then((response) =>{
            console.log(response)
            if (response['data']['status'] === 1) {
                
                var paid      = 0
                var tot      = 0
                var totPaid      = 0

                response['data']['data'].map((data)=>{
                    data['net']  = (parseFloat(data['net'])).toFixed(2)
                    paid       = parseFloat(paid)     + parseFloat(data['net'])
                    return data;
                })

                let blank = { sno : '.',
                                purity: ''}

                let tdata = { sno:'Total',
                                net : (parseFloat(paid)).toFixed(2),
                                tot : (parseFloat(tot)).toFixed(2),
                                'tot-paid' : (parseFloat(totPaid)).toFixed(2),
                            }

                response['data']['data'].push(blank)
                response['data']['data'].push(tdata)

                setStock(response['data']['data']);

                toast.current.show({severity:'success', summary: 'Message', detail:'Generated data!', life: 3000});
            } else {
                toast.current.show({severity:'error', summary: 'Message', detail:'No result found!', life: 3000});
            }
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }

    const rowClass = (data) => {
        return {
            'row-accessories': data.sno === 'Total'
        }
    }

    const statusBodyTemplate = (rowData) => {
        return <span >
            {rowData.bdate} {rowData.tim}
        </span>;
    }

    const clearForm = () => {
        setValue1('')
        setValue2('')
        // setStock(null)
        setGlobalFilter('')
    }


    // setTempData(templ)

    const lebelStyle = { fontSize: '12px', color: 'black' };


    return (
        <>
            <Menu loggedIn = { props.loggedIn } />
            <div className="continerPonitBox">
                <Toast ref={toast} />
                <div className="datatable-filter-demo">
                    <div className="card" style={{ width: '100%', padding: '10px 10px' }}>
                        <h3 style={{ margin: '0px 0px 15px' }}>Supplier Payment Wise Report</h3>
                        <div className="p-grid-data">
                            <div style={{ padding: '10px 10px', width:'100px', textAlign: "left" }}>
                                <div className="p-field">
                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Date From </label>
                                </div>
                            </div>
                            <div className="column-input" style={{ width: '170px' }}>
                                <div className="p-field">
                                    <Calendar id="icon" value={date1} onChange={(e) => setValue1(e.value)} showIcon />
                                    
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
                                     
                                </div>
                            </div>
                            <div className="p-col-2 column-input">
                                <div className="p-field">
                                    <Button className="inputData buttonSecondary" variant="contained" onClick={getDateItem}>
                                        <div className="buttonText"> <i className="pi pi-list"></i> <span className="buttonTextFirstLetter">G</span>enerate</div>
                                    </Button>
                                </div>
                            </div>
                            <div className="p-col-3">

                            </div>
                            <div className="p-col-2 column-input" style={{marginLeft:'84px'}}>
                                <span className="p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search" value={globalFilter} />
                                </span>
                                {/* <Button type="button" icon="pi pi-file-o" onClick={() => exportCSV(false)} className="p-mr-2" data-pr-tooltip="Export CSV" tooltipOptions={{ position: 'bottom' }} />
                                    <Button type="button" icon="pi pi-file-excel" onClick={exportExcel} className="p-button-success p-mr-2" data-pr-tooltip="Export XLS" tooltipOptions={{ position: 'bottom' }} />
                                    <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning p-mr-2" data-pr-tooltip="Export PDF" tooltipOptions={{ position: 'bottom' }} /> */}
                            </div>
                        </div>
                        <Tooltip target=".export-buttons>button" position="bottom" />
                        <div style={{ height: '50vh', border: '1px solid #227bce', marginTop:'10px', overflowX: 'scroll' }}>
                            <div style={{ width: '2000px', marginTop: '-5px' }}>
                                <DataTable ref={dt} value={stock} className="p-datatable-striped" globalFilter={globalFilter} emptyMessage="No Search Result." rowClassName={rowClass}>
                                    <Column field="sno"  header="Reference No" />
                                    <Column field="bdate"  header="Date" />
                                    <Column field="tim"  header="Time" />
                                    <Column style={{textAlign:'left',width:'200px'}} field="cname"  header="Name" />
                                    <Column style={{textAlign:'right'}} field="net"  header="Paid Amount" />
                                    <Column style={{textAlign:'left'}} field="pby"  header="Pay Mode" />
                                    <Column style={{textAlign:'left'}} field="remarks"  header="Remarks" />
                                    <Column style={{textAlign:'left'}} field="user"  header="Entered by User" />
                                    <Column style={{textAlign:'left'}} body={statusBodyTemplate}  header="Entered Date & Time" />

                                </DataTable>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-grid" style={{ padding: '10px 15px' }}>
                    <div className="p-col-7 submitFormButton"></div>
                    <div className="p-col-1 submitFormButton">
                        {/* <Button className="inputData buttonSecondary" variant="contained" style={{ width: '90%', textAlign: 'center' }}>
                            <div className="buttonText"> <i className="pi pi-eye"></i> <span className="buttonTextFirstLetter">V</span>iew</div>
                        </Button> */}
                    </div>
                    <div className="p-col-1 submitFormButton">
                        {/* <Link  to={{
                                pathname: "/sales-view",
                                state: {
                                    data: stock,
                                    from: moment(date1).format("DD/MM/YYYY"),
                                    to: moment(date2).format("DD/MM/YYYY"),
                                }
                            }}
                            className="Link">
                            <Button className="inputData buttonSecondary reportButton" variant="contained">
                                <div className="buttonText"> <i className="pi pi-print"></i> <span className="buttonTextFirstLetter">P</span>rint</div>
                            </Button>
                        </Link> */}
                    </div>
                    <div className="p-col-1 submitFormButton">
                        <Button className="inputData buttonSecondary reportButton" onClick={exportExcel} variant="contained">
                            <div className="buttonText"> <i className="pi pi-file-excel"></i> <span className="buttonTextFirstLetter">E</span>xcel</div>
                        </Button>
                    </div>
                    <div className="p-col-1 submitFormButton">
                        <Button className="inputData buttonSecondary reportButton" onClick={clearForm} variant="contained">
                            <div className="buttonText"> <i className="pi pi-refresh"></i> <span className="buttonTextFirstLetter">C</span>lear</div>
                        </Button>
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
        </>
    );
}
