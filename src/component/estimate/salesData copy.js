import React, { useEffect } from "react";
import {  Input   } from '@material-ui/core';

import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import TableHead from '@material-ui/core/TableHead';

import Button from '@material-ui/core/Button';
import {   Link   } from "react-router-dom";

import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteForeverOutlinedIcon from '@material-ui/icons/DeleteForeverOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import NumberFormat from 'react-number-format';

//json
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//service 
import SalesService from '../../service/sales/salesService'

//object of services
const salesService = new SalesService();

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};


export default function CustomPaginationActionsTable() {
  const initialValue = [{ branch: 'No data found'}];

  const [salesData, setsalesData] = React.useState(initialValue);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, salesData.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [open, setOpen] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);

  const [username, setUsername] = React.useState('');

  

  // ****** BEGINNING OF CHANGE ******
  useEffect(() => {
    getItem();
  }, []);

  const handleClickOpen = (username) => {
    console.log(username.username)
    setOpen(true);
    setUsername(username.username);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const handleClickUpdateOpen = (username) => {
  //   console.log(username.username)
  //   setOpenUpdate(true);
  // };

  const handleUpdateClose = () => {
    setOpenUpdate(false);
  };

  const handleDelete = () => {

    let data = {login_user : localStorage.getItem("username") , username : username}

    salesService.deleteSales(data).then((response) =>{
        if(response['data']['status'] ===1)
        {
          setOpen(false);
          getItem()
          toast.success(response['data']['message']);
        } else if(response['data']['status'] ===0)
        {
          toast.error(response['data']['message']);
        } 
    }).catch((error) => {
        console.log(error)
    })

  };

  const getItem = () => {

    let data = {login_user : localStorage.getItem("username")}

    salesService.getSales(data).then((response) =>{
      console.log(response)
        if(response['data']['status'] ===1)
        {
          setsalesData(response['data']['data']);
        } 
    }).catch((error) => {
        console.log(error)
    })

  };

  const handleClickSearch = (event) => {
    let data = {login_user : localStorage.getItem("username"), search_key:event.target.value}

    salesService.getSales(data).then((response) =>{
      console.log(response)
        if(response['data']['status'] ===1)
        {
          setsalesData(response['data']['data']);
        }
    }).catch((error) => {
        console.log(error)
    })
  };

  return (
      <div>
        <ToastContainer />
          
          <div className="branchBox"> 
                <div className="branchLeft">
                    <h3 className="pageTitle">Sales Summary</h3>
                </div>
                <div className="searchBox">
                  <Input className="searchInput" placeholder="Search Sales" name="search" onKeyUp={handleClickSearch}></Input>
                </div>
                <div className="branchRight">
                    <Link to="/sales-bill" className="Link">
                        <Button type="submit" className="inputData buttonPrimary" variant="contained">
                            <div className="buttonText"> + <span className="buttonTextFirstLetter">N</span>ew Bill</div>
                        </Button>
                    </Link>
                </div>
            </div>
        
    <TableContainer component={Paper}>
      <Table aria-label="custom pagination table">
            <TableHead>
                <TableRow className="tableHead">
                    <TableCell className="tableTd" align="left"> <b>Invoice Code</b> </TableCell>
                    <TableCell className="tableTd" align="left"> <b>Branch</b> </TableCell>
                    <TableCell className="tableTd" align="left"> <b>Name</b> </TableCell>
                    <TableCell className="tableTd" align="left"> <b>Address</b> </TableCell>
                    <TableCell className="tableTd" align="left"> <b>Total Price</b> </TableCell>
                    <TableCell className="tableTd" align="left"> <b>Sales By</b> </TableCell>
                    <TableCell className="tableTd" align="right"> <b>Action</b> </TableCell>
                    <TableCell className="tableTd" align="left"> </TableCell>
                </TableRow>
            </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? salesData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : salesData
          ).map((row) => (
            <TableRow key={row.branch}>
              <TableCell className="tableTd" component="th" scope="row">
                {row.sales_code}
              </TableCell>
              <TableCell className="tableTd" component="th" scope="row">
                {row.branch}
              </TableCell>
              <TableCell className="tableTd" component="th" scope="row">
                {row.cname}
              </TableCell>
              <TableCell className="tableTd" component="th" scope="row">
                {row.add1}
              </TableCell>
              <TableCell className="tableTd" component="th" scope="row">
                <NumberFormat value={row.total_price} displayType={'text'} thousandSeparator={true} prefix={'₹ '} />
              </TableCell>
              <TableCell className="tableTd" component="th" scope="row">
                {row.created_by}
              </TableCell>
              <TableCell align="right">
                <Link 
                to={{pathname:"/sales-view",
                state:{ 
                  sales_code: row.sales_code,
                  user: row.cname, 
                  data: row.item,
                  total:row.total_price,
                  id:row.cid ,
                  created_on: row.created_on,
                  email : row.email,
                  mobile : row.mobile
                }}} 
                
                className="linkPrimary"> <VisibilityOutlinedIcon /></Link>
              </TableCell>
              <TableCell align="center">
                <Link onClick={() =>
                  {
                      var username = row.user_name
                      handleClickOpen({username})
                  }}  className="linkSecondary"> <DeleteForeverOutlinedIcon  /></Link>
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    <div className="paginationBox">
      <TablePagination  className="paginationInput"
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={3}
                  count={salesData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                      inputProps: { 'aria-label': 'rows per page' },
                      native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                  />
    </div>
    {/* Delete User  */}
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
            <Button variant="contained" onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button variant="contained" onClick={handleDelete} color="secondary">
                Delete 
            </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User  */}
    <Dialog
        open={openUpdate}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleUpdateClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title"> <EditOutlinedIcon style={{color: 'blue', fontSize: '30px' , position:'absolute'}} /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Update Item</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
                We are currently working on this module!!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button variant="contained" onClick={handleUpdateClose} color="secondary">
                Cancel
            </Button>
            <Button variant="contained" onClick={handleUpdateClose} color="primary">
                Update 
            </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}