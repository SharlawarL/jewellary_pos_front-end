import React from 'react';
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

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';


//json
import Init from '../../../config/Inint.json'
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationManager} from 'react-notifications';

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

export default function CustomPaginationActionsTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, props.rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    axios.post(apiUrl, 
        {username : localStorage.getItem("username")},
        {
            headers: { Action : 'Company', Module: 'save-branch' ,'Access-Control-Allow-Origin':'*', 'Authorization':'Bearer '+localStorage.getItem('token')},
        }
        )
          .then((response) => {
              if(response['data']['status'] ===1)
              {
                toast.success(response['data']['message']);
                NotificationManager.success('Success message', response['data']['message']);
                this.setState({
                    success: true,
                });
              } else {
                toast.error(response['data']['message']);
                this.setState({
                    loggedIn: false,
                });
              }
            
          }, (error) => {
            toast.warn(error);
            this.setState({
                loggedIn: false,
            });
          });
  };

  return (
      <div>
    <TableContainer component={Paper}>
      <Table aria-label="custom pagination table">
            <TableHead>
                <TableRow className="tableHead"> 
                    <TableCell className="tableTd" align="left"> <b>Branch</b></TableCell>
                    <TableCell className="tableTd" align="left"> <b>User Name</b> </TableCell>
                    <TableCell className="tableTd" align="left"> <b>User Level</b> </TableCell>
                    <TableCell className="tableTd" align="right"> <b>Action</b> </TableCell>
                    <TableCell align="left"> </TableCell>
                </TableRow>
            </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? props.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : props.rows
          ).map((row) => (
            <TableRow key={row.branch}>
              <TableCell className="tableTd" component="th" scope="row">
                {row.branch}
              </TableCell>
              <TableCell className="tableTd" component="th" scope="row">
                {row.user_name}
              </TableCell>
              <TableCell className="tableTd" component="th" scope="row">
                {row.user_level}
              </TableCell>
              <TableCell  style={{ width: 160 }} align="right">
                <Link to={{pathname:"/updatebranch"}} className="linkPrimary"> <EditOutlinedIcon /></Link>
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                <Link onClick={handleClickOpen} className="linkSecondary"> <DeleteForeverOutlinedIcon  /></Link>
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
    <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={props.rows.length}
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
                Dou you really want to delete this User?
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