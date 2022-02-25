import React, { Component } from 'react'
import '../../assets/css/style.css';
import { Button } from '@material-ui/core';
import { Link } from "react-router-dom";

//pages
import Menu from '../common/menu'
import Footer from '../common/footer'
import 'primeflex/primeflex.css';

// import { ToastContainer, toast } from 'react-toastify';
import { Toast } from 'primereact/toast';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';

import SupplierService from '../../service/supplier/supplierService'

//object of services
const supplierService = new SupplierService();

export default class stockComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loggedIn: props.loggedIn,
            userData: {},
            success: false,
            from:'',
            to: '',
            gname : '',
            gnameList: {}
        }

        this.getGname()
        this.onChange = this.onChange.bind(this)
        this.submitForm = this.submitForm.bind(this)

    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    getGname() {

        let data = {
            login_user : localStorage.getItem("username"),
            branch: localStorage.getItem("Branch"),
            type :'supplier-list'
        }

        supplierService.getSupplier(data).then((response) => {
            if (response['data']['status'] === 1) {
                response['data']['data'].map( data =>{
                    data['name'] = data['cname']
                })
                this.setState({
                    gnameList: response['data']['data'],
                })
            }
      }).catch((error) => {
            console.log(error)
            this.toast.show({severity:'error', summary: 'Message', detail:'Check Connection', life: 3000});
        })

    }



    submitForm(e) {
        e.preventDefault()
            const {

            } = this.state

            let data = {
                login_user: localStorage.getItem("username"),
                branch: localStorage.getItem("Branch"),
            }


            // itemService.saveItem(data).then((response) => {
            //     if (response['data']['status'] === 1) {
            //         this.toast.show({severity:'success', summary: 'Message', detail:response['data']['message'], life: 3000});
            //         this.setState({
            //             success: true,
            //         });
            //         this.clearForm();
            //     } else {
            //         // toast.error(response['data']['message']);
            //         this.toast.show({severity:'error', summary: 'Message', detail:response['data']['message'], life: 3000});
            //         this.setState({
            //             loggedIn: false,
            //         });
            //     }
            // }).catch((error) => {
            //     console.log(error)
            // })
    }

  
    render() {

        const fontLebel ={padding:'10px 0px 10px', fontSize:'13px'}

        return (
            <div className="body">
                <Toast ref={(el) => this.toast = el} />
                <Menu loggedIn={this.state.loggedIn} />
                <form onSubmit={this.submitForm} autoComplete="off">
                <div className="button_box_small_title">
                    <h3 className="pageTitle">Supplier Book </h3>
                </div>
                <div className="continerSmallBox"> 
                    
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>From </div>
                                <Calendar id="basic"  style={{ width: '100%' }} placeholder="Select From Date"  value={this.state.from} onChange={(e) => this.setState({ from: e.value })} dateFormat="dd/mm/yy" yearRange="1950:2030"  showIcon/>
                            </div>
                        </div>
                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>To </div>
                                <Calendar id="basic"  style={{ width: '100%' }} placeholder="Select To Date"  value={this.state.to} onChange={(e) => this.setState({ to: e.value })} dateFormat="dd/mm/yy" yearRange="1950:2030"  showIcon/>
                            </div>
                        </div>

                        <div className="p-grid">
                            <div className="p-col-12">
                                <div style={fontLebel}>Supplier Name</div>
                                <Dropdown style={{width:'100%'}} value={this.state.gname} options={this.state.gnameList} onChange={(e) => this.setState({ gname: e.value })} optionLabel="name" placeholder="Select Supplier" />
                            </div>
                        </div>
                        <br></br>
                        <br></br>
                        (<span style={{color:'red'}}>Note :</span> All above are mandatory.)

                        
                </div>
                <div className="button_box_small">
                    <div className="row">
                        <div className="col-6">
                        <Link 
                            to={{
                                pathname: (this.state.from && this.state.to && this.state.gname.name) ? "/supplier-book-print" : '/supplier-book',
                                state: {
                                    from: this.state.from,
                                    to : this.state.to,
                                    gname : this.state.gname.name
                                }
                            }}
                            className="Link">
                                <Button type="submit" className="inputData buttonPrimary" variant="contained" onClick={this.submitForm} disabled>
                                    <div className="buttonText"> <i className="pi pi-save"></i> <span className="buttonTextFirstLetter">G</span>enerate</div>
                                </Button>
                            </Link>
                            
                        </div>
                        <div className="col-1"></div>
                        <div className="col-6">
                                <Button type="submit" className="inputData buttonSecondary" variant="contained" onClick={this.clearForm}>
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