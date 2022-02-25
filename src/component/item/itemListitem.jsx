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

import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

import Menu from '../common/menu'
import Footer from '../common/footer'
import NumberFormat from 'react-number-format';

import 'primeflex/primeflex.css';
import { Toast } from 'primereact/toast';

import moment from "moment";

//service 
import StockService from '../../service/stock/stockService'
import ItemService from '../../service/item/itemService'
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
//service 
import SalesService from '../../service/sales/salesService'
import PurchaseService from '../../service/purchase/purchaseService'
import { useThemeProps } from '@material-ui/data-grid';

import { Dialog } from 'primereact/dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

//object of services
const itemService = new ItemService();
const salesService = new SalesService();
const purchaseService = new PurchaseService();



export default function DataTableFilterDemo(props) {
    console.log(props)
    const toast = useRef(null);

    const temp = { cashier : 'total', Cash: 0, Card: 0, Credit : 0, Others : 0}

    const [stock, setStock] = useState(null);
    const [selectedRepresentative, setSelectedRepresentative] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);

    const [company, setCompany] = useState(localStorage.getItem("shopName"));

    const [cashier, setCashier]     = useState(null);
    const [cash, setCash]           = useState(null);
    const [card, setCard]           = useState(null);

    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 1,
    });

    const [date1, setValue1] = useState(null);
    const [date2, setValue2] = useState(null);

    const [dropList, setDrop] = useState(null);
    const [dropValue, setDropValue] = useState(null);
    const dt = useRef(null);

    const cols = [
        { field: 'cashier', header: 'cashier' },
        { field: 'Cash', header: 'Cash' },
        { field: 'Card', header: 'Card' },
        { field: 'Credit', header: 'Credit' },
        { field: 'Others', header: 'Others' },
        { field: 'Total', header: 'Total' }
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
                doc.text(company, 50, 10);
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

    const [displayBasic, setDisplayBasic] = useState(false);
    const [selectedItemNo, setSelectedItemNo] = useState(null);
    const [selectedItemList, setSelectedItemList] = useState(null);
    const [selectedItemName, setSelectedItemName] = useState(null);
    const [selectedItemCat, setSelectedItemCat] = useState(null);
    const [selectedItemType, setSelectedItemType] = useState(null);
    const [selectedItemMake, setSelectedItemMake] = useState(null);

    const clickRow = (rowData) => {
        // console.log(rowData)
        // alert(rowData.ino)
        setSelectedItemNo(rowData.ino)
        setSelectedItemList(rowData)
    }

    const onHide = (name) => {
        setDisplayBasic(!displayBasic);
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
        itemService.deleteItem(data).then((response) =>{
              if(response['data']['status'] ===1)
              {
                // toast.success(response['data']['message']);
                setDisplayBasic(false);
                getDateItem();
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

    // ****** BEGINNING OF CHANGE ******
    useEffect(() => {
        getItem();
    }, []);

    
    const getItem = () => {
        let data = {
            login_user : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            type :'item-type'
        }

        itemService.getDropItem(data).then((response) =>{
            console.log(response)
            if (response['data']['status'] === 1) {
                response['data']['data'].map((data) =>{
                    return(
                    data['label'] = data['item_type'],
                    data['value'] = data['item_type'])
                    })
                console.log(response['data']['data'])
                setDrop(response['data']['data'])
            } else {
                toast.current.show({severity:'error', summary: 'Message', detail:'No result found!', life: 3000});
            }
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }
    const [checkBox, setCheckBox]     = useState(false);

    const getDateItem = () => {

        let data = {
            login_user : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            type :'item-type',
            checkBox: checkBox,
            drop : dropValue
        }

        itemService.getItem(data).then((response) =>{
            console.log(response)
            if (response['data']['status'] === 1) {
                
                var total_all      = 0

                response['data']['data'].map((data)=>{
                    data['amount']  = (Number(data['amount'])).toFixed(2)
                    total_all       = parseFloat(total_all)     + parseFloat(data['amount'])
                })

                let blank = { ino : '.',
                                amount: ''}

                let tdata = { ino:'Total  Items',iname : response['data']['data'].length}

                response['data']['data'].push(blank)
                response['data']['data'].push(tdata)

                setStock(response['data']['data']);

                toast.current.show({severity:'success', summary: 'Message', detail:'Generated data!', life: 3000});
            } else {
                setStock({});
                toast.current.show({severity:'error', summary: 'Message', detail:'No result found!', life: 3000});
            }
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                {rowData.min_bill} -  {rowData.max_bill}
                {/* <NumberFormat value={(Number(rowData.Total)).toFixed(2)} displayType={'text'} thousandSeparator={true}/> */}
                {/* <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editProduct(rowData)} /> */}
            </React.Fragment>
        );
    }

    const rowClass = (data) => {
        return {
            'row-accessories': data.ino === 'Total  Items'
        }
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
        setGlobalFilter("")
    }

    var count = 1;


    // setTempData(templ)

    const lebelStyle = { fontSize: '12px', color: 'black' };

    const footer = `In total there are products.`;


    return (
        <>
            <Menu loggedIn = { props.loggedIn } />
            <div className="continerPonitBox">
                <Toast ref={toast} />
                <div className="datatable-filter-demo">
                    <div className="card" style={{ width: '100%', padding: '10px 10px' }}>
                        <h3 style={{ margin: '0px 0px 15px' }}>Item Type Wise List</h3>
                        <div className="p-grid-data">
                            <div style={{ padding: '10px 10px', width:'100px', textAlign: "left" }}>
                                <div className="p-field">
                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Item Type </label>
                                </div>
                            </div>
                            <div className="column-input" style={{ width: '170px' }}>
                                <div className="p-field">
                                    <Dropdown style={{width:'100%'}} value={dropValue} options={dropList} onChange={(e) => setDropValue(e.value)} optionLabel="label"/>
                                    {/* <Calendar id="icon" value={date1} onChange={(e) => setValue1(e.value)} showIcon /> */}
                                </div>
                            </div>
                            <div style={{ padding: '10px 20px'}}>
                                <div className="p-field">
                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}><input type="checkbox" id="username1"  style={{verticalAlign:"text-top"}} name="check" value={checkBox} onClick={()=> setCheckBox(!checkBox)}></input>  Select All </label>
                                </div>
                            </div>
                            <div className="column-input">
                                <div className="p-field">
                                    <Button className="inputData buttonSecondary" variant="contained" onClick={getDateItem}>
                                        <div className="buttonText"> <i className="pi pi-list"></i> <span className="buttonTextFirstLetter">G</span>enerate</div>
                                    </Button>
                                </div>
                            </div>
                            
                          
                            <div className="p-col-6 column-input" style={{marginLeft:'84px',textAlign:'right'}}>
                                <span className="p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} value={globalFilter} placeholder="Search" />
                                </span>
                                {/* <Button type="button" icon="pi pi-file-o" onClick={() => exportCSV(false)} className="p-mr-2" data-pr-tooltip="Export CSV" tooltipOptions={{ position: 'bottom' }} />
                                    <Button type="button" icon="pi pi-file-excel" onClick={exportExcel} className="p-button-success p-mr-2" data-pr-tooltip="Export XLS" tooltipOptions={{ position: 'bottom' }} />
                                    <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning p-mr-2" data-pr-tooltip="Export PDF" tooltipOptions={{ position: 'bottom' }} /> */}
                            </div>
                        </div>
                        <Tooltip target=".export-buttons>button" position="bottom" />
                        <div style={{ height: '50vh', border: '1px solid #227bce', marginTop:'10px', overflowX: 'scroll' }}>
                            <div style={{ width: '1900px', marginTop: '-5px' }}>
                                <DataTable ref={dt} value={stock} className="p-datatable-striped" globalFilter={globalFilter} 
                                 emptyMessage="No Search Result." rowClassName={rowClass} selectionMode="single" onSelectionChange={e => clickRow(e.value)} >
                                    <Column field="ino"  header="Item Code" />
                                    <Column style={{width:'250px'}} field="iname"  header="Item Name" />
                                    <Column field="category"  header="Category" />
                                    <Column field="item_type"  header="Item type" />
                                    <Column field="purity"  header="Purity" />
                                    <Column field="making_charge"  header="Making Charges" />
                                    <Column field="wastage"  header="Wastage%" />
                                    <Column field="rack"  header="Rack" />
                                    <Column field="location"  header="Location" />
                                    <Column field="hsn_code"  header="HSN Code" />
                                    <Column style={{width:'200px'}} field="price_type"  header="Price Type" />
                                    <Column style={{width:'200px'}} field="price"  header="Price" />
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
                            pathname: "/item-update",
                            state: {
                                itemNo: selectedItemNo,
                                itemList: selectedItemList,
                                itemName: selectedItemList['iname'],
                                itemCat: selectedItemList['category'],
                                itemType: selectedItemList['item_type'],
                                purity: selectedItemList['purity'],
                                making_charge: selectedItemList['making_charge'],
                                wastage: selectedItemList['wastage'],
                                taxp: selectedItemList['taxp'],
                                location: selectedItemList['location'],
                                hsn_code: selectedItemList['hsn_code'],
                                price_type: selectedItemList['price_type'],
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
                        <Link to="/item-item-type-list" className="Link">
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
