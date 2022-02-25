import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { InputText } from 'primereact/inputtext';
// import { CustomerService } from '../service/CustomerService';

import jsPDF from 'jspdf';

import '../../assets/css/style.css';

import 'primeflex/primeflex.css';

//service 
import StockService from '../../service/stock/stockService'
import ItemService from '../../service/item/itemService'
import SupplierService from '../../service/supplier/supplierService'
//service 
import CustomerService from '../../service/customer/customerService'

//object of services
const customerService = new CustomerService();
//object of services
const itemService = new ItemService();
const stockService = new StockService();
const supplierService = new SupplierService();

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
        customerService.getCustomer(data).then((response) =>{
          console.log(response)
            if(response['data']['status'] === 1)
            {
              setStock(response['data']['data']);
            } 
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    
      };


    const header = (
        <div className="table-header">
            <div className="p-grid">
                <div className="p-col-10">
                    Customer List
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
                <div style={{height:'400px'}}>
                <DataTable ref={dt} value={stock} paginator rows={4}
                    header={header} className="p-datatable-customers"
                    globalFilter={globalFilter} emptyMessage="No Search Result.">
                    <Column field="sr_no" header="Sr no" />
                    <Column field="cname" header="Customer Name" style={{width:'200px'}} />
                    <Column field="mobile" header="Mobile" />
                    <Column field="email" header="Email" />
                    <Column field="city" header="City" />
                    <Column field="add1" header="Address" />
                    <Column field="pincode" header="Pin Code" />
                    <Column field="state_code" header="State Code" />
                    <Column field="state_code" header="State Code" />
                    <Column field="branch" header="Branch" filterMatchMode="contains" />
                    {/* <Column field="activity" header="Activity"  filterPlaceholder="Minimum" filterMatchMode="gte" /> */}
                </DataTable>
                </div>
            </div>
        </div>
    );
}
      