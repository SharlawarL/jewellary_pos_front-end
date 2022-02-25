import React,{ Component } from 'react'
import { Link } from 'react-router-dom'
import '../../assets/css/menu.css';
//pages
import IdleTimer from 'react-idle-timer';
import Button from '@material-ui/core/Button';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';

// dialog
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

// import Vector from '../../assets/img/back9.jpg'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });




export default class idleComponent extends Component {

    constructor(props){
        super(props)
        this.state = {
            timeout: 10000 * 50 * 1,
            showModal: false,
            userLoggedIn: false,
            isTimedOut: false
        }

        this.idleTimer = null
        this.onAction = this._onAction.bind(this)
        this.onActive = this._onActive.bind(this)
        this.onIdle = this._onIdle.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleLogout = this.handleLogout.bind(this)
      }

      _onAction(e) {
        // console.log('user did something', e)
        this.setState({isTimedOut: false})
      }
     
      _onActive(e) {
        // console.log('user is active', e)
        this.setState({isTimedOut: false})
      }
     
      _onIdle(e) {
        // console.log('user is idle', e)
        const isTimedOut = this.state.isTimedOut
        if (isTimedOut) {
            // this.props.history.push('/')
        } else {
          this.setState({showModal: true})
          this.idleTimer.reset();
          this.setState({isTimedOut: true})
        }
        
      }
  
      handleClose() {
        this.setState({showModal: false})
      }
  
      handleLogout() {
        this.setState({showModal: false})
      }

    render(){

        return(
            <div>
            <IdleTimer
            ref={ref => { this.idleTimer = ref }}
            element={document}
            onActive={this.onActive}
            onIdle={this.onIdle}
            onAction={this.onAction}
            debounce={250}
            timeout={this.state.timeout} />
            
                {/* ***************************** timeout Function ****************************************** */}
                <Dialog
                    open={this.state.showModal}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle style={{width:'300px'}} id="alert-dialog-slide-title"> You Have Been Idle! <HelpOutlineOutlinedIcon style={{marginTop:'10px'}} /></DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            You Will Get Timed Out. You want to stay?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={this.handleClose} color="secondary">
                            <Link to='/logout' style={{textDecoration:'none',color: 'white'}}>Logout</Link>
                        </Button>
                        <Button variant="contained" onClick={this.handleClose} color="primary">
                            Stay 
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
