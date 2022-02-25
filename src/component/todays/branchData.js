import React, { useState, useEffect, useRef } from 'react';

//libraries
import {   Link   } from "react-router-dom";
import { Loading  } from "react-loading-ui";

//prime react
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import 'primeflex/primeflex.css';

//internal css
import '../../assets/css/style.css';

//dialog box
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';


import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

//service 
import CompanyService from '../../service/company/companyService'
const companyService = new CompanyService();

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function DataTableFilterDemo(){
    const toast = useRef(null);

    const [stock, setStock] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);


    const [branch, setUsername] = React.useState('');
    const [item_type, setItemType] = React.useState('');
    const [purity, setPurity] = React.useState('');
    const [open, setOpen] = React.useState(false);

    // ****** BEGINNING OF CHANGE ******
    useEffect(() => {
        getItem();
    }, []);

    const handleClickOpen = (branch) => {
      setOpen(true);
      setUsername(branch.branch);
      
    };
  
    const handleClose = () => {
      setOpen(false);
    };


    const handleDelete = () => {
      let data = {
        username : localStorage.getItem("username"), 
        branch : branch,
        item_type : item_type,
        purity: purity
      }
      companyService.deleteTodaysValue(data).then((response) =>{
            if(response['data']['status'] ===1)
            {
              toast.current.show({severity:'warn', summary: 'Deleted', detail: response['data']['message'], life: 3000});
              setOpen(false);
              getItem();
            } else {
              toast.current.show({severity:'error', summary: 'Error', detail: response['data']['message'], life: 3000});
            }
      }).catch((error) => {
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })
    };

    const getItem = () => {

        let data = {
          username : localStorage.getItem("username"),
          branch: localStorage.getItem("Branch")
        }

        Loading();

        companyService.getTodaysValue(data).then((response) =>{
          Loading();
              if(response['data']['status'] ===1)
              {
                toast.current.show({severity:'info', summary: 'Success', detail: response['data']['message'], life: 3000});
                setStock(response['data']['data']);
              } 
          }).catch((error) => {
            Loading();
              // console.log(error)
          })
      
    
      };


    const header = (
        <div className="table-header">
            <div className="p-grid">
                <div className="p-col-8">
                  Todays List
                </div>
                <div className="p-col-4">
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
                to={{pathname:"/update-web-setting",
                state:{
                  branch: rowData.branch,
                  item_type: rowData.item_type,
                  purity: rowData.purity,
                  price: rowData.price,
                }}} 
                
                className="linkPrimary"> <EditOutlinedIcon   /></Link>
          <Link onClick={() =>
                  {
                      var branch = rowData.branch
                      setItemType(rowData.item_type)
                      setPurity(rowData.purity)
                      handleClickOpen({branch})
                  }}  className="linkSecondary"> <DeleteForeverOutlinedIcon   /></Link>
      </span>;
    }

    var count  = 1;
    if(stock)
      stock.map((data) =>{
        data['sr_no'] = count;
        count++ 
        return data;
      })
    return (
        <div className="datatable-filter-demo">
            <Toast ref={toast} />
            <div className="card" style={{width:'100%',padding:'10px 0px'}}>
            <div className="p-grid">
                  <div className="p-col-9">
                    {/* <Button type="button" icon="pi pi-file-o" onClick={() => exportCSV(false)} className="p-mr-2" data-pr-tooltip="Export CSV" tooltipOptions={{position: 'bottom'}}/>
                    <Button type="button" icon="pi pi-file-excel" onClick={exportExcel} className="p-button-success p-mr-2" data-pr-tooltip="Export XLS" tooltipOptions={{position: 'bottom'}}/>
                    <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning p-mr-2" data-pr-tooltip="Export PDF" tooltipOptions={{position: 'bottom'}}/> */}
                  </div>
                  <div className="p-col-3">
                      <Link to="/add-web-setting" className="Link" >
                              <Button label="New Value" icon="pi pi-plus-circle"/>
                        </Link>
                  </div>
              </div>
            
                <Tooltip target=".export-buttons>button" position="bottom" />
                <div style={{height:'400px'}}>
                <DataTable ref={dt} value={stock} paginator rows={4}
                    header={header} className="p-datatable-customers"
                    globalFilter={globalFilter} emptyMessage="No Search Result.">
                    <Column field="sr_no" header="Sr No"  style={{width:'80px'}}/>
                    <Column field="item_type" header="Item Type" />
                    <Column field="purity" header="Purity" />
                    <Column field="price" header="Price" />
                    <Column field="branch" header="Branch" />
                    <Column header="Status" body={statusBodyTemplate}></Column>
                    {/* <Column field="activity" header="Activity"  filterPlaceholder="Minimum" filterMatchMode="gte" /> */}
                </DataTable>
                </div>
            </div>
            <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title"> <CancelOutlinedIcon style={{color: 'red', fontSize: '30px' , position:'absolute'}} /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
                Dou you really want to delete this branch?
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
        </div>
    );
}
      