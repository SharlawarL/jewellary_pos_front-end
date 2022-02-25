import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { InputText } from 'primereact/inputtext';
// import { CustomerService } from '../service/CustomerService';
import {   Link   } from "react-router-dom";

import jsPDF from 'jspdf';

import '../../assets/css/style.css';

import 'primeflex/primeflex.css';

//service 
import StockService from '../../service/stock/stockService'
import ItemService from '../../service/item/itemService'
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
//service 
import SalesService from '../../service/sales/salesService'
import PurchaseService from '../../service/purchase/purchaseService'

//object of services
const salesService = new SalesService();
//object of services
const itemService = new ItemService();
const purchaseService = new PurchaseService();


export default function DataTableFilterDemo(){
    const [stock, setStock] = useState(null);
    const [selectedRepresentative, setSelectedRepresentative] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
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
      import('xlsx').then(xlsx => {
          const worksheet = xlsx.utils.json_to_sheet(stock);
          const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
          const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          saveAsExcelFile(excelBuffer, 'stock');
      });
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
                <img alt={option.name} src={`showcase/demo/images/avatar/${option.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} width={32} style={{verticalAlign: 'middle'}} />
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

        let data = {login_user : localStorage.getItem("username")}
    
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
        purchaseService.getPurchaseReturn(data).then((response) =>{
          console.log(response)
            if(response['data']['status'] ===1)
            {
              setStock(response['data']['data']);
            } 
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    
      };


    const header = (
        <div className="table-header">
            <div className="p-grid">
                <div className="p-col-10">
                    Purchase Return Report
                </div>
                <div className="p-col-2">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search" />
                    </span>
                </div>
            </div>
            
            
        </div>
    );

    const statusBodyTemplate = (rowData) => {
      return <span >
        <Link 
                to={{pathname:"/sales-view",
                state:{
                  user: rowData.cname,
                  billno: rowData.billno,
                  created_on: rowData.dat,
                }}} 
                
                className="linkPrimary"> <VisibilityOutlinedIcon /></Link>
      </span>;
    }

    var count  = 1;
    if(stock)
      stock.map((data) =>{
        data['sr_no'] = count;
        count++ 
      })
    return (
        <div className="datatable-filter-demo">
            <div className="card" style={{width:'100%',padding:'10px 0px'}}>
              
            <Button type="button" icon="pi pi-file-o" onClick={() => exportCSV(false)} className="p-mr-2" data-pr-tooltip="Export CSV" tooltipOptions={{position: 'bottom'}}/>
            <Button type="button" icon="pi pi-file-excel" onClick={exportExcel} className="p-button-success p-mr-2" data-pr-tooltip="Export XLS" tooltipOptions={{position: 'bottom'}}/>
            <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning p-mr-2" data-pr-tooltip="Export PDF" tooltipOptions={{position: 'bottom'}}/>
                <Tooltip target=".export-buttons>button" position="bottom" />
                <DataTable ref={dt} value={stock} paginator rows={7}
                    header={header} className="p-datatable-customers"
                    globalFilter={globalFilter} emptyMessage="No Search Result.">
                    <Column field="sr_no" header="Sr. No" style={{width:'100px'}} />
                    <Column field="billno" header="Bill Number"  />
                    <Column field="cname" header="Customer name" />
                    <Column field="sub" header="Sub Total"  />
                    <Column field="grant" header="Grant Total"  />
                    <Column field="disp" header="dis %"  />
                    <Column field="disamt" header="dis Amount"  />
                    <Column field="taxp" header="GST %"  />
                    <Column field="taxamt" header="GST Amount"  />
                    <Column field="dat" header="Bill date" />
                    <Column field="ddate:" header="Due Date"  />
                    <Column field="company" header="Branch"  />
                    <Column field="user" header="User"  />
                    {/* <Column header="Status" body={statusBodyTemplate}></Column> */}
                    {/* <Column field="activity" header="Activity"  filterPlaceholder="Minimum" filterMatchMode="gte" /> */}
                </DataTable>
            </div>
        </div>
    );
}
      