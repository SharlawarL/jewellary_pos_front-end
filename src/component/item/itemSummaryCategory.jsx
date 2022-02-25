import React, { useState, useEffect, useRef } from 'react';

//libraries
import { Link } from "react-router-dom";
import { Toast } from 'primereact/toast';
import { Loading  } from "react-loading-ui";

//internal CSS
import '../../assets/css/style.css';

//internal pages
import Menu from '../common/menu'
import Footer from '../common/footer'

//prime react
import 'primeflex/primeflex.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { InputText } from 'primereact/inputtext';

//service 
import ItemService from '../../service/item/itemService'
const itemService = new ItemService();


export default function DataTableFilterDemo(props) {

    const toast = useRef(null);

    const [stock, setStock] = useState(null);

    const [globalFilter, setGlobalFilter] = useState(null);

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
        getSummary();
    }, []);

    const getSummary = () => {

        Loading();

        let data = {
            login_user : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            type :'item-category-summary',
            checkBox: false,
        }

        itemService.getItem(data).then((response) =>{
            Loading();
            if (response['data']['status'] === 1) {
                
                var total_all      = 0

                response['data']['data'].map((data)=>{
                    data['amount']  = (Number(data['amount'])).toFixed(2)
                    total_all       = parseFloat(total_all)     + parseFloat(data['amount'])
                })

                setStock(response['data']['data']);

                toast.current.show({severity:'success', summary: 'Message', detail:'Generated data!', life: 3000});
            } else {
                toast.current.show({severity:'error', summary: 'Message', detail:'No result found!', life: 3000});
            }
      }).catch((error) => {
            // console.log(error)
            // toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    }

    const rowClass = (data) => {
        return {
            'row-accessories': data.ino === 'Total  Items'
        }
    }


    const clearForm = () => {
        setGlobalFilter("")
    }


    return (
        <>
            <Menu loggedIn = { props.loggedIn } />
            <div className="continerPonitBox">
                <Toast ref={toast} />
                <div className="datatable-filter-demo">
                    <div className="card" style={{ width: '100%', padding: '10px 10px' }}>
                        <h3 style={{ margin: '0px 0px 15px' }}>Category Wise Items Summary</h3>
                        <div className="p-grid-data">
                            <div style={{ padding: '10px 10px', width:'100px', textAlign: "left" }}>
                                {/* <div className="p-field">
                                    <label htmlFor="username1" className="p-d-block" style={lebelStyle}>Purity</label>
                                </div> */}
                            </div>
                            <div className="column-input" style={{ width: '170px' }}>
                                {/* <div className="p-field">
                                    <Dropdown style={{width:'100%'}} value={dropValue} options={dropList} onChange={(e) => setDropValue(e.value)} optionLabel="label"/>
                                    
                                </div> */}
                            </div>
                            <div className="p-col-2 column-input">
                                {/* <div className="p-field">
                                    <Button className="inputData buttonSecondary" variant="contained" onClick={getDateItem}>
                                        <div className="buttonText"> <i className="pi pi-list"></i> <span className="buttonTextFirstLetter">G</span>enerate</div>
                                    </Button>
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
                            
                            <div className="p-col-3">

                            </div>
                            <div className="p-col-2 column-input" style={{marginLeft:'84px'}}>
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
                            <div style={{ width: '100%', marginTop: '-5px' }}>
                                <DataTable ref={dt} value={stock} className="p-datatable-striped" globalFilter={globalFilter} emptyMessage="No Search Result." rowClassName={rowClass}>
                                    <Column field="category"  header="Category" />
                                    <Column field="count"  header="No of Items" />
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
                        <Link to="/category-item-summary" className="Link">
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
        </>
    );
}
