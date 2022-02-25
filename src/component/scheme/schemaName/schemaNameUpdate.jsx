import React,{ Component } from 'react'
import '../../assets/css/style.css';
import {  Input, Button   } from '@material-ui/core';
import {   Link   } from "react-router-dom";
//pages
import Menu from '../common/menu'
import Footer from '../common/footer'

import { InputText } from 'primereact/inputtext';
import 'primeflex/primeflex.css';

//json
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';

//service 
import UserService from '../../service/user/userService'
import CompanyService from '../../service/company/companyService'

//object of services
const userService = new UserService();
const companyService = new CompanyService();

export default class stockComponent extends Component {

    constructor(props){
        super(props)
        this.state ={
            loggedIn : props.loggedIn,
            userData : {},
            success : false,
            branchname: props.location.state['branch'],
            item_type: props.location.state['item_type'],
            purity: props.location.state['purity'],
            price: props.location.state['price'],
            branch: props.branch,
            id: props.location.state['id']
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
        const { branchname, item_type, purity, price } = this.state

        let data = {
            username : localStorage.getItem("username"), 
            branchname : branchname ,
            item_type: item_type,
            purity: purity,
            price: price,
        }

        companyService.updateTodaysValue(data).then((response) =>{
            if(response['data']['status'] === 1)
            {
                toast.success(response['data']['message']);
                this.setState({
                    success: true,
                });
            } else {
                toast.error(response['data']['message']);
                this.setState({
                    loggedIn: false,
                });
            }
      }).catch((error) => {
            console.log(error)
            toast.current.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    }

    clearForm = () =>{
        this.setState({
            branchname:'',
        })
    }

    render(){

        const fontLebel ={padding:'10px 0px 10px', fontSize:'13px'}

        if(this.state.success)
        {
            return <Redirect to='/web-setting'></Redirect>
        }

        return(
            <div className="body">
                <Menu loggedIn = { this.state.loggedIn} />

                <form onSubmit = {this.submitForm} autoComplete="off"> 
                
                <div className="button_box_small_title">
                    <h3 className="pageTitle">Update Values</h3>
                </div>

                <div className="continerSmallBox">
                        
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Item Type</div>
                                <InputText id="username1" placeholder="Enter Item Type" aria-describedby="username1-help" style={{width:'100%'}} name="item_type" value={this.state.item_type} onChange={this.onChange} disabled/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Purity</div>
                                <InputText id="username1" placeholder="Enter Purity" aria-describedby="username1-help" style={{width:'100%'}} name="purity" value={this.state.purity} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                            <div className="p-col-12">
                                <div style={fontLebel}>Price</div>
                                <InputText id="username1" placeholder="Enter Price" aria-describedby="username1-help" style={{width:'100%'}} name="price" value={this.state.price} onChange={this.onChange}/>
                                {/* <div className="textDanger">{this.state.error}</div> */}
                            </div>
                        </div>
                    
                </div>
                <div className="button_box_small">
                            <div className="row">
                                    <div className="col-6">
                                        <Button type="submit" className="inputData buttonPrimary" variant="contained">
                                            <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">U</span>date</div>
                                        </Button>
                                        
                                    </div>
                                    <div className="col-1"></div>
                                    <div className="col-6">
                                        <Button className="inputData buttonSecondary" variant="contained" onClick={this.clearForm}>
                                            <div className="buttonText"> <i className="pi pi-trash"></i> <span className="buttonTextFirstLetter">C</span>lear</div>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                </form>
                <Footer />
            </div>
        )
    }
}