import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { InputText } from 'primereact/inputtext';
// import { CustomerService } from '../service/CustomerService';
import { Link } from "react-router-dom";
import jsPDF from 'jspdf';

import '../../../assets/css/style.css';

//pages
import Menu from '../../common/menu'
import Footer from '../../common/footer'

import 'primeflex/primeflex.css';
import { Toast } from 'primereact/toast';

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
import UserService from '../../../service/user/userService'
const userService = new UserService();

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function DataTableFilterDemo(props) {

    const toast = useRef(null);

    const [stock, setStock] = useState(null);
    const [selectedRepresentative, setSelectedRepresentative] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);

    const [user, setUser] = React.useState('');
    const [open, setOpen] = React.useState(false);

    const dt = useRef(null);

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
            username: user,
        }

        userService.deleteUser(data).then((response) => {
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

        let data = {
            login_user: localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
        }

        userService.getTotalBranchUser(data).then((response) => {
            if (response['data']['status'] === 1) {
                setStock(response['data']['data']);
            }
        }).catch((error) => {
            console.log(error)
            this.toast.show({ severity: 'error', summary: 'Message', detail: 'Check Connection', life: 3000 });
        })

    };

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
                setUser(rowData.user_name)
                setOpen(true);
            }} className="linkSecondary"> <DeleteForeverOutlinedIcon /></Link>
        </span>;
    }


    const header = (
        <div className="table-header">
            <div className="p-grid">
                <div className="p-col-8">
                    User List
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

    var count = 1;
    if (stock)
        stock.map((data) => {
            data['sr_no'] = count;
            count++
        })
    return (
        <div className="body">
            <Toast ref={toast} />
            <Menu loggedIn = { props.loggedIn } />
            <div className="continerMediumBox">

                <div className="datatable-filter-demo">
                    <div className="card" style={{ width: '100%', padding: '10px 0px' }}>

                        <div className="p-grid">
                            <div className="p-col-9">
                                <Button type="button" icon="pi pi-file-o" onClick={() => exportCSV(false)} className="p-mr-2" data-pr-tooltip="Export CSV" tooltipOptions={{ position: 'bottom' }} />
                                <Button type="button" icon="pi pi-file-excel" onClick={exportExcel} className="p-button-success p-mr-2" data-pr-tooltip="Export XLS" tooltipOptions={{ position: 'bottom' }} />
                                <Button type="button" icon="pi pi-file-pdf" onClick={exportPdf} className="p-button-warning p-mr-2" data-pr-tooltip="Export PDF" tooltipOptions={{ position: 'bottom' }} />
                            </div>
                            <div className="p-col-3">
                                <Link to="/branch-user-master" className="Link" >
                                    <Button label="New User" icon="pi pi-plus-circle" />
                                </Link>
                            </div>
                        </div>

                        <Tooltip target=".export-buttons>button" position="bottom" />
                        <div style={{ height: '400px' }}>
                            <DataTable ref={dt} value={stock} paginator rows={4}
                                header={header} className="p-datatable-customers"
                                globalFilter={globalFilter} emptyMessage="No Search Result.">
                                <Column field="sr_no" header="Sr No" />
                                <Column field="user_name" header="User name" />
                                <Column field="user_level" header="User Level" />
                                <Column header="Status" body={statusBodyTemplate}></Column>
                            </DataTable>
                        </div>
                    </div>
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
            <Footer />
        </div>
    );
}
