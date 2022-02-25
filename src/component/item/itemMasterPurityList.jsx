import React, { useState, useEffect, useRef } from 'react';

//libraries
import { Link } from "react-router-dom";
import { Loading  } from "react-loading-ui";

//internal pages
import Menu from '../common/menu'
import Footer from '../common/footer'

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

//icons
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

//service 
import ItemService from '../../service/item/itemService'
const itemService = new ItemService();

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function DataTableFilterDemo() {

    const toast = useRef(null);

    const [stock, setStock] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const dt = useRef(null);
    const [purity, setPurity] = React.useState('');
    const [open, setOpen] = React.useState(false);

    // ****** BEGINNING OF CHANGE ******
    useEffect(() => {
        getItem();
    }, []);

    const handleClickOpen = (branch) => {
        setOpen(true);
        // setUsername(branch.branch);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const handleDelete = () => {
        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            purity: purity,
        }

        itemService.deleteItemPurity(data).then((response) => {
            if (response['data']['status'] === 1) {
                toast.current.show({severity:'success', summary: 'Success', detail: response['data']['message'], life: 3000});
                setOpen(false);
                getItem();
            } else {
                toast.current.show({severity:'error', summary: 'Error', detail: response['data']['message'], life: 3000});
            }
        }).catch((error) => {
            toast.current.show({ severity: 'error', summary: 'Message', detail: 'Check Connection', life: 3000 });
        })
    };

    const getItem = () => {

        let data = { login_user: localStorage.getItem("username"), branch: localStorage.getItem("Branch") }

        Loading();

        itemService.getItemPurity(data).then((response) => {
            Loading();
            if (response['data']['status'] === 1) {
                setStock(response['data']['data']);
            }
        }).catch((error) => {
            Loading();
            console.log(error)
        })


    };


    const header = (
        <div className="table-header">
            <div className="p-grid">
                <div className="p-col-8">
                    Purity List
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
            {/* <Link
                to={{
                    pathname: "/update-web-setting",
                    state: {
                        branch: rowData.branch,
                        purity: rowData.purity
                    }
                }}

                className="linkPrimary"> <EditOutlinedIcon /></Link> */}
            <Link onClick={() => {
                setPurity(rowData.purity)
                setOpen(true);
            }} className="linkSecondary"> <DeleteForeverOutlinedIcon /></Link>
        </span>;
    }

    var count = 1;
    if (stock)
        stock.map((data) => {
            data['sr_no'] = count;
            count++
            return data;
        })

    return (
        <div className="body">
            <Menu loggedIn={true} />
            <div className="continerMediumBox">
                <div className="datatable-filter-demo">
                <Toast ref={toast} />
                    <div className="card" style={{ width: '100%', padding: '10px 0px' }}>
                        <div className="p-grid">
                            <div className="p-col-9">
                            </div>
                            <div className="p-col-3">
                                <Link to="/item-purity-master" className="Link" >
                                    <Button label="New" icon="pi pi-plus-circle" />
                                </Link>
                            </div>
                        </div>

                        <Tooltip target=".export-buttons>button" position="bottom" />
                        <div style={{ height: '400px' }}>
                            <DataTable ref={dt} value={stock} paginator rows={4}
                                header={header} className="p-datatable-customers"
                                globalFilter={globalFilter} emptyMessage="No Search Result.">
                                <Column field="purity" header="Purity" style={{width:'80%'}} />
                                <Column header="Status" body={statusBodyTemplate}></Column>
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
                        <DialogTitle id="alert-dialog-slide-title"> <CancelOutlinedIcon style={{ color: 'red', fontSize: '30px', position: 'absolute' }} /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Are you sure?</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                Dou you really want to delete this branch?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <div className="buttonDivSecondary" variant="contained" onClick={handleClose}>
                                Cancel
                            </div>
                            <Button variant="contained" onClick={handleDelete} color="primary">
                                Delete
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
            <Footer />
        </div>
    );
}
