

import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { InputText } from 'primereact/inputtext';
// import { CustomerService } from '../service/CustomerService';
import { Link } from "react-router-dom";
import '../../assets/css/style.css';


import Menu from '../common/menu'
import Footer from '../common/footer'

import 'primeflex/primeflex.css';
import { Toast } from 'primereact/toast';

import { Dialog } from 'primereact/dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';


//service 
import CustomerService from '../../service/customer/customerService'

const customerService = new CustomerService();

export default function DataTableFilterDemo(props) {
    console.log(props)
    const toast = useRef(null);


    const [stock, setStock] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [displayBasic, setDisplayBasic] = useState(false);

    const [selectedItemNo, setSelectedItemNo] = useState(null);
    const [company, setCompany] = useState(localStorage.getItem("shopName"));
    const [selectedItemList, setSelectedItemList] = useState(null);

    const dt = useRef(null);

    const onHide = (name) => {
        setDisplayBasic(!displayBasic);
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


    // ****** BEGINNING OF CHANGE ******
    useEffect(() => {
        getItem();
    }, []);

    const getItem = () => {

        let data = {
            login_user : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            type :'agent-list'
        }

        customerService.getCustomer(data).then((response) =>{
            console.log(response)
            if (response['data']['status'] === 1) {
                
                var paid      = 0
                var tot      = 0
                var totPaid      = 0

                response['data']['data'].map((data)=>{
                    data['paid']  = (parseFloat(data['paid'])).toFixed(2)
                    data['tot']  = (parseFloat(data['tot'])).toFixed(2)
                    data['tot-paid']  = (parseFloat(data['tot-paid'])).toFixed(2)
                    paid       = parseFloat(paid)     + parseFloat(data['paid'])
                    tot       = parseFloat(tot)     + parseFloat(data['tot'])
                    totPaid       = parseFloat(totPaid)     + parseFloat(data['tot-paid'])
                })

                let blank = { cname : '.',
                cid: ''}

                let tdata = { acode:'Total',
                                aname : response['data']['data'].length,
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
            'row-accessories': data.acode === 'Total'
        }
    }

    const clickRow = (rowData) => {
        setSelectedItemNo(rowData.ino)
        setSelectedItemList(rowData)
    }

    const handleClose = () => {
        setDisplayBasic(false);
      };
  
  
      const handleDelete = () => {
        let data = {
          login_user : localStorage.getItem("username"), 
          branch : localStorage.getItem("branch"),
          ino : selectedItemNo
        }
        customerService.deleteUpdate(data).then((response) =>{
              if(response['data']['status'] ===1)
              {
                // toast.success(response['data']['message']);
                setDisplayBasic(false);
                getItem();
                setSelectedItemNo(null)
                toast.current.show({severity:'success', summary: 'Deleted', detail:response['data']['message'], life: 3000});
              } else {
                // toast.error(response['data']['message']);
                toast.current.show({severity:'error', summary: 'Message', detail:response['data']['message'], life: 3000});
              }
          }).catch((error) => {
              console.log(error)
          })
      };

    const clearForm = () => {
        // setValue1('')
        // setValue2('')
        // setStock(null)
        setGlobalFilter('')
    }

    return (
        <>
            <Toast ref={toast} />
            <Menu loggedIn = { props.loggedIn } />
            <div className="continerPonitBox">
                <Toast ref={toast} />
                <div className="datatable-filter-demo">
                    <div className="card" style={{ width: '100%', padding: '10px 10px' }}>
                        <h3 style={{ margin: '0px 0px 15px' }}>Client List</h3>
                        <div className="p-grid-data">
                            <div style={{ padding: '10px 10px', width:'100px', textAlign: "left" }}>
                                {/* <div className="p-field">
                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Date From </label>
                                </div> */}
                            </div>
                            <div className="column-input" style={{ width: '170px' }}>
                                {/* <div className="p-field">
                                    <Calendar id="icon" value={date1} onChange={(e) => setValue1(e.value)} showIcon />
                                    
                                </div> */}
                            </div>
                            <div style={{ padding: '10px 10px', textAlign: "right" }}>
                                {/* <div className="p-field">
                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>To </label>
                                </div> */}
                            </div>
                            <div className="column-input" style={{ width: '170px' }}>
                                {/* <div className="p-field">
                                    <Calendar id="icon" value={date2} minDate={date1} onChange={(e) => setValue2(e.value)} showIcon />
                                     
                                </div> */}
                            </div>
                            <div className="p-col-2 column-input">
                                {/* <div className="p-field">
                                    <Button className="inputData buttonSecondary" variant="contained" onClick={getDateItem}>
                                        <div className="buttonText"> <i className="pi pi-list"></i> <span className="buttonTextFirstLetter">G</span>enerate</div>
                                    </Button>
                                </div> */}
                            </div>
                            <div className="p-col-3">

                            </div>
                            <div className="p-col-2 column-input" style={{marginLeft:'84px'}}>
                                <span className="p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search" value={globalFilter}/>
                                </span>
                                {/* <Button type="button" icon="pi pi-file-o" onClick={() => exportCSV(false)} className="p-mr-2" data-pr-tooltip="Export CSV" tooltipOptions={{ position: 'bottom' }} />
                                    <Button type="button" icon="pi pi-file-excel" onClick={exportExcel} className="p-button-success p-mr-2" data-pr-tooltip="Export XLS" tooltipOptions={{ position: 'bottom' }} />
                                    <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning p-mr-2" data-pr-tooltip="Export PDF" tooltipOptions={{ position: 'bottom' }} /> */}
                            </div>
                        </div>
                        <Tooltip target=".export-buttons>button" position="bottom" />
                        <div style={{ height: '50vh', border: '1px solid #227bce', marginTop:'10px', overflowX: 'scroll' }}>
                            <div style={{ width: '1500px', marginTop: '-5px' }}>
                            <DataTable ref={dt} value={stock} className="p-datatable-striped"  selectionMode="single"
                                globalFilter={globalFilter} emptyMessage="No Search Result." rowClassName={rowClass} onSelectionChange={e => clickRow(e.value)}  >
                                    <Column field="acode" style={{width:'100px'}}  header="Client Id" />
                                    <Column field="aname" style={{width:'200px'}}  header="Name" />
                                    <Column field="add1"  header="Address" />
                                    <Column field="city"  header="City /Area" />
                                    <Column field="mobile"  header="Mobile No" />
                                    <Column field="phone"  header="Alt.Contact Nos" />
                                    <Column field="state"  header="State" />
                                    <Column field="per" style={{width:'200px'}}  header="Earnings Percentage %" />
                                    <Column field="remarks"  header="Remarks" />
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-grid" style={{ padding: '10px 15px' }}>
                    <div className="p-col-7 submitFormButton"></div>
                    <div className="p-col-1 submitFormButton">
                        {(selectedItemNo == null)?'': <Button className="inputData buttonSecondary reportButton" onClick={() => setDisplayBasic(!displayBasic)} variant="contained">
                            <div className="buttonText"> <i className="pi pi-trash"></i> <span className="buttonTextFirstLetter">D</span>elete</div>
                        </Button>}
                    </div>
                    <div className="p-col-1 submitFormButton">
                        {(selectedItemNo == null)?'': 
                        <Link 
                        
                        to={{
                            pathname: "/client-update",
                            state: {
                                itemNo: 1,
                            }
                        }}

                        className="Link">
                            <Button className="inputData buttonSecondary reportButton" variant="contained">
                                <div className="buttonText"> <i className="pi pi-eye"></i> <span className="buttonTextFirstLetter">V</span>iew</div>
                            </Button>
                        </Link>}
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
            <Dialog header="Header" visible={displayBasic} style={{ width: '400px' }} onHide={() => onHide('displayBasic')}>
                <DialogTitle id="alert-dialog-slide-title"> <CancelOutlinedIcon style={{color: 'red', fontSize: '30px' , position:'absolute'}} /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Are you sure?</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                        Dou you really want to delete this Item?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <div className="buttonDivSecondary" variant="contained" onClick={handleClose}>
                    Cancel 
                    </div>
                    {/* <div className="buttonDivPrimary" variant="contained" onClick={handleDelete}>
                    Delete 
                    </div> */}
                    <Button variant="contained" onClick={handleDelete} color="primary">
                        Delete 
                    </Button>
                </DialogActions>
            </Dialog>
            <Footer />
        </>
    );
}
