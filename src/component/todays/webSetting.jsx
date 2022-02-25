import React,{ Component } from 'react'

//libraries
import {  Input, Button  } from '@material-ui/core';

//internal css
import '../../assets/css/style.css';

//internal pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import BranchData from './branchData'

//model box
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';


export default class stockComponent extends Component {

    constructor(props){
        super(props)
        this.state ={
            loggedIn : props.loggedIn,
            userData : {},
            open : false,
            branch : [{branch:'Loading'}]
        }
        
        this.createData = this.createData.bind(this)
      }

    createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
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
                <div className="continerMediumBox">
                    {/* <div className="branchBox"> 
                        <div className="branchLeft">
                            <h3 className="pageTitle">Branch List</h3>
                        </div>
                        <div className="searchBox">
                          <Input className="searchInput" placeholder="Search Branch" name="search"></Input>
                        </div>
                        <div className="branchRight">
                            <Link to="/addbranch" className="Link">
                                <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                    <div className="buttonText"> + <span className="buttonTextFirstLetter">N</span>ew Branch</div>
                                </Button>
                            </Link>
                        </div>
                    </div> */}

                    <BranchData />
                    
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