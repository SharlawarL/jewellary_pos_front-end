import React,{ Component } from 'react'

import '../../assets/css/style.css';
//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import PurchaseData from './purchaseData'

import {  Input, Button   } from '@material-ui/core';


import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

//service 
import UserService from '../../service/user/userService'

//object of services
const userService = new UserService();

export default class stockComponent extends Component {

    constructor(props){
        super(props)
        this.state ={
            loggedIn : props.loggedIn,
            userData : {},
            open : false,
            branch : [{branch:'Loading'}]
        }
        this.getTotalBranch();
        this.createData = this.createData.bind(this)
      }

    createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    getTotalBranch()
    {
        let data = {username : localStorage.getItem("username")}

        userService.getTotalBranch(data).then((response) =>{
            if(response['data']['status'] === 1)
            {
                this.setState({
                    branch : response['data']['data']
                })
            } 
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    }


    render(){

        
          const handleClose = () => {
            this.setState(
                {
                    open : false
                }
            )
          };

          const Transition = React.forwardRef(function Transition(props, ref) {
            return <Slide direction="up" ref={ref} {...props} />;
          });

        return(
            <div className="body">
                <Menu loggedIn = { this.state.loggedIn} />
                <div className="continerBigMediumBox">

                    {/* New Branch */}
                    <PurchaseData />
                    
                </div>
                <Footer />

                <Dialog
                    open={ this.state.open }
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle  style={{width:'400px'}} id="alert-dialog-slide-title">{"Add Branch"}</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                            <form>
                                <Input className="InputBox" placeholder="Enter Branch Name" />
                            </form>
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Save
                    </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}