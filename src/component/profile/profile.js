import React,{ Component } from 'react'
import '../../assets/css/style.css';
import { Button,TextField } from '@material-ui/core';
// import Button from 'react-bootstrap-button-loader';

//pages
import Menu from '../common/menu'
import Footer from '../common/footer'

import axios from 'axios';

//notification
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class stockComponent extends Component {

    constructor(props){
        super(props)
        this.state ={
            loggedIn : props.loggedIn,
            userData : {},
            shopname: localStorage.getItem("shopName"),
            preShopname : localStorage.getItem("shopName"),
        }

        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)
      }

    onChange(e){
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    submitForm(e){
        e.preventDefault()
        const { shopname } = this.state

        axios.post('http://demo.lalitsharlawar.com/api/', 
        {username: localStorage.getItem('username'), shopname : shopname, preShopname : this.state.preShopname},
        {
            headers: { 
                Action : 'Profile', 
                Module: 'update-profile' ,
                token : localStorage.getItem('token'),
                'Access-Control-Allow-Origin':'*'
            },
        }
        )
          .then((response) => {
              console.log(response);
              if(response['data']['status']===1)
              {
                toast.success(response['data']['message']);
                localStorage.setItem("shopName", response['data']['data'][0]['company'])
                this.setState({
                    loggedIn: true,
                    preShopname : shopname
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
    }

    render(){
        return(
            <div className="body">
                <Menu loggedIn = { this.state.loggedIn} />
                <ToastContainer />
                <div className="continerBoxHeight">
                    <h3 className="pageTitle">Profile</h3>
                    <div className="container">
                        <form onSubmit = {this.submitForm}> 
                            <div className="form-field">
                                <TextField placeholder="Company name" className="inputDataBox" style={{color: 'black !important'}} id="standard-basic" label="Company name" name="shopname" value={this.state.shopname} onChange ={this.onChange} />
                            </div>
                            <div className="form-field">
                                <Button type="submit" className="inputData" variant="contained" color="primary">
                                    Update
                                </Button>
                        </div>
                        </form>
                    </div>

                </div>
                <Footer />
            </div>
        )
    }
}