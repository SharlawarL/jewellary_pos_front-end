import React from 'react'
import {   Link   } from "react-router-dom";
import '../../assets/css/menu.css';
// import { Container, Row, Col } from 'react-bootstrap'
import { Redirect } from 'react-router-dom';

//pages
import Sidebar from './sidebar'
import IdleScreen from './idleScreen'

//icons
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import PowerSettingsNewOutlinedIcon from '@material-ui/icons/PowerSettingsNewOutlined';

//dropdown
import { Typography, Tooltip  } from '@material-ui/core';

// dialog
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';



import Logo from '../../assets/img/skj_logo.png';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function Menu(props) {
  const [openModel, setOpenModel] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);


  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const convertFirstCharacterToUppercase = (stringToConvert) => {
      var firstCharacter = stringToConvert.substring(0, 1);
      var restString = stringToConvert.substring(1);
      return firstCharacter.toUpperCase() + restString;
  }



  const modelhandleClickOpen = () => {
    setOpenModel(true);
  };

  const modelhandleClose = () => {
    setOpenModel(false);
  };

  function  confirmLogout(props){
    return <Redirect to='/'></Redirect>
  }


  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);



  const shopName = localStorage.getItem("shopName");
  var userName = ''
  if(localStorage.getItem("username"))
    userName = convertFirstCharacterToUppercase(localStorage.getItem("username"));
  const branch = localStorage.getItem("Branch");

  if(!localStorage.getItem("username"))
  {
    return <Redirect to='/'></Redirect>
  }



  return (
    <div>
      {/* ***************************** Top Bar ****************************************** */}
      <div className="topBar">
        <div className="logoBox">
          <div className="websiteTitle"> 
          <div className="row"> 
            <div className="col-1">
              <img alt="Loading"  src={Logo} className="logoCompany" style={{backgroundColor:'white', borderRadius:'15px', border:'1px solid red',marginTop: '3px'}} width="25px" height="25px"/> 
            </div>
            <div className="col-8">
              <div className="titleCompany"> {shopName} , <span className="websiteBranch"> {branch} </span> </div>
            </div>
          </div>
          </div>
          
        </div>
        <div className="avtarBox">
          <div className="UserInfoBox">
            <div className="UserInfoLogin">
              <Typography> Login as : { userName } </Typography>
            </div>
            <div className="UserInfoButton">
              <Tooltip title="Home" aria-label="Home">
                <Link className="menuMainLink" to='/home' style={{color: '#1b1b1b'}}><HomeOutlinedIcon /> </Link> 
              </Tooltip>
            </div>
            <div className="UserInfoButton">
              <Tooltip title="Logout" aria-label="Logout">
                <PowerSettingsNewOutlinedIcon onClick={modelhandleClickOpen} />
              </Tooltip>
            </div>
          </div>
            
        </div>
      </div>

      {/* ***************************** Logout Model Box ****************************************** */}
      <Dialog
        open={openModel}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{width:'300px'}} id="alert-dialog-slide-title"> Confirm Logout <HelpOutlineOutlinedIcon style={{marginTop:'10px'}} /></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          Are you sure, You want to logout!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className="buttonDivSecondary" variant="contained" onClick={modelhandleClose}>
            Cancel 
          </div>
          <Link to='/logout' style={{textDecoration:'none',color: 'white'}}>
            <div className="buttonDivPrimary" variant="contained" onClick={confirmLogout}>
              Sure
            </div>
          </Link>
        </DialogActions>
      </Dialog>
      {/* ***************************** Menu Bar ****************************************** */}
      <Sidebar className="drawerRespDesk" />
      <IdleScreen />
    </div>
  );
}
